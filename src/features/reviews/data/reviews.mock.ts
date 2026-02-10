export interface Review {
  id: number;
  clientName: string;
  jobTitle: string;
  avatar: string | null;
  rating: number;
  content: string;
  isPublished: boolean;
  daysAgo: number;
}

export const mockReviews: Review[] = [
  {
    id: 1,
    clientName: "نورا عبد الله",
    jobTitle: "معلم ممارس",
    avatar: null,
    rating: 5,
    content:
      "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
    isPublished: true,
    daysAgo: 10,
  },
  {
    id: 2,
    clientName: "عبدالله الراجحي",
    jobTitle: "معلم خبير",
    avatar: null,
    rating: 5,
    content:
      "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
    isPublished: true,
    daysAgo: 10,
  },
  {
    id: 3,
    clientName: "نورا عبد الله",
    jobTitle: "معلم ممارس",
    avatar: null,
    rating: 5,
    content:
      "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
    isPublished: false,
    daysAgo: 10,
  },
  {
    id: 4,
    clientName: "عبدالله الراجحي",
    jobTitle: "معلم خبير",
    avatar: null,
    rating: 5,
    content:
      "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
    isPublished: true,
    daysAgo: 10,
  },
];
