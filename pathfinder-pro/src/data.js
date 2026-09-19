export const demoUniversities = [
  {
    id: 1,
    name: "TU Delft",
    country: "Нидерланды",
    program: "BSc Computer Science",
    budget: 15000,
    minIelts: 6.5,
    matchScore: 95,
    tags: ["Топ-50 мира", "Высокие шансы стипендии"],
    explanation: "Идеально подходит под ваш профиль: ваш IELTS 6.5 покрывает минимальное требование, а сильная математическая база дает высокие шансы на поступление.",
  },
  {
    id: 2,
    name: "Technical University of Munich (TUM)",
    country: "Германия",
    program: "BSc Information Engineering",
    budget: 5000,
    minIelts: 6.5,
    matchScore: 88,
    tags: ["Бесплатное обучение", "Нужен Studienkolleg"],
    explanation: "Подходит по бюджету, но требует дополнительного года обучения (Studienkolleg) из-за разницы в системах образования.",
  },
  {
    id: 3,
    name: "Politecnico di Milano",
    country: "Италия",
    program: "BSc Applied Computing",
    budget: 4000,
    minIelts: 6.0,
    matchScore: 85,
    tags: ["Низкий бюджет", "Легкий старт"],
    explanation: "Отличный запасной вариант. Низкая стоимость жизни и проходной балл IELTS ниже вашего текущего уровня.",
  }
];

export const getRoadmap = (country) => {
  return [
    { step: 1, title: "Собрать транскрипты оценок за 9-11 классы", status: "done", source: "verified" },
    { step: 2, title: "Подтвердить IELTS сертификат", status: "current", source: "verified" },
    { step: 3, title: country === "Германия" ? "Подать заявку в Uni-Assist" : "Заполнить заявку на Studielink", status: "pending", source: "verified" },
    { step: 4, title: "Отправить мотивационное эссе", status: "pending", source: "demo" },
  ];
};