import { HowToUseContent } from "@/features/dashboard/components/HowToUseContent";
import { BACKEND_API_URL } from "@/shared/lib/api";
import { getAccessToken } from "@/shared/lib/cookies";

interface SystemParameterDto {
  id: number;
  key: string;
  value: string;
  dataType: string;
  category: string;
  isActive: boolean;
}

async function fetchYoutubeUrl(): Promise<string | null> {
  try {
    const token = await getAccessToken();
    const headers: HeadersInit = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    const res = await fetch(
      `${BACKEND_API_URL}/api/SystemParameters/category/socials`,
      { headers, next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== "Success" || !Array.isArray(json.data)) return null;

    const youtube = (json.data as SystemParameterDto[]).find(
      (p) => p.key === "youtube",
    );
    return youtube?.value || null;
  } catch {
    return null;
  }
}

export default async function HowToUsePage() {
  const youtubeUrl = await fetchYoutubeUrl();
  return <HowToUseContent youtubeUrl={youtubeUrl} />;
}
