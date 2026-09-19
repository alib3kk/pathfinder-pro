import React, { useState } from "react";

// Автоматическое считывание ключа Groq
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const DICT = {
  ru: {
    title: "GrantPath AI",
    step1: "1. Вход",
    step2: "2. Профиль",
    step3: "3. Диагностика",
    step4: "4. Рекомендации",
    step5: "5. Сравнение",
    step6: "6. Roadmap",
    step7: "7. Следующий шаг"
  },
  kk: {
    title: "GrantPath AI",
    step1: "1. Кіру",
    step2: "2. Профиль",
    step3: "3. Диагностика",
    step4: "4. Ұсыныстар",
    step5: "5. Салыстыру",
    step6: "6. Жол картасы",
    step7: "7. Келесі қадам"
  },
  en: {
    title: "GrantPath AI",
    step1: "1. Entry",
    step2: "2. Profile",
    step3: "3. Diagnosis",
    step4: "4. Recommendations",
    step5: "5. Comparison",
    step6: "6. Roadmap",
    step7: "7. Next Step"
  }
};

export default function App() {
  const [lang, setLang] = useState("ru");
  const t = DICT[lang];
  const [currentStep, setCurrentStep] = useState(1);

  const [profile, setProfile] = useState({
    userType: "transfer",
    fullName: "",
    targetCountry: "Казахстан",
    budget: "Грант / Бюджет",
    gpaScale: "4.0",
    gpaValue: "3.6",
    completedEcts: "36",
    coursesText: "Высшая математика (6 ECTS), ООП C++ (6 ECTS), Алгоритмы (5 ECTS)",
    untMathLit: 13,
    untReadingLit: 9,
    untHistoryKz: 17,
    subj1Name: "Информатика",
    subj1Score: 38,
    subj2Name: "Математика",
    subj2Score: 36
  });

  const totalUnt = Number(profile.untMathLit) + Number(profile.untReadingLit) + Number(profile.untHistoryKz) + Number(profile.subj1Score) + Number(profile.subj2Score);

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // Вызов Groq API (Llama 3.3)
  const runAiAudit = async () => {
    setLoading(true);
    setCurrentStep(3);

    if (GROQ_API_KEY.trim()) {
      try {
        const prompt = `
Ты ИИ-агент поступления GrantPath AI. Проанализируй профиль абитуриента:
- Категория: ${profile.userType}, Имя: ${profile.fullName || 'Абитуриент'}
- ЕНТ (140 макс): Всего ${totalUnt} (${profile.subj1Name}: ${profile.subj1Score}, ${profile.subj2Name}: ${profile.subj2Score})
- GPA: ${profile.gpaValue} (${profile.gpaScale}), ECTS: ${profile.completedEcts}
- Изученные курсы: ${profile.coursesText}
- Страна: ${profile.targetCountry}, Бюджет: ${profile.budget}

Сформируй подборку строго в формате JSON без markdown:
{
  "diagnosis": "Краткое резюме сильных сторон и ограничений (2-3 предложения)",
  "unis": [
    { "name": "ВУЗ 1", "location": "Город", "matchScore": 96, "whyFits": "Причина выбора", "grantType": "100% Грант", "minUnt": 85 },
    { "name": "ВУЗ 2", "location": "Город", "matchScore": 88, "whyFits": "Причина выбора", "grantType": "Частичный грант", "minUnt": 90 },
    { "name": "ВУЗ 3", "location": "Город", "matchScore": 80, "whyFits": "Причина выбора", "grantType": "Платное / Скидка", "minUnt": 75 }
  ],
  "roadmap": [
    { "step": "Этап 1", "title": "Запрос документов", "desc": "Инструкция по сбору документов" },
    { "step": "Этап 2", "title": "Подача заявки", "desc": "Инструкция по подаче" }
  ],
  "nextAction": "Конкретное первоочередное действие на сегодня"
}`;

        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${GROQ_API_KEY.trim()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: "Ты ИИ-агент поступления. Отвечай строго валидным JSON." },
              { role: "user", content: prompt }
            ]
          })
        });

        const data = await res.json();
        const content = data.choices[0].message.content;
        const parsed = JSON.parse(content);
        setRecommendations(parsed);
      } catch (err) {
        useFallback();
      }
    } else {
      setTimeout(() => useFallback(), 700);
    }
    setLoading(false);
  };

  const useFallback = () => {
    setRecommendations({
      diagnosis: `Профиль имеет высокий академический потенциал. Балл ЕНТ (${totalUnt}/140) и профиль ${profile.subj1Name} открывают доступ к топ-технологическим вузам. Сильная сторона: GPA ${profile.gpaValue} и ${profile.completedEcts} ECTS для перезачета.`,
      unis: [
        { name: "Astana IT University (AITU)", location: "Астана, РК", matchScore: 96, whyFits: `Высокое совпадение по профилю ${profile.subj1Name}. Возможность перезачесть до 28 ECTS кредитов.`, grantType: "100% Государственный грант", minUnt: 85 },
        { name: "Nazarbayev University (NU)", location: "Астана, РК", matchScore: 89, whyFits: "Исследовательская программа. Требуется подтверждение уровня английского языка (IELTS/TOEFL).", grantType: "Грант Абая Кунанбаева", minUnt: 100 },
        { name: "КазНУ им. аль-Фараби", location: "Алматы, РК", matchScore: 82, whyFits: "Классический университет с сильной фундаментальной базой математики.", grantType: "Государственный грант", minUnt: 75 }
      ],
      roadmap: [
        { step: "Этап 1", title: "Запрос силлабусов и транскрипта", desc: "Обратитесь в деканат текущего ВУЗа для выгрузки официальной академической справки с ECTS." },
        { step: "Этап 2", title: "Регистрация в портале приемной комиссии", desc: "Загрузите сертификат ЕНТ и сформированный список перезачтенных дисциплин." }
      ],
      nextAction: "Запросить силлабусы пройденных дисциплин в деканате текущего ВУЗа"
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#090d16] text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-950/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">G</div>
            <span className="font-bold text-white text-base">{t.title} <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded font-mono">LOCUS PRO</span></span>
          </div>

          <div className="flex items-center space-x-3">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-2 py-1 focus:outline-none">
              <option value="ru">🇷🇺 RU</option>
              <option value="kk">🇰🇿 KK</option>
              <option value="en">🇺🇸 EN</option>
            </select>
          </div>
        </div>

        <div className="bg-slate-900/60 border-t border-slate-800/80 px-4 py-2 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex space-x-2 text-xs font-semibold whitespace-nowrap">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <button
                key={s}
                onClick={() => recommendations && setCurrentStep(s)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  currentStep === s ? "bg-indigo-600 text-white shadow-md" : "bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {t[`step${s}`]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full p-4 md:p-8">
        {currentStep === 1 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center space-y-6">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold rounded-full inline-block">
              Интеллектуальная система зачисления
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Превратите вашу анкету в персональный маршрут поступления</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Сервис проанализирует ваши баллы ЕНТ, GPA, кредиты ECTS и бюджетные ограничения, чтобы подобрать идеальные ВУЗы и построить пошаговый план.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
              >
                Заполнить анкету и получить маршрут →
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">2. Анкета абитуриента</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">ФИО или Имя</label>
                <input
                  type="text"
                  placeholder="Введите имя..."
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Категория поступающего</label>
                <select
                  value={profile.userType}
                  onChange={(e) => setProfile({ ...profile, userType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="school">Ученик 10-11 класса</option>
                  <option value="transfer">Студент-переводник (Transfer)</option>
                  <option value="college">Выпускник колледжа</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Целевая страна</label>
                <input
                  type="text"
                  value={profile.targetCountry}
                  onChange={(e) => setProfile({ ...profile, targetCountry: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Бюджет / Форма обучения</label>
                <select
                  value={profile.budget}
                  onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Грант / Бюджет">Только Грант / Скидка 100%</option>
                  <option value="Платное (До 1 млн ₸)">Платное (До 1 000 000 ₸)</option>
                  <option value="Платное (Без ограничений)">Платное (Без ограничений)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-indigo-400">Детализация ЕНТ (140 баллов)</span>
                <span className="font-bold text-white text-sm">Итого: {totalUnt} баллов</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Мат. грамотность (15)</label>
                  <input
                    type="number" max="15" value={profile.untMathLit}
                    onChange={(e) => setProfile({ ...profile, untMathLit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Грамотность чтения (10)</label>
                  <input
                    type="number" max="10" value={profile.untReadingLit}
                    onChange={(e) => setProfile({ ...profile, untReadingLit: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">История Казахстана (20)</label>
                  <input
                    type="number" max="20" value={profile.untHistoryKz}
                    onChange={(e) => setProfile({ ...profile, untHistoryKz: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-cyan-400 block mb-1 font-semibold">Профильный предмет 1</label>
                  <input
                    type="text" value={profile.subj1Name}
                    onChange={(e) => setProfile({ ...profile, subj1Name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white mb-1"
                  />
                  <input
                    type="number" max="50" value={profile.subj1Score}
                    onChange={(e) => setProfile({ ...profile, subj1Score: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-cyan-400 block mb-1 font-semibold">Профильный предмет 2</label>
                  <input
                    type="text" value={profile.subj2Name}
                    onChange={(e) => setProfile({ ...profile, subj2Name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white mb-1"
                  />
                  <input
                    type="number" max="50" value={profile.subj2Score}
                    onChange={(e) => setProfile({ ...profile, subj2Score: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                  />
                </div>
              </div>
            </div>

            {profile.userType === "transfer" && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-amber-400">Данные перезачета ECTS (для переводников)</span>
                <div>
                  <label className="text-slate-400 block mb-1">Изученные курсы в текущем ВУЗе:</label>
                  <textarea
                    rows="2" value={profile.coursesText}
                    onChange={(e) => setProfile({ ...profile, coursesText: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                  ></textarea>
                </div>
              </div>
            )}

            <button
              onClick={runAiAudit}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Сформировать маршрут поступления →
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">3. Диагностика профиля</h2>
            {loading ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-slate-400">Groq AI (Llama 3.3) генерирует маршрут...</p>
              </div>
            ) : recommendations && (
              <div className="space-y-6">
                <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs space-y-2">
                  <span className="font-bold text-indigo-400 block uppercase">Аналитическая сводка ИИ</span>
                  <p className="text-slate-200 leading-relaxed">{recommendations.diagnosis}</p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button onClick={() => setCurrentStep(2)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">Изменить данные</button>
                  <button onClick={() => setCurrentStep(4)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Перейти к рекомендациям →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && recommendations && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">4. Рекомендованные университеты</h2>
              <span className="text-xs text-slate-400">Найдено: {recommendations.unis.length} подходящих варианта</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {recommendations.unis.map((uni, idx) => (
                <div key={idx} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded uppercase font-bold">Вариант #{idx + 1}</span>
                      <h3 className="text-lg font-bold text-white pt-1">{uni.name}</h3>
                      <p className="text-xs text-slate-400">📍 {uni.location} | {uni.grantType}</p>
                    </div>
                    <span className="text-2xl font-black text-emerald-400">{uni.matchScore}%</span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800/80">{uni.whyFits}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setCurrentStep(3)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">← Назад</button>
              <button onClick={() => setCurrentStep(5)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Сравнить варианты →</button>
            </div>
          </div>
        )}

        {currentStep === 5 && recommendations && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">5. Сравнение параметров</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-indigo-400 font-bold uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Параметр</th>
                    {recommendations.unis.map((u, i) => <th key={i} className="p-3">{u.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold text-white">Совпадение</td>
                    {recommendations.unis.map((u, i) => <td key={i} className="p-3 font-bold text-emerald-400">{u.matchScore}%</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Тип гранта</td>
                    {recommendations.unis.map((u, i) => <td key={i} className="p-3">{u.grantType}</td>)}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Мин. ЕНТ</td>
                    {recommendations.unis.map((u, i) => <td key={i} className="p-3 font-mono">{u.minUnt} баллов</td>)}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setCurrentStep(4)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">← Назад</button>
              <button onClick={() => setCurrentStep(6)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Посмотреть Roadmap →</button>
            </div>
          </div>
        )}

        {currentStep === 6 && recommendations && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">6. Пошаговая дорожная карта</h2>

            <div className="space-y-4">
              {recommendations.roadmap.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-indigo-400 uppercase">{item.step}</span>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setCurrentStep(5)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">← Назад</button>
              <button onClick={() => setCurrentStep(7)} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">Ближайшее действие →</button>
            </div>
          </div>
        )}

        {currentStep === 7 && recommendations && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 text-center">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full inline-block">
              Финальный этап
            </span>
            <h2 className="text-2xl font-bold text-white">7. Ваше главное действие на сегодня</h2>

            <div className="p-6 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl max-w-xl mx-auto space-y-4">
              <p className="text-sm text-slate-200 font-semibold">{recommendations.nextAction}</p>

              <button
                onClick={() => setTaskCompleted(!taskCompleted)}
                className={`px-6 py-3 rounded-xl text-xs font-bold transition-all ${
                  taskCompleted ? "bg-emerald-600 text-white" : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {taskCompleted ? "✓ Выполнено!" : "Отметить прогресс как выполненный"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}