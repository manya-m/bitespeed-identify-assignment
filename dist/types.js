"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifySchema = void 0;
const zod_1 = require("zod");
exports.identifySchema = zod_1.z.object({
    email: zod_1.z.string().email().optional().nullable(),
    phoneNumber: zod_1.z.string().min(1).optional().nullable(),
}).refine((data) => data.email || data.phoneNumber, "Either email or phoneNumber must be provided");
