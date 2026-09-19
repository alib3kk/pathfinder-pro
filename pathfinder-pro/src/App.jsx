import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Map, GraduationCap } from 'lucide-react';
import { demoUniversities, getRoadmap } from './data';

export default function App() {
  const [step, setStep] = useState(0); // 0: Landing, 1: Profile, 2: Dashboard
  const [profile, setProfile] = useState({
    grade: "11 класс",
    major: "Big Data Analysis",
    ielts: "6.5",
    budget: 15000,
    country: "Нидерланды"
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const filteredUnis = demoUniversities.filter(u => u.budget <= profile.budget || u.country === profile.country);
  const roadmap = getRoadmap(profile.country);
  const nextAction = roadmap.find(r => r.status === 'current');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="font-bold text-2xl tracking-tighter text-blue-600">Routea.</div>
        <div className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 font-medium">
          Demo Mode
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {step === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-gray-900">
              Твой навигатор <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">поступления</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl">
              Превращаем хаос требований в пошаговый маршрут. Укажи свой профиль, и наш AI подберет университеты, объяснит выбор и составит Roadmap.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Построить маршрут <ArrowRight size={20} />
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border p-8 animate-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold mb-6">Профиль абитуриента</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Направление</label>
                <input type="text" name="major" value={profile.major} onChange={handleProfileChange} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IELTS Score</label>
                  <input type="number" step="0.5" name="ielts" value={profile.ielts} onChange={handleProfileChange} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Бюджет ($/год)</label>
                  <select name="budget" value={profile.budget} onChange={handleProfileChange} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value={5000}>До $5,000</option>
                    <option value={15000}>До $15,000</option>
                    <option value={50000}>Без ограничений</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Приоритетная страна</label>
                <select name="country" value={profile.country} onChange={handleProfileChange} className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="Нидерланды">Нидерланды</option>
                  <option value="Германия">Германия</option>
                  <option value="Италия">Италия</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-between items-center">
              <button onClick={() => setStep(0)} className="text-gray-500 hover:text-gray-900 font-medium">Назад</button>
              <button 
                onClick={() => setStep(2)}
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all"
              >
                Анализировать профиль <Map size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl p-8 text-white shadow-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ваш персональный маршрут</h2>
                <p className="text-blue-200">Цель: бакалавриат по направлению {profile.major} • IELTS {profile.ielts} • Бюджет до ${profile.budget}</p>
              </div>
              <button onClick={() => setStep(1)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-all">
                Изменить параметры
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><GraduationCap className="text-blue-600"/> Рекомендованные программы</h3>
                
                {filteredUnis.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">Нет программ под ваш бюджет. Попробуйте изменить параметры.</div>
                ) : (
                  filteredUnis.map(uni => (
                    <div key={uni.id} className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-green-50 text-green-700 px-3 py-1 rounded-bl-xl font-bold text-sm border-b border-l border-green-100 flex items-center gap-1">
                        Match {uni.matchScore}%
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">{uni.name}</h4>
                      <p className="text-gray-500 text-sm mb-4">{uni.program} • {uni.country}</p>
                      
                      <div className="flex gap-2 mb-4">
                        {uni.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{tag}</span>
                        ))}
                      </div>
                      
                      <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                        <p className="text-sm text-gray-700 leading-relaxed flex gap-3">
                          <span className="text-blue-600 mt-0.5"><CheckCircle size={16}/></span>
                          {uni.explanation}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-blue-600 text-white rounded-3xl p-6 shadow-lg transform transition-all hover:scale-[1.02]">
                  <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-2">Следующий шаг</h3>
                  <p className="text-lg font-semibold leading-tight mb-4">
                    {nextAction ? nextAction.title : "Все шаги выполнены!"}
                  </p>
                  <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors">
                    Отметить как выполненное
                  </button>
                </div>

                <div className="bg-white rounded-3xl border p-6 shadow-sm">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Map className="text-blue-600" size={20}/> Roadmap поступления</h3>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[13px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {roadmap.map((item, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${item.status === 'done' ? 'bg-green-500' : item.status === 'current' ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`}></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-2xl border bg-white shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-gray-400">Шаг {item.step}</span>
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">{item.source}</span>
                          </div>
                          <p className={`text-sm font-medium ${item.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{item.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}