export interface RankDto {
  id: number;
  titleMale: string;
  titleFemale: string;
  title: string; // Combined/display title
}

// Backend CreateRankDto
export interface CreateRankDto {
  titleMale: string; // Required: Male title (e.g., "معلم")
  titleFemale: string; // Required: Female title (e.g., "معلمة")
}

export type UpdateRankDto = CreateRankDto;
