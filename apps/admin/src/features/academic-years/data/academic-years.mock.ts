export type YearStatus = "active" | "inactive" | "expired";

export interface AcademicYear {
  id: number;
  hijriYear: string;
  gregorianYear: string;
  status: YearStatus;
  subscription: number;
  activeOffer: string | null;
  filesCount: number;
}

export const mockAcademicYears: AcademicYear[] = [
  {
    id: 1,
    hijriYear: "1446",
    gregorianYear: "2025",
    status: "active",
    subscription: 70,
    activeOffer: null,
    filesCount: 24,
  },
  {
    id: 2,
    hijriYear: "1445",
    gregorianYear: "2024",
    status: "active",
    subscription: 70,
    activeOffer: null,
    filesCount: 18,
  },
  {
    id: 3,
    hijriYear: "1444",
    gregorianYear: "2023",
    status: "inactive",
    subscription: 60,
    activeOffer: null,
    filesCount: 32,
  },
  {
    id: 4,
    hijriYear: "1443",
    gregorianYear: "2022",
    status: "expired",
    subscription: 60,
    activeOffer: null,
    filesCount: 15,
  },
  {
    id: 5,
    hijriYear: "1442",
    gregorianYear: "2021",
    status: "expired",
    subscription: 50,
    activeOffer: null,
    filesCount: 10,
  },
  {
    id: 6,
    hijriYear: "1441",
    gregorianYear: "2020",
    status: "expired",
    subscription: 50,
    activeOffer: null,
    filesCount: 8,
  },
  {
    id: 7,
    hijriYear: "1440",
    gregorianYear: "2019",
    status: "expired",
    subscription: 40,
    activeOffer: null,
    filesCount: 5,
  },
];
