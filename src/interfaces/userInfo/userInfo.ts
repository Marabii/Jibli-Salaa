import { Language } from "./Language";

export interface UserInfo {
  createdAt: Date;
  phoneNumber: string;
  spokenLanguages: Language[];
  name: string;
  email: string;
  isAuthenticatedByGoogle: boolean;
  profilePicture: string;
  _id: string;
}
