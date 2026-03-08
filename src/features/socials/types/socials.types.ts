export interface SystemParameterDto {
  id: number;
  key: string;
  value: string;
  dataType: string;
  description: string;
  category: string;
  isActive: boolean;
}

export type SocialKey =
  | "instagram"
  | "snapchat"
  | "tiktok"
  | "x"
  | "facebook"
  | "whatsapp"
  | "phone"
  | "email"
  | "youtube";

export interface SocialsFormData {
  instagram: string;
  snapchat: string;
  tiktok: string;
  x: string;
  facebook: string;
  whatsapp: string;
  phone: string;
  email: string;
  youtube: string;
}

export interface SocialParam extends SystemParameterDto {
  key: SocialKey;
}
