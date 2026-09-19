// File: src/engine/recommendationEngine.ts
import { UNIVERSITY_DATASET, UniversityProgram } from '../data/universities';

export interface UserProfile {
  fullName: string;
  educationLevel: string;
  grade: number;
  gpa: number;
  targetCountries: string[];
  fieldInterest: string;
  targetBudgetUSD: number;
  requireScholarship: boolean;
  englishLevel: string;
  ieltsScore: number;
  untTotalScore?: number;
}

export interface EvaluatedUniversity {
  program: UniversityProgram;
  matchScore: number;
  matchedCriteria: string[];
  missingCriteria: string[];
  reasons: string[];
  constraints: string[];
}

export function evaluateUniversities(profile: UserProfile): EvaluatedUniversity[] {
  return UNIVERSITY_DATASET.map((item) => {
    let score = 0;
    const matchedCriteria: string[] = [];
    const missingCriteria: string[] = [];
    const reasons: string[] = [];
    const constraints: string[] = [];

    // 1. Страна (25 баллов)
    if (profile.targetCountries.includes(item.country) || profile.targetCountries.includes("Любая")) {
      score += 25;
      matchedCriteria.push("Целевая страна");
      reasons.push(`Соответствует приоритету страны (${item.country}).`);
    } else {
      constraints.push(`Страна (${item.country}) вне первоочередного выбора.`);
    }

    // 2. Бюджетная совместимость (25 баллов)
    if (item.tuitionUSD <= profile.targetBudgetUSD) {
      score += 25;
      matchedCriteria.push("Бюджетное соответствие");
      reasons.push(`Стоимость ($${item.tuitionUSD}/год) полностью покрывается вашим бюджетом ($${profile.targetBudgetUSD}).`);
    } else if (item.scholarshipAvailable && profile.requireScholarship) {
      score += 18;
      matchedCriteria.push("Доступен стипендиальный грант");
      reasons.push(`Превышает прямой бюджет, но доступна грантовая программа: ${item.scholarshipName}.`);
    } else {
      missingCriteria.push("Превышение бюджета");
      constraints.push(`Стоимость ($${item.tuitionUSD}/год) выше лимита в $${profile.targetBudgetUSD}.`);
    }

    // 3. Академическое направление (20 баллов)
    if (item.field === profile.fieldInterest || profile.fieldInterest === 'computer_science') {
      score += 20;
      matchedCriteria.push("Направление обучения");
      reasons.push(`Программа (${item.program}) точно отвечает профилю подготовки.`);
    }

    // 4. Требования к языку (15 баллов)
    if (profile.ieltsScore >= item.minIELTS) {
      score += 15;
      matchedCriteria.push("Уровень английского");
      reasons.push(`Ваш IELTS (${profile.ieltsScore}) покрывает требуемый минимум (${item.minIELTS}).`);
    } else {
      missingCriteria.push("Дефицит IELTS");
      constraints.push(`Требуется подтвердить IELTS ${item.minIELTS} (текущий балл: ${profile.ieltsScore}).`);
    }

    // 5. Успеваемость GPA (15 баллов)
    if (profile.gpa >= item.minGPA) {
      score += 15;
      matchedCriteria.push("Академический GPA");
      reasons.push(`GPA (${profile.gpa}) соответствует порогу зачисления (${item.minGPA}).`);
    } else {
      constraints.push(`Текущий GPA (${profile.gpa}) ниже проходного показателя (${item.minGPA}).`);
    }

    return {
      program: item,
      matchScore: Math.min(100, Math.max(35, score)),
      matchedCriteria,
      missingCriteria,
      reasons,
      constraints
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}