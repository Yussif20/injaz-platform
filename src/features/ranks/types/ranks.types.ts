export interface RankDto {
  id: number;
  titleMale: string;
  titleFemale: string;
  title: string;
}

export interface CreateRankDto {
  titleMale: string;
  titleFemale: string;
}

export type UpdateRankDto = CreateRankDto;
