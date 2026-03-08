import type { ApiResponse } from "@/shared/types";
import { API_ENDPOINTS, proxyApi } from "@/shared/lib/api";
import { unwrapResponse } from "@/shared/lib/api-helpers";
import type { SystemParameterDto } from "../types/socials.types";
import type { SocialKey, SocialsFormData } from "../types/socials.types";

const DATA_TYPE_MAP: Record<SocialKey, string> = {
  instagram: "url",
  snapchat: "url",
  tiktok: "url",
  x: "url",
  facebook: "url",
  whatsapp: "url",
  phone: "phone",
  email: "email",
  youtube: "url",
};

export async function getSocialsData(): Promise<SystemParameterDto[]> {
  const response = await proxyApi.get<ApiResponse<SystemParameterDto[]>>(
    API_ENDPOINTS.SYSTEM_PARAMETERS.BY_CATEGORY("socials"),
  );
  return unwrapResponse(response);
}

export async function saveSocialsData(
  formData: SocialsFormData,
  existingParams: SystemParameterDto[],
): Promise<SystemParameterDto[]> {
  const existingMap = new Map<string, SystemParameterDto>(
    existingParams.map((p) => [p.key, p]),
  );

  const SOCIAL_KEYS: SocialKey[] = [
    "instagram",
    "snapchat",
    "tiktok",
    "x",
    "facebook",
    "whatsapp",
    "phone",
    "email",
    "youtube",
  ];

  const saves = SOCIAL_KEYS.flatMap((key) => {
    const existing = existingMap.get(key);
    const value = formData[key] ?? "";

    if (existing) {
      // PUT even when empty — allows clearing an existing value
      return [
        proxyApi
          .put<ApiResponse<SystemParameterDto>>(
            API_ENDPOINTS.SYSTEM_PARAMETERS.BY_ID(existing.id),
            { value },
          )
          .then(unwrapResponse),
      ];
    }

    // Skip POST when value is empty — backend rejects empty value on creation
    if (!value.trim()) return [];

    return [
      proxyApi
        .post<ApiResponse<SystemParameterDto>>(
          API_ENDPOINTS.SYSTEM_PARAMETERS.BASE,
          {
            key,
            value,
            dataType: DATA_TYPE_MAP[key],
            category: "socials",
            description: key,
            isActive: true,
          },
        )
        .then(unwrapResponse),
    ];
  });

  return Promise.all(saves);
}
