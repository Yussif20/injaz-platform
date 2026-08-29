export interface ReviewDto {
  id: number;
  content: string | null;
  rating: number;
  reviewerName: string | null;
  reviewerJobTitle: string | null;
  reviewerPhotoPath: string | null;
  publicUrl: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateReviewDto {
  content: string;
  rating: number;
  reviewerName: string;
  reviewerJobTitle: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateReviewDto {
  content?: string | null;
  rating?: number | null;
  reviewerName?: string | null;
  reviewerJobTitle?: string | null;
  displayOrder?: number | null;
  isActive?: boolean | null;
}
