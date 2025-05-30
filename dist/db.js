"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
exports.identifyContact = identifyContact;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
function identifyContact(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, phoneNumber } = request;
        const foundContacts = yield prisma.contact.findMany({
            where: {
                OR: [email ? { email } : {}, phoneNumber ? { phoneNumber } : {}].filter((condition) => Object.keys(condition).length > 0),
                deletedAt: null,
            },
            orderBy: { createdAt: "asc" },
        });
        if (foundContacts.length === 0) {
            const newContact = yield prisma.contact.create({
                data: { email, phoneNumber, linkPrecedence: "primary" },
            });
            return formatResponse([newContact]);
        }
        const exactMatch = foundContacts.find((c) => c.email === email && c.phoneNumber === phoneNumber);
        if (!exactMatch && hasNewInfo(foundContacts, email, phoneNumber)) {
            const primaryContact = yield findPrimary(foundContacts[0]);
            const secondaryContact = yield prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkedId: primaryContact.id,
                    linkPrecedence: "secondary",
                },
            });
            foundContacts.push(secondaryContact);
        }
        yield linkPrimaries(foundContacts);
        const allRelated = yield getAllRelated(foundContacts);
        return formatResponse(allRelated);
    });
}
function hasNewInfo(contacts, email, phoneNumber) {
    const emailExists = email ? contacts.some((c) => c.email === email) : false;
    const phoneExists = phoneNumber
        ? contacts.some((c) => c.phoneNumber === phoneNumber)
        : false;
    return Boolean(email && !emailExists) || Boolean(phoneNumber && !phoneExists);
}
function findPrimary(contact) {
    return __awaiter(this, void 0, void 0, function* () {
        if (contact.linkPrecedence === "primary")
            return contact;
        if (contact.linkedId) {
            const linkedContact = yield prisma.contact.findUnique({
                where: { id: contact.linkedId },
            });
            if (linkedContact)
                return findPrimary(linkedContact);
        }
        return contact;
    });
}
function linkPrimaries(contacts) {
    return __awaiter(this, void 0, void 0, function* () {
        const primaryContacts = contacts.filter((c) => c.linkPrecedence === "primary");
        if (primaryContacts.length > 1) {
            primaryContacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            const oldest = primaryContacts[0];
            const toUpdate = primaryContacts.slice(1);
            for (const contact of toUpdate) {
                yield prisma.contact.update({
                    where: { id: contact.id },
                    data: { linkedId: oldest.id, linkPrecedence: "secondary" },
                });
                yield prisma.contact.updateMany({
                    where: { linkedId: contact.id },
                    data: { linkedId: oldest.id },
                });
            }
        }
    });
}
function getAllRelated(contacts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (contacts.length === 0)
            return [];
        const primaryContact = yield findPrimary(contacts[0]);
        return yield prisma.contact.findMany({
            where: {
                OR: [{ id: primaryContact.id }, { linkedId: primaryContact.id }],
                deletedAt: null,
            },
            orderBy: { createdAt: "asc" },
        });
    });
}
function formatResponse(contacts) {
    const primary = contacts.find((c) => c.linkPrecedence === "primary");
    const secondaries = contacts.filter((c) => c.linkPrecedence === "secondary");
    const emails = [
        ...new Set([primary === null || primary === void 0 ? void 0 : primary.email, ...secondaries.map((c) => c.email)].filter(Boolean)),
    ];
    const phoneNumbers = [
        ...new Set([primary === null || primary === void 0 ? void 0 : primary.phoneNumber, ...secondaries.map((c) => c.phoneNumber)].filter(Boolean)),
    ];
    return {
        contact: {
            primaryContactId: primary.id,
            emails,
            phoneNumbers,
            secondaryContactIds: secondaries.map((c) => c.id),
        },
    };
}
