// /src/types/laboratory.ts
export interface Laboratory {
  id: string;
  name: string;
  location: { city: string; state: string; lat?: number; lng?: number };
  testingScope: string[];
  applicableStandards: string[];  // Standard ids
  productCategories: string[];
  accreditation: { body: string; validTill: string; scopeNote: string }[];
  contact?: { note: string };     // demo-safe, never fabricate real contacts
  // Legacy/extended fields
  accreditationNumber?: string;
  city?: string;
  state?: string;
  nablStatus?: string;
  type?: string;
  disciplines?: string[];
  turnaroundDays?: number;
  onlineBooking?: boolean;
  email?: string;
  phone?: string;
  standards?: string[];
}
