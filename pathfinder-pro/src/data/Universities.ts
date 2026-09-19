// File: src/data/universities.ts
export interface UniversityProgram {
  id: string;
  university: string;
  country: string;
  city: string;
  program: string;
  field: 'computer_science' | 'business' | 'engineering' | 'medicine' | 'humanities';
  tuitionUSD: number;
  scholarshipAvailable: boolean;
  scholarshipName?: string;
  minIELTS: number;
  minGPA: number;
  minUNT?: number;
  deadline: string;
  officialURL: string;
  verifiedAt: string;
  demoData: boolean;
}

export const UNIVERSITY_DATASET: UniversityProgram[] = [
  {
    id: "aitu_cs",
    university: "Astana IT University (AITU)",
    country: "Казахстан",
    city: "Астана",
    program: "Software Engineering & Computer Science",
    field: "computer_science",
    tuitionUSD: 2200,
    scholarshipAvailable: true,
    scholarshipName: "Государственный грант РК",
    minIELTS: 5.5,
    minGPA: 3.2,
    minUNT: 85,
    deadline: "2026-07-25",
    officialURL: "https://astanait.edu.kz",
    verifiedAt: "2026-09-15",
    demoData: false
  },
  {
    id: "nu_cs",
    university: "Nazarbayev University (NU)",
    country: "Казахстан",
    city: "Астана",
    program: "BSc in Computer Science",
    field: "computer_science",
    tuitionUSD: 12000,
    scholarshipAvailable: true,
    scholarshipName: "Abay Grant / Полное финансирование",
    minIELTS: 6.5,
    minGPA: 3.7,
    deadline: "2026-04-15",
    officialURL: "https://nu.edu.kz",
    verifiedAt: "2026-09-18",
    demoData: false
  },
  {
    id: "tum_cs",
    university: "Technical University of Munich (TUM)",
    country: "Германия",
    city: "Мюнхен",
    program: "B.Sc. Informatics",
    field: "computer_science",
    tuitionUSD: 3500,
    scholarshipAvailable: true,
    scholarshipName: "DAAD / Deutschlandstipendium",
    minIELTS: 6.5,
    minGPA: 3.6,
    deadline: "2026-07-15",
    officialURL: "https://tum.de",
    verifiedAt: "2026-09-10",
    demoData: true
  },
  {
    id: "tudelft_cs",
    university: "TU Delft",
    country: "Нидерланды",
    city: "Делфт",
    program: "BSc Computer Science and Engineering",
    field: "computer_science",
    tuitionUSD: 16500,
    scholarshipAvailable: true,
    scholarshipName: "Excellence Scholarship",
    minIELTS: 7.0,
    minGPA: 3.8,
    deadline: "2026-01-15",
    officialURL: "https://tudelft.nl",
    verifiedAt: "2026-09-01",
    demoData: true
  },
  {
    id: "kaist_cs",
    university: "KAIST",
    country: "Южная Корея",
    city: "Тэджон",
    program: "School of Computing (B.S.)",
    field: "computer_science",
    tuitionUSD: 7000,
    scholarshipAvailable: true,
    scholarshipName: "KAIST International Student Scholarship",
    minIELTS: 6.5,
    minGPA: 3.5,
    deadline: "2026-05-20",
    officialURL: "https://kaist.ac.kr",
    verifiedAt: "2026-09-12",
    demoData: true
  },
  {
    id: "kaznu_math",
    university: "КазНУ им. аль-Фараби",
    country: "Казахстан",
    city: "Алматы",
    program: "Информационные системы и Математика",
    field: "computer_science",
    tuitionUSD: 1800,
    scholarshipAvailable: true,
    scholarshipName: "Государственный образовательный грант",
    minIELTS: 5.0,
    minGPA: 3.0,
    minUNT: 75,
    deadline: "2026-07-20",
    officialURL: "https://kaznu.kz",
    verifiedAt: "2026-09-14",
    demoData: false
  }
];