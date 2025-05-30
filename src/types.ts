import { z } from 'zod';

export const identifySchema = z.object({
  email: z.string().email().optional().nullable(),
  phoneNumber: z.string().min(1).optional().nullable(),
}).refine(
  (data) => data.email || data.phoneNumber,
  "Either email or phoneNumber must be provided"
);

export type IdentifyRequest = z.infer<typeof identifySchema>;

export interface IdentifyResponse {
  contact: {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  };
}