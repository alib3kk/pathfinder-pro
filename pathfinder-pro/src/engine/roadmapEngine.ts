// File: src/engine/roadmapEngine.ts
import { UserProfile, EvaluatedUniversity } from './recommendationEngine';

export interface RoadmapTask {
  id: string;
  stage: 'now' | 'next' | 'future';
  title: string;
  description: string;
  deadline: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  linkedUniversityId?: string;
}

export function generateRoadmap(profile: UserProfile, topUnis: EvaluatedUniversity[]): RoadmapTask[] {
  const tasks: RoadmapTask[] = [];
  const primaryUni = topUnis[0]?.program;

  if (primaryUni && profile.ieltsScore < primaryUni.minIELTS) {
    tasks.push({
      id: "task_ielts",
      stage: "now",
      title: `Повысить результат IELTS до ${primaryUni.minIELTS}`,
      description: `Для подачи в ${primaryUni.university} необходимо сдать IELTS на +${(primaryUni.minIELTS - profile.ieltsScore).toFixed(1)} балла.`,
      deadline: "2026-11-15",
      status: "todo",
      priority: "high",
      linkedUniversityId: primaryUni.id
    });
  }

  tasks.push({
    id: "task_transcript",
    stage: "now",
    title: "Получить официальную выписку оценок (Транскрипт)",
    description: "Запросить в администрации учебного заведения заверенный академический транскрипт.",
    deadline: "2026-10-30",
    status: "in_progress",
    priority: "high"
  });

  if (primaryUni?.scholarshipAvailable) {
    tasks.push({
      id: "task_scholarship",
      stage: "next",
      title: `Подать заявку на ${primaryUni.scholarshipName}`,
      description: `Сформировать пакет документов и мотивационное эссе для гранта ${primaryUni.university}.`,
      deadline: primaryUni.deadline,
      status: "todo",
      priority: "high",
      linkedUniversityId: primaryUni.id
    });
  }

  tasks.push({
    id: "task_final_app",
    stage: "future",
    title: "Финальная отправка документов (Application Package)",
    description: "Загрузить полную форму в приемную комиссию выбранного ВУЗа.",
    deadline: "2026-12-20",
    status: "todo",
    priority: "medium"
  });

  return tasks;
}