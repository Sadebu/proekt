import React, { useState, useEffect } from 'react';
import { getTeacherData, clearTeacherData } from '../hooks/useGameState';
import { GameState, PlayerProfile } from '../types';
import { checkpointCriteria, glossaryData } from '../data/gameData';

export function TeacherPage({ onBack }: { onBack: () => void }) {
  const [students, setStudents] = useState<Record<string, { profile: PlayerProfile; gameState: GameState }>>({});
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [showKeys, setShowKeys] = useState(false);
  const [teacherComments, setTeacherComments] = useState<Record<string, string>>({});
  const [manualScores, setManualScores] = useState<Record<string, Record<string, number>>>({});

  useEffect(() => {
    setStudents(getTeacherData());
  }, []);

  const handleExport = (format: 'txt' | 'csv') => {
    const data = Object.entries(students);
    let content = '';
    
    if (format === 'csv') {
      content = 'Имя,Класс,КП1,КП2,План-график,Итого,Статус\n';
      data.forEach(([name, { profile, gameState }]) => {
        const cp1 = gameState.checkpointResults.find(c => c.checkpointId === 'cp1');
        const cp2 = gameState.checkpointResults.find(c => c.checkpointId === 'cp2');
        const cp3 = gameState.checkpointResults.find(c => c.checkpointId === 'cp3');
        content += `${name},${profile.className || '-'},${cp1?.score || 0},${cp2?.score || 0},${cp3?.score || 0},${gameState.totalScore},${gameState.completed ? 'Завершено' : 'В процессе'}\n`;
      });
    } else {
      content = 'ОТЧЁТ ПО ПРОЕКТНОМУ КВЕСТУ\n' + '='.repeat(40) + '\n\n';
      data.forEach(([name, { profile, gameState }]) => {
        content += `Ученик: ${name} (${profile.className || 'класс не указан'})\n`;
        content += `Начало: ${new Date(profile.startedAt).toLocaleDateString('ru')}\n`;
        content += `Последняя активность: ${new Date(profile.lastPlayedAt).toLocaleDateString('ru')}\n`;
        const cp1 = gameState.checkpointResults.find(c => c.checkpointId === 'cp1');
        const cp2 = gameState.checkpointResults.find(c => c.checkpointId === 'cp2');
        const cp3 = gameState.checkpointResults.find(c => c.checkpointId === 'cp3');
        content += `КП1: ${cp1?.score || 0}/6 (${cp1?.decision === 'accepted' ? 'принято' : cp1?.decision === 'revision' ? 'доработка' : 'не сдан'})\n`;
        content += `КП2: ${cp2?.score || 0}/7 (${cp2?.decision === 'accepted' ? 'принято' : cp2?.decision === 'revision' ? 'доработка' : 'не сдан'})\n`;
        content += `План-график: ${cp3?.score || 0}/2\n`;
        content += `Итого: ${gameState.totalScore}/15\n`;
        content += '-'.repeat(30) + '\n';
      });
    }

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_quest_report.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm('Вы уверены? Все данные учеников будут удалены!')) {
      clearTeacherData();
      setStudents({});
      setSelectedStudent(null);
    }
  };

  const studentList = Object.entries(students);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              ← Назад
            </button>
            <div>
              <h1 className="text-xl font-bold">📋 Страница учителя</h1>
              <p className="text-sm text-slate-300">Индивидуальная проектная деятельность, 10 класс</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleExport('csv')} className="px-3 py-1 bg-emerald-600 rounded text-sm hover:bg-emerald-700">Экспорт CSV</button>
            <button onClick={() => handleExport('txt')} className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700">Экспорт TXT</button>
            <button onClick={handleReset} className="px-3 py-1 bg-red-600 rounded text-sm hover:bg-red-700">Сброс данных</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Student list */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-bold text-lg mb-3">Ученики ({studentList.length})</h2>
          {studentList.length === 0 ? (
            <p className="text-gray-400 text-sm">Пока нет данных. Ученики ещё не начинали игру.</p>
          ) : (
            <div className="space-y-2">
              {studentList.map(([name, { profile, gameState }]) => (
                <div key={name} onClick={() => setSelectedStudent(name)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedStudent === name ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{name}</span>
                    <span className="text-xs text-gray-500">{profile.className || '-'}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">{gameState.totalScore}/15</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${gameState.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {gameState.completed ? '✓ Завершено' : 'В процессе'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student details */}
        <div className="lg:col-span-2">
          {selectedStudent && students[selectedStudent] ? (
            <StudentDetail student={students[selectedStudent]} teacherComments={teacherComments} setTeacherComments={setTeacherComments} manualScores={manualScores} setManualScores={setManualScores} />
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>Выберите ученика для просмотра деталей</p>
            </div>
          )}
        </div>
      </div>

      {/* Answer keys */}
      <div className="max-w-7xl mx-auto p-4">
        <button onClick={() => setShowKeys(!showKeys)} className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 mb-4">
          {showKeys ? 'Скрыть' : 'Показать'} правильные ответы (ключи)
        </button>
        {showKeys && <AnswerKeys />}
      </div>
    </div>
  );
}

function StudentDetail({ student, teacherComments, setTeacherComments, manualScores, setManualScores }: {
  student: { profile: PlayerProfile; gameState: GameState };
  teacherComments: Record<string, string>;
  setTeacherComments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  manualScores: Record<string, Record<string, number>>;
  setManualScores: React.Dispatch<React.SetStateAction<Record<string, Record<string, number>>>>;
}) {
  const { profile, gameState } = student;
  const name = profile.name;

  return (
    <div className="space-y-4">
      {/* Profile card */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-bold text-lg">{profile.name} {profile.className && `(${profile.className})`}</h2>
        <p className="text-sm text-gray-500">Начало: {new Date(profile.startedAt).toLocaleDateString('ru')} | Последняя активность: {new Date(profile.lastPlayedAt).toLocaleDateString('ru')}</p>
        <div className="flex gap-4 mt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{gameState.totalScore}</div>
            <div className="text-xs text-gray-500">из 15 баллов</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{gameState.completedScenes.length}</div>
            <div className="text-xs text-gray-500">сцен пройдено</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{gameState.miniGameResults.length}</div>
            <div className="text-xs text-gray-500">мини-игр</div>
          </div>
        </div>
      </div>

      {/* Checkpoint results */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-bold mb-3">Чек-поинты</h3>
        {['cp1', 'cp2', 'cp3'].map(cpId => {
          const result = gameState.checkpointResults.find(r => r.checkpointId === cpId);
          const criteria = checkpointCriteria[cpId as keyof typeof checkpointCriteria];
          return (
            <div key={cpId} className="mb-4 p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-sm">{criteria.title}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${result?.decision === 'accepted' ? 'bg-green-100 text-green-700' : result?.decision === 'revision' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                  {result ? `${result.score}/${criteria.maxScore} — ${result.decision === 'accepted' ? 'ПРИНЯТО' : 'ДОРАБОТКА'}` : 'Не сдан'}
                </span>
              </div>
              {criteria.criteria.map(crit => (
                <div key={crit.id} className="flex items-center gap-2 text-xs mb-1">
                  <span className="text-gray-500 w-40">{crit.name}:</span>
                  <span className="text-gray-700">{crit.descriptor}</span>
                  <span className="ml-auto text-gray-400">(макс {crit.maxScore})</span>
                </div>
              ))}
              {result && (
                <div className="mt-2 text-xs">
                  {result.reasons.length > 0 && <p className="text-gray-600">Причины: {result.reasons.join('; ')}</p>}
                  {result.recommendations.length > 0 && <p className="text-blue-600">Рекомендации: {result.recommendations.join('; ')}</p>}
                </div>
              )}
              {/* Teacher manual override */}
              <div className="mt-2 flex gap-2 items-center">
                <span className="text-xs text-gray-500">Ручная оценка:</span>
                <input type="number" min={0} max={criteria.maxScore} 
                  value={manualScores[name]?.[cpId] ?? result?.score ?? ''}
                  onChange={e => setManualScores(prev => ({...prev, [name]: {...(prev[name] || {}), [cpId]: parseInt(e.target.value) || 0}}))}
                  className="w-16 p-1 border rounded text-xs" />
                <select value={result?.decision || ''} className="p-1 border rounded text-xs">
                  <option value="">—</option>
                  <option value="accepted">Принято</option>
                  <option value="revision">Доработка</option>
                </select>
              </div>
            </div>
          );
        })}
        {/* Teacher comment */}
        <div className="mt-3">
          <label className="text-sm font-semibold text-gray-700">Комментарий ученику:</label>
          <textarea value={teacherComments[name] || ''} 
            onChange={e => setTeacherComments(prev => ({...prev, [name]: e.target.value}))}
            className="w-full p-2 border rounded-lg text-sm mt-1" rows={3}
            placeholder="Ваши рекомендации ученику..." />
        </div>
      </div>

      {/* Mini-game results */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-bold mb-3">Результаты мини-игр</h3>
        {gameState.miniGameResults.length === 0 ? (
          <p className="text-sm text-gray-400">Мини-игры ещё не пройдены</p>
        ) : (
          <div className="space-y-2">
            {gameState.miniGameResults.map((mg, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                <span className="font-medium">{mg.gameId}</span>
                <span className="text-gray-500">—</span>
                <span className={mg.score === mg.maxScore ? 'text-green-600' : 'text-orange-600'}>
                  {mg.score}/{mg.maxScore}
                </span>
                <span className="ml-auto text-xs text-gray-400">{new Date(mg.timestamp).toLocaleTimeString('ru')}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project data */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-bold mb-3">Данные проекта ученика</h3>
        <div className="space-y-2 text-sm">
          <div><span className="font-semibold">Идеи:</span> {gameState.projectData.ideas.map(i => i.text).join('; ') || '—'}</div>
          <div><span className="font-semibold">Тема:</span> {gameState.projectData.theme || '—'}</div>
          <div><span className="font-semibold">Проблема:</span> {gameState.projectData.problem || '—'}</div>
          <div><span className="font-semibold">Цель:</span> {gameState.projectData.goal || '—'}</div>
          <div><span className="font-semibold">Задачи:</span> {gameState.projectData.tasks.join('; ') || '—'}</div>
          <div><span className="font-semibold">Объект:</span> {gameState.projectData.object || '—'}</div>
          <div><span className="font-semibold">Предмет:</span> {gameState.projectData.subject || '—'}</div>
          <div><span className="font-semibold">Гипотеза:</span> {gameState.projectData.hypothesis || '—'}</div>
          <div><span className="font-semibold">План-график:</span> {gameState.projectData.ganttPlan.length > 0 ? `${gameState.projectData.ganttPlan.length} этапов` : '—'}</div>
        </div>
      </div>
    </div>
  );
}

function AnswerKeys() {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <h2 className="text-xl font-bold text-amber-800">🔑 Правильные ответы (ключи)</h2>
      
      <div className="border-l-4 border-blue-400 pl-4">
        <h3 className="font-bold text-blue-800">3 отличия проекта от реферата (Урок 1)</h3>
        <ol className="list-decimal ml-4 text-sm mt-1">
          <li><strong>Проблема:</strong> проект содержит проблему (противоречие/вопрос), реферат — нет</li>
          <li><strong>Продукт:</strong> проект создаёт конкретный продукт, реферат — не создаёт</li>
          <li><strong>Исследование:</strong> проект включает собственное исследование, реферат — компиляция чужих текстов</li>
        </ol>
      </div>

      <div className="border-l-4 border-purple-400 pl-4">
        <h3 className="font-bold text-purple-800">Критерии SMART (Урок 4)</h3>
        <ul className="text-sm mt-1 space-y-1">
          <li><strong>S (Specific):</strong> конкретная — что именно делаем, для кого</li>
          <li><strong>M (Measurable):</strong> измеримая — как проверим достижение</li>
          <li><strong>A (Achievable):</strong> достижимая — реально за учебный год</li>
          <li><strong>R (Relevant):</strong> значимая — решает реальную проблему</li>
          <li><strong>T (Time-bound):</strong> ограниченная по времени — к какому сроку</li>
        </ul>
        <p className="text-sm mt-1 text-gray-600">Цель всегда начинается с глагола действия: «разработать», «выявить», «создать», «доказать»</p>
      </div>

      <div className="border-l-4 border-teal-400 pl-4">
        <h3 className="font-bold text-teal-800">Требования к задачам (Урок 5)</h3>
        <ul className="text-sm mt-1 space-y-1 list-disc ml-4">
          <li>Количество: 4–6 задач</li>
          <li>Каждая начинается с глагола (изучить, провести, разработать, создать, протестировать, оформить)</li>
          <li>Не дублируют друг друга</li>
          <li>Логический порядок: теория → исследование → разработка → тестирование → оформление</li>
          <li>Каждая — один шаг к цели (не два действия в одной задаче)</li>
        </ul>
      </div>

      <div className="border-l-4 border-amber-400 pl-4">
        <h3 className="font-bold text-amber-800">Формула гипотезы (Урок 6)</h3>
        <p className="text-sm mt-1">«<strong>Если</strong> [действие/условие], <strong>то</strong> [ожидаемый результат], <strong>потому что</strong> [обоснование]»</p>
        <p className="text-sm text-gray-600 mt-1">Пример: «Если разработать буклет с визуальными инструкциями, то уровень знаний повысится, потому что наглядная информация усваивается лучше.»</p>
        <p className="text-sm text-gray-600">Для технологического проекта: чёткое ТЗ с конкретными характеристиками продукта.</p>
      </div>

      <div className="border-l-4 border-rose-400 pl-4">
        <h3 className="font-bold text-rose-800">Дескрипторы КП1 (6 баллов)</h3>
        <ul className="text-sm mt-1 space-y-1">
          <li>3 идеи с предметной областью (2 балла) — минимум 3 идеи, каждая с указанием области</li>
          <li>3 отличия проекта от реферата (2 балла) — проблема, продукт, исследование</li>
          <li>Консультант с обоснованием (2 балла) — выбран приоритет, объяснён выбор</li>
          <li>Проходной балл: 4 из 6</li>
        </ul>
      </div>

      <div className="border-l-4 border-rose-400 pl-4">
        <h3 className="font-bold text-rose-800">Дескрипторы КП2 (7 баллов)</h3>
        <ul className="text-sm mt-1 space-y-1">
          <li>Тема и проблема (2 балла) — тема чёткая, проблема как противоречие/вопрос</li>
          <li>Цель по SMART (2 балла) — глагол действия, измеримость, сроки</li>
          <li>Задачи 4–6 шт. (1 балл) — с глагола, без дублирования</li>
          <li>Гипотеза/ТЗ (2 балла) — формула «Если…то…потому что…» или чёткое ТЗ</li>
          <li>Проходной балл: 5 из 7</li>
        </ul>
      </div>

      <div className="border-l-4 border-cyan-400 pl-4">
        <h3 className="font-bold text-cyan-800">План-график и диаграмма Ганта (Урок 9)</h3>
        <h4 className="font-semibold text-sm mt-2">Верный порядок этапов:</h4>
        <ol className="text-sm list-decimal ml-4">
          <li>Сбор и анализ литературы (3 нед.)</li>
          <li>Теоретическая глава (3 нед.) — зависит от п.1</li>
          <li>Эмпирическое исследование (4 нед.) — зависит от п.2</li>
          <li>Обработка данных (2 нед.) — зависит от п.3</li>
          <li>Разработка продукта (4 нед.) — зависит от п.4</li>
          <li>Оформление работы (3 нед.) — зависит от п.5</li>
          <li>Заключение (1 нед.) — зависит от п.6</li>
          <li>Презентация и речь (2 нед.) — зависит от п.7</li>
        </ol>
        <h4 className="font-semibold text-sm mt-2">Вехи и буферы:</h4>
        <ul className="text-sm list-disc ml-4">
          <li>КП3 — урок 12 (буфер 1–2 нед. до)</li>
          <li>КП4 — урок 18 (буфер 1–2 нед. до)</li>
          <li>КП5 — урок 26 (буфер 1–2 нед. до)</li>
          <li>КП6 — урок 29 (буфер 1–2 нед. до)</li>
          <li>Защита — урок 34 (буфер 2 нед. до)</li>
        </ul>
        <h4 className="font-semibold text-sm mt-2">Типичные ошибки чужого плана:</h4>
        <ul className="text-sm list-disc ml-4">
          <li>Заключение стоит ДО обработки данных</li>
          <li>Нет буфера перед чек-поинтами</li>
          <li>Эмпирика и теория идут параллельно (нарушение зависимости)</li>
          <li>Перегруз одной недели (3+ задачи)</li>
          <li>Презентация начинается до завершения продукта</li>
          <li>Нет вех на датах чек-поинтов</li>
        </ul>
        <h4 className="font-semibold text-sm mt-2">Диапазон реалистичных длительностей:</h4>
        <p className="text-sm">Литература: 2–4 нед. | Теория: 2–4 нед. | Эмпирика: 3–5 нед. | Обработка: 1–3 нед. | Продукт: 3–5 нед. | Оформление: 2–3 нед. | Заключение: 1 нед. | Презентация: 1–2 нед.</p>
      </div>
    </div>
  );
}
