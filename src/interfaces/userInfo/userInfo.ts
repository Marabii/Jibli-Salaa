import { ROLE } from "./userRole";

export interface UserInfo {
  createdAt: Date;
  phoneNumber: string;
  name: string;
  email: string;
  isAuthenticatedByGoogle: boolean;
  profilePicture: string;
  _id: string;
  role: ROLE;
  contacts: Contact[];
  countryCode: string;
  userBankCurrency: string;
}

export interface Contact {
  contactId: string;
  orderId: string;
  contactName: string;
}

export interface ExchangeRate {
  source: string;
  target: string;
  rate: number;
}
