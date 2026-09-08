export type ThemeId =
  | "dark"
  | "minimal"
  | "gradient"
  | "terminal"
  | "notion"
  | "bento"
  | "cyberpunk"
  | "sunset";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  desc: string;
  previewClass: string;
  isPro: boolean;
}

export interface CardConfig {
  title: string;
  tag: string;
  theme: ThemeId;
  licenseKey?: string;
  description?: string;
}

export type LicenseVerificationStatus = "idle" | "verifying" | "valid" | "invalid";

export interface VerifyLicenseResponse {
  valid: boolean;
  message?: string;
  plan?: string;
}

export interface PresetItem {
  title: string;
  tag: string;
  theme: ThemeId;
}
