export async function analyzeApplicantWithGemini(apiKey, applicantProfile) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
Ты — главный ИИ-агент поступления на платформе GrantPath AI.
Проанализируй абитуриента и выбери ЕДИНСТВЕННЫЙ лучший ВУЗ в Казахстане для получения 100% гранта.

Данные абитуриента:
- Имя: ${applicantProfile.name}
- Статус: ${applicantProfile.status} (Текущий ВУЗ: ${applicantProfile.currentUni}, Освоено: ${applicantProfile.completedEcts} ECTS)
- Изученные курсы: ${applicantProfile.coursesList}
- GPA: ${applicantProfile.gpa} (Шкала ${applicantProfile.gpaScale})
- ЕНТ (140 макс): Всего ${applicantProfile.untTotal} (${applicantProfile.subj1Name}: ${applicantProfile.subj1Score}, ${applicantProfile.subj2Name}: ${applicantProfile.subj2Score})
- Специализация: ${applicantProfile.specialization}

Верни СТРОГО JSON без дополнительных символов и без markdown-разметки:
{
  "targetUni": "Название ВУЗа",
  "location": "Город",
  "grantProbability": 96,
  "aiReasoning": "Подробное человеческое объяснение выбора",
  "transferredEcts": 28,
  "acceptedCourses": ["Перезачтенный предмет 1 (6 ECTS)", "Перезачтенный предмет 2 (6 ECTS)"],
  "academicDifference": ["Предмет к сдаче 1 (5 ECTS)", "Предмет к сдаче 2 (4 ECTS)"]
}
`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  const data = await response.json();
  const textResult = data.candidates[0].content.parts[0].text;
  const cleanJson = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleanJson);
}