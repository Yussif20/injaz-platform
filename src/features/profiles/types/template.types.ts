/**
 * Template Types
 * Types for profile templates (layouts/designs)
 *
 * NOTE: Templates control the overall UI layout and design.
 * Themes (in theme.types.ts) control only the color scheme.
 * A profile has ONE template and can use ANY theme with it.
 */

// Template IDs - matches backend values
export enum TemplateId {
  Default = 1,
  Dark = 2,
  Heritage = 3,
  Arabic = 4,
}

// Template layout types
export type TemplateLayoutType = "default" | "dark" | "heritage" | "arabic";

// Template feature flags
export interface TemplateFeatures {
  hasHeaderCurve: boolean; // Curved shape behind header
  hasProfileImageBorder: boolean; // Border around profile image
  hasSectionIcons: boolean; // Icons in section headers
  hasCardShadows: boolean; // Shadow on cards
  hasRoundedCards: boolean; // Rounded corners on cards
  hasDividers: boolean; // Dividers between sections
  hasBackgroundPattern: boolean; // Background pattern/texture
}

// Template style configuration
export interface TemplateStyleConfig {
  headerStyle: "centered" | "left-aligned" | "split";
  cardStyle: "elevated" | "flat" | "bordered" | "minimal";
  sectionStyle: "accordion" | "cards" | "list" | "tabs";
  spacing: "compact" | "normal" | "relaxed";
  fontStyle: "modern" | "traditional" | "elegant";
  imageGridStyle: "masonry" | "grid" | "carousel" | "list";
}

// Full template configuration
export interface Template {
  id: number;
  name: string; // Internal name (e.g., "classic")
  nameArabic: string; // Arabic display name
  description: string; // Arabic description
  previewImageUrl: string | null; // Template preview image
  layoutType: TemplateLayoutType;
  features: TemplateFeatures;
  styleConfig: TemplateStyleConfig;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Simplified template for list views
export interface TemplateSummary {
  id: number;
  name: string;
  nameArabic: string;
  description: string;
  previewImageUrl: string | null;
  layoutType: TemplateLayoutType;
  isActive: boolean;
  displayOrder: number;
}

// API Response types
export interface TemplatesResponse {
  status: boolean;
  message: string;
  data?: Template[];
  errors?: string[] | null;
}

export interface TemplateResponse {
  status: boolean;
  message: string;
  data?: Template;
  errors?: string[] | null;
}

// Request types (for updating profile template)
export interface UpdateProfileTemplateRequest {
  templateId: number;
}

// ============================================
// Default Template Configurations
// These are used for bypass mode and as fallbacks
// ============================================

export const TEMPLATE_CONFIGS: Record<TemplateId, Template> = {
  [TemplateId.Default]: {
    id: TemplateId.Default,
    name: "default",
    nameArabic: "افتراضي",
    description: "تصميم تقليدي أنيق مع عناصر منحنية وألوان هادئة",
    previewImageUrl: null,
    layoutType: "default",
    features: {
      hasHeaderCurve: true,
      hasProfileImageBorder: true,
      hasSectionIcons: true,
      hasCardShadows: true,
      hasRoundedCards: true,
      hasDividers: false,
      hasBackgroundPattern: false,
    },
    styleConfig: {
      headerStyle: "centered",
      cardStyle: "elevated",
      sectionStyle: "accordion",
      spacing: "normal",
      fontStyle: "traditional",
      imageGridStyle: "grid",
    },
    isActive: true,
    displayOrder: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  [TemplateId.Dark]: {
    id: TemplateId.Dark,
    name: "dark",
    nameArabic: "داكن",
    description: "تصميم حديث وبسيط مع خطوط نظيفة وتخطيط متناسق",
    previewImageUrl: null,
    layoutType: "dark",
    features: {
      hasHeaderCurve: false,
      hasProfileImageBorder: false,
      hasSectionIcons: false,
      hasCardShadows: false,
      hasRoundedCards: false,
      hasDividers: true,
      hasBackgroundPattern: false,
    },
    styleConfig: {
      headerStyle: "left-aligned",
      cardStyle: "flat",
      sectionStyle: "cards",
      spacing: "compact",
      fontStyle: "modern",
      imageGridStyle: "masonry",
    },
    isActive: true,
    displayOrder: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  [TemplateId.Heritage]: {
    id: TemplateId.Heritage,
    name: "heritage",
    nameArabic: "تراثي",
    description: "تصميم راقي ومميز مع تفاصيل دقيقة وأناقة عالية",
    previewImageUrl: null,
    layoutType: "heritage",
    features: {
      hasHeaderCurve: true,
      hasProfileImageBorder: true,
      hasSectionIcons: true,
      hasCardShadows: true,
      hasRoundedCards: true,
      hasDividers: true,
      hasBackgroundPattern: true,
    },
    styleConfig: {
      headerStyle: "centered",
      cardStyle: "bordered",
      sectionStyle: "accordion",
      spacing: "relaxed",
      fontStyle: "elegant",
      imageGridStyle: "grid",
    },
    isActive: true,
    displayOrder: 3,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  [TemplateId.Arabic]: {
    id: TemplateId.Arabic,
    name: "arabic",
    nameArabic: "عربي",
    description: "تصميم إبداعي ومرن مع عناصر ديناميكية وتخطيط فريد",
    previewImageUrl: null,
    layoutType: "arabic",
    features: {
      hasHeaderCurve: false,
      hasProfileImageBorder: true,
      hasSectionIcons: true,
      hasCardShadows: true,
      hasRoundedCards: true,
      hasDividers: false,
      hasBackgroundPattern: true,
    },
    styleConfig: {
      headerStyle: "split",
      cardStyle: "minimal",
      sectionStyle: "tabs",
      spacing: "normal",
      fontStyle: "modern",
      imageGridStyle: "carousel",
    },
    isActive: true,
    displayOrder: 4,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
};

// Helper to get template by ID
export function getTemplateConfig(templateId: number): Template {
  return (
    TEMPLATE_CONFIGS[templateId as TemplateId] ||
    TEMPLATE_CONFIGS[TemplateId.Default]
  );
}

// Helper to get all templates as array
export function getAllTemplates(): Template[] {
  return Object.values(TEMPLATE_CONFIGS).sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );
}

// Helper to get template summaries
export function getTemplateSummaries(): TemplateSummary[] {
  return getAllTemplates().map(
    ({
      id,
      name,
      nameArabic,
      description,
      previewImageUrl,
      layoutType,
      isActive,
      displayOrder,
    }) => ({
      id,
      name,
      nameArabic,
      description,
      previewImageUrl,
      layoutType,
      isActive,
      displayOrder,
    }),
  );
}
