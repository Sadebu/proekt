import React, { useState } from 'react';
import { miniGameContent } from '../data/gameData';
import { GanttTask } from '../types';

// ==================== MINI GAME: Project vs Referat ====================
export function ProjectVsReferatGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.project_vs_referat;
  const [placements, setPlacements] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handlePlace = (idx: number, type: string) => {
    setPlacements(prev => ({ ...prev, [idx]: type }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    content.items.forEach((item, idx) => {
      const placed = placements[idx];
      answers.push(`${item.text}: ${placed || 'не размещено'}`);
      if (placed === item.type) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    onComplete(correct, content.items.length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      <h3 className="text-xl font-bold text-blue-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-4">{content.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Карточки:</h4>
          {content.items.map((item, idx) => (
            <div key={idx} className={`p-3 rounded-lg border-2 transition-all ${placements[idx] ? 'opacity-50' : 'bg-yellow-50 border-yellow-200'}`}>
              <p className="text-sm font-medium">{item.text}</p>
              {!placements[idx] && !submitted && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handlePlace(idx, 'project')} className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">Проект</button>
                  <button onClick={() => handlePlace(idx, 'referat')} className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">Реферат</button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <h4 className="font-semibold text-blue-700 mb-2">📋 ПРОЕКТ</h4>
          {content.items.map((item, idx) => placements[idx] === 'project' && (
            <div key={idx} className={`p-2 mb-1 rounded text-sm ${submitted ? (item.type === 'project' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300') : 'bg-white border border-blue-200'}`}>
              {item.text} {submitted && (item.type === 'project' ? '✓' : '✗')}
            </div>
          ))}
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <h4 className="font-semibold text-green-700 mb-2">📄 РЕФЕРАТ</h4>
          {content.items.map((item, idx) => placements[idx] === 'referat' && (
            <div key={idx} className={`p-2 mb-1 rounded text-sm ${submitted ? (item.type === 'referat' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300') : 'bg-white border border-green-200'}`}>
              {item.text} {submitted && (item.type === 'referat' ? '✓' : '✗')}
            </div>
          ))}
        </div>
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={Object.keys(placements).length < content.items.length}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          Проверить ({Object.keys(placements).length}/{content.items.length})
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score === content.items.length ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score === content.items.length ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Результат: {score}/{content.items.length}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Structure Assembly ====================
export function StructureAssemblyGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.structure_assembly;
  const [order, setOrder] = useState<string[]>(() => {
    const shuffled = [...content.correctOrder].sort(() => Math.random() - 0.5);
    return shuffled;
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const moveItem = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= order.length) return;
    const newOrder = [...order];
    [newOrder[idx], newOrder[newIdx]] = [newOrder[newIdx], newOrder[idx]];
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    order.forEach((item, idx) => {
      const isCorrect = item === content.correctOrder[idx];
      if (isCorrect) correct++;
      answers.push(`${idx + 1}. ${item} ${isCorrect ? '✓' : '✗'}`);
    });
    setScore(correct);
    setSubmitted(true);
    onComplete(correct, content.correctOrder.length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
      <h3 className="text-xl font-bold text-purple-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-4">{content.description}</p>
      <div className="space-y-2">
        {order.map((item, idx) => (
          <div key={item}
            className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${submitted ? (item === content.correctOrder[idx] ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300') : 'bg-purple-50 border-purple-200'}`}>
            <span className="text-lg font-bold text-purple-400 w-8">{idx + 1}.</span>
            <span className="flex-1 text-sm font-medium">{item}</span>
            {!submitted && (
              <div className="flex flex-col gap-1">
                <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-xs px-2 py-1 bg-purple-200 rounded disabled:opacity-30 hover:bg-purple-300">▲</button>
                <button onClick={() => moveItem(idx, 1)} disabled={idx === order.length - 1} className="text-xs px-2 py-1 bg-purple-200 rounded disabled:opacity-30 hover:bg-purple-300">▼</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          Проверить порядок
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score === content.correctOrder.length ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score === content.correctOrder.length ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Правильно расставлено: {score}/{content.correctOrder.length}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Idea Filter ====================
export function IdeaFilterGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.idea_filter;
  const [classifications, setClassifications] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleClassify = (idx: number, classification: string) => {
    setClassifications(prev => ({ ...prev, [idx]: classification }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    content.ideas.forEach((idea, idx) => {
      const cls = classifications[idx];
      answers.push(`«${idea.text.substring(0, 40)}...»: ${cls || 'не определено'}`);
      if (cls === idea.correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    onComplete(correct, content.ideas.length, answers);
  };

  const classLabels: Record<string, { label: string; color: string }> = {
    viable: { label: '✓ Жизнеспособная', color: 'bg-green-100 border-green-300 text-green-800' },
    too_broad: { label: '⚠ Слишком общая', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
    copied: { label: '✗ Скопированная', color: 'bg-red-100 border-red-300 text-red-800' },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
      <h3 className="text-xl font-bold text-emerald-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-4">{content.description}</p>
      <div className="space-y-3">
        {content.ideas.map((idea, idx) => (
          <div key={idx} className={`p-4 rounded-lg border-2 ${submitted ? (classifications[idx] === idea.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200') : 'bg-gray-50 border-gray-200'}`}>
            <p className="font-medium text-sm mb-2">«{idea.text}»</p>
            {!submitted && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(classLabels).map(([key, val]) => (
                  <button key={key} onClick={() => handleClassify(idx, key)}
                    className={`px-3 py-1 text-xs rounded-full border-2 transition-all ${classifications[idx] === key ? val.color + ' font-bold' : 'bg-white border-gray-300 text-gray-500 hover:border-gray-400'}`}>
                    {val.label}
                  </button>
                ))}
              </div>
            )}
            {submitted && (
              <p className={`text-xs mt-2 p-2 rounded ${classifications[idx] === idea.correct ? 'bg-green-100' : 'bg-red-100'}`}>
                💡 {idea.reason}
              </p>
            )}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={Object.keys(classifications).length < content.ideas.length}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
          Проверить ({Object.keys(classifications).length}/{content.ideas.length})
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score === content.ideas.length ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score === content.ideas.length ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Результат: {score}/{content.ideas.length}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: SMART Constructor ====================
export function SmartConstructorGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.smart_constructor;
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = content.options[selected].smart;
    setScore(isCorrect ? 1 : 0);
    setSubmitted(true);
    onComplete(isCorrect ? 1 : 0, 1, [content.options[selected].text]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
      <h3 className="text-xl font-bold text-indigo-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-2">{content.description}</p>
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-red-700">❌ Расплывчатая цель: «{content.vagueGoal}»</p>
      </div>
      <div className="space-y-2">
        {content.options.map((opt, idx) => (
          <div key={idx} onClick={() => !submitted && setSelected(idx)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${submitted ? (opt.smart ? 'bg-green-50 border-green-300' : selected === idx ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200') : selected === idx ? 'bg-indigo-50 border-indigo-300' : 'bg-gray-50 border-gray-200 hover:border-indigo-200'}`}>
            <p className="text-sm">{opt.text}</p>
            {submitted && (
              <p className={`text-xs mt-2 p-2 rounded ${opt.smart ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {opt.smart ? '✓ ' : '✗ '}{opt.reason}
              </p>
            )}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={selected === null}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
          Проверить
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score > 0 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score > 0 ? content.explanation.correct : content.explanation.incorrect}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Task Tree (выбор правильных задач) ====================
export function TaskTreeGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.task_tree;
  
  // Все задачи: правильные + неправильные (более сложные)
  const allTasks: { text: string; correct: boolean; reason?: string }[] = [
    ...content.correctTasks.map(t => ({ text: t, correct: true as const })),
    { text: 'Сделать буклет', correct: false, reason: 'Слишком общая — это цель, не задача' },
    { text: 'Провести исследование', correct: false, reason: 'Слишком общая, не конкретизировано что исследовать' },
    { text: 'Изучить литературу и провести опрос', correct: false, reason: 'Два действия в одной задаче' },
    { text: 'Подготовить презентацию', correct: false, reason: 'Это не шаг к цели, а финальное оформление' },
    { text: 'Собрать данные', correct: false, reason: 'Неясно какие данные и как' },
  ];
  
  // Стабильная сортировка: правильные задачи в начале, потом неправильные
  const correctTasks = allTasks.filter(t => t.correct);
  const wrongTasks = allTasks.filter(t => !t.correct);
  const shuffledCorrect = correctTasks.sort(() => Math.random() - 0.5);
  const shuffledWrong = wrongTasks.sort(() => Math.random() - 0.5);
  const mixedTasks = [...shuffledCorrect, ...shuffledWrong].sort(() => Math.random() - 0.5);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const toggle = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    
    mixedTasks.forEach((task, idx) => {
      const isSelected = selected.has(idx);
      if (task.correct && isSelected) { correct++; answers.push(`✓ ${task.text}`); }
      else if (task.correct && !isSelected) { answers.push(`✗ Пропущена: ${task.text}`); }
      else if (!task.correct && isSelected && task.reason) { answers.push(`✗ Лишняя: ${task.text} — ${task.reason}`); }
      else { answers.push(`○ Верно пропущена: ${task.text}`); }
    });

    // Bonus for correct count (4-6)
    if (selected.size >= 4 && selected.size <= 6) correct += 0;
    
    setScore(correct);
    setSubmitted(true);
    onComplete(correct, content.correctTasks.length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
      <h3 className="text-xl font-bold text-teal-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-2">{content.description}</p>
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-teal-700">🎯 Цель: «{content.goal}»</p>
      </div>
      <p className="text-xs text-gray-500 mb-3">Отметь только правильные задачи (4–6 штук). Каждая должна начинаться с глагола действия и быть конкретным шагом.</p>
      <div className="space-y-2">
        {mixedTasks.map((task, idx) => (
          <div key={idx} onClick={() => !submitted && toggle(idx)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
              submitted 
                ? (task.correct 
                    ? (selected.has(idx) ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300')
                    : (selected.has(idx) ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'))
                : (selected.has(idx) ? 'bg-teal-50 border-teal-300' : 'bg-gray-50 border-gray-200 hover:border-teal-200')
            }`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selected.has(idx) ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300'}`}>
              {selected.has(idx) && '✓'}
            </div>
            <span className="text-sm flex-1">{task.text}</span>
            {submitted && !task.correct && selected.has(idx) && task.reason && (
              <span className="text-xs text-red-600">💡 {task.reason}</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Выбрано: {selected.size}</p>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={selected.size < 4}
          className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50">
          Проверить ({selected.size} выбрано)
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 4 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 4 ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Правильных задач выбрано: {score}/{content.correctTasks.length}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Object, Subject, Hypothesis (выбор из вариантов) ====================
export function ObjectSubjectHypothesisGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.object_subject_hypothesis;
  
  // Варианты гипотезы для выбора
  const hypothesisOptions: { text: string; correct: boolean; reason?: string }[] = [
    { text: 'Если разработать буклет с визуальными инструкциями по сортировке отходов для 5–6 классов, то уровень знаний о правилах сортировки повысится минимум на 30%, потому что наглядная визуальная информация усваивается подростками лучше, чем текстовая.', correct: true },
    { text: 'Если сделать буклет, то всё будет хорошо.', correct: false, reason: 'Нет конкретики, нет обоснования' },
    { text: 'Буклет поможет ученикам.', correct: false, reason: 'Это не гипотеза, а утверждение. Нет формулы «Если…то…потому что…»' },
    { text: 'Если ученики будут читать буклет, то они станут экологически грамотными, потому что буклеты полезные.', correct: false, reason: 'Слишком общее обоснование, нет измеримого результата' },
  ];

  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedHypothesis, setSelectedHypothesis] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    
    if (selectedObject !== null && content.objectOptions[selectedObject].correct) { correct++; answers.push('Объект: ✓'); }
    else answers.push('Объект: ✗');
    
    if (selectedSubject !== null && content.subjectOptions[selectedSubject].correct) { correct++; answers.push('Предмет: ✓'); }
    else answers.push('Предмет: ✗');
    
    if (selectedHypothesis !== null && hypothesisOptions[selectedHypothesis].correct) { correct++; answers.push('Гипотеза: ✓'); }
    else answers.push('Гипотеза: ✗');

    setScore(correct);
    setSubmitted(true);
    onComplete(correct, 3, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
      <h3 className="text-xl font-bold text-amber-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-4">{content.description}</p>
      
      <div className="mb-4">
        <h4 className="font-semibold text-amber-700 mb-2">1. Выбери ОБЪЕКТ (широкая область):</h4>
        <div className="space-y-2">
          {content.objectOptions.map((opt, idx) => (
            <div key={idx} onClick={() => !submitted && setSelectedObject(idx)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${submitted ? (opt.correct ? 'bg-green-50 border-green-300' : selectedObject === idx ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200') : selectedObject === idx ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 hover:border-amber-200'}`}>
              <p className="text-sm">{opt.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-amber-700 mb-2">2. Выбери ПРЕДМЕТ (конкретный аспект):</h4>
        <div className="space-y-2">
          {content.subjectOptions.map((opt, idx) => (
            <div key={idx} onClick={() => !submitted && setSelectedSubject(idx)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${submitted ? (opt.correct ? 'bg-green-50 border-green-300' : selectedSubject === idx ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200') : selectedSubject === idx ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 hover:border-amber-200'}`}>
              <p className="text-sm">{opt.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-amber-700 mb-2">3. Выбери правильную гипотезу:</h4>
        <div className="space-y-2">
          {hypothesisOptions.map((opt, idx) => (
            <div key={idx} onClick={() => !submitted && setSelectedHypothesis(idx)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${submitted ? (opt.correct ? 'bg-green-50 border-green-300' : selectedHypothesis === idx ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200') : selectedHypothesis === idx ? 'bg-amber-50 border-amber-300' : 'bg-gray-50 border-gray-200 hover:border-amber-200'}`}>
              <p className="text-sm">{opt.text}</p>
              {submitted && !opt.correct && selectedHypothesis === idx && opt.reason && (
                <p className="text-xs mt-1 text-red-600">💡 {opt.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {!submitted ? (
        <button onClick={handleSubmit}
          disabled={selectedObject === null || selectedSubject === null || selectedHypothesis === null}
          className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50">
          Проверить
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score === 3 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score === 3 ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Результат: {score}/3</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Defense Presentation (выбор ответов) ====================
export function DefensePresentationGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.defense_presentation;
  const [chainOrder, setChainOrder] = useState<number[]>(() => [0, 1, 2, 3].sort(() => Math.random() - 0.5));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<number[]>([]);
  const [phase, setPhase] = useState<'chain' | 'questions' | 'result'>('chain');
  const [score, setScore] = useState(0);

  const moveChainItem = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= chainOrder.length) return;
    const newOrder = [...chainOrder];
    [newOrder[idx], newOrder[newIdx]] = [newOrder[newIdx], newOrder[idx]];
    setChainOrder(newOrder);
  };

  const checkChain = () => {
    const correctOrder = chainOrder.every((itemIdx, pos) => {
      const roles = ['problem', 'goal', 'tasks', 'hypothesis'];
      return content.chainParts[itemIdx].role === roles[pos];
    });
    const chainScore = correctOrder ? 2 : chainOrder.filter((itemIdx, pos) => {
      const roles = ['problem', 'goal', 'tasks', 'hypothesis'];
      return content.chainParts[itemIdx].role === roles[pos];
    }).length;
    setScore(chainScore);
    setPhase('questions');
  };

  // Варианты ответов на вопросы консультанта
  const questionOptions = [
    [
      { text: 'Буклет доступен, не требует техники, ученики могут перечитывать. Опрос показал, что 70% предпочитают печатные материалы.', correct: true },
      { text: 'Ну, буклет — это просто и недорого.', correct: false },
      { text: 'Потому что все делают буклеты.', correct: false },
    ],
    [
      { text: 'Тестирование до и после: один и тот же тест из 10 вопросов. Сравнение средних баллов.', correct: true },
      { text: 'Спросим у учителей, заметили ли они изменения.', correct: false },
      { text: 'Посмотрим, стали ли ученики лучше сортировать мусор.', correct: false },
    ],
    [
      { text: 'Да: опрос — сентябрь, разработка — октябрь-ноябрь, создание — декабрь-февраль, тестирование — март, оформление — апрель. Есть буфер.', correct: true },
      { text: 'Думаю, успеем, если постараемся.', correct: false },
      { text: 'Ну, план есть, а там посмотрим.', correct: false },
    ],
    [
      { text: 'Существующие буклеты общие. Наш — конкретно для 5–6 классов нашей школы, с учётом результатов опроса о их пробелах в знаниях.', correct: true },
      { text: 'Наш буклет красивее и интереснее.', correct: false },
      { text: 'Мы добавим больше картинок.', correct: false },
    ],
  ];

  const submitQuestionAnswer = (optIdx: number) => {
    const newAnswers = [...questionAnswers, optIdx];
    setQuestionAnswers(newAnswers);
    
    if (currentQuestion < content.consultantQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final score
      let qScore = 0;
      newAnswers.forEach((ansIdx, qIdx) => {
        if (questionOptions[qIdx][ansIdx].correct) qScore++;
      });
      const finalScore = Math.min(score + qScore, 6);
      setScore(finalScore);
      setPhase('result');
      onComplete(finalScore, 6, newAnswers.map((a, i) => questionOptions[i][a].text));
    }
  };

  if (phase === 'chain') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100">
        <h3 className="text-xl font-bold text-rose-800 mb-2">{content.title}</h3>
        <p className="text-gray-600 mb-4">Расставь элементы заявки в логическом порядке: проблема → цель → задачи → гипотеза</p>
        <div className="space-y-2">
          {chainOrder.map((partIdx, pos) => (
            <div key={partIdx} className="p-3 rounded-lg border-2 border-rose-200 bg-rose-50 flex items-center gap-2">
              <span className="text-rose-400 font-bold">{pos + 1}.</span>
              <span className="flex-1 text-sm">{content.chainParts[partIdx].text}</span>
              <div className="flex flex-col gap-1">
                <button onClick={() => moveChainItem(pos, -1)} disabled={pos === 0} className="text-xs px-2 py-1 bg-rose-200 rounded disabled:opacity-30 hover:bg-rose-300">▲</button>
                <button onClick={() => moveChainItem(pos, 1)} disabled={pos === chainOrder.length - 1} className="text-xs px-2 py-1 bg-rose-200 rounded disabled:opacity-30 hover:bg-rose-300">▼</button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={checkChain} className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
          Проверить связку
        </button>
      </div>
    );
  }

  if (phase === 'questions') {
    const q = content.consultantQuestions[currentQuestion];
    const options = questionOptions[currentQuestion];
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100">
        <h3 className="text-xl font-bold text-rose-800 mb-2">Вопросы консультанта ({currentQuestion + 1}/{content.consultantQuestions.length})</h3>
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
          <p className="font-medium">💬 {q.question}</p>
        </div>
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} onClick={() => submitQuestionAnswer(idx)}
              className="p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-rose-300 hover:bg-rose-50 transition-all">
              <p className="text-sm">{opt.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100">
      <h3 className="text-xl font-bold text-rose-800 mb-2">Результат защиты</h3>
      <div className={`p-4 rounded-lg ${score >= 5 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <p className="font-semibold">{score >= 5 ? content.explanation.correct : content.explanation.incorrect}</p>
        <p className="text-sm mt-2">Баллы за защиту: {score}/6</p>
      </div>
    </div>
  );
}

// ==================== MINI GAME: Gantt Builder ====================
export function GanttBuilderGame({ onComplete, onPlanUpdate }: { onComplete: (score: number, max: number, answers: string[]) => void; onPlanUpdate: (plan: GanttTask[]) => void }) {
  const content = miniGameContent.gantt_builder;
  const totalWeeks = 34;
  const [taskPlacements, setTaskPlacements] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  const handlePlace = (taskIdx: number, week: number) => {
    setTaskPlacements(prev => ({ ...prev, [taskIdx]: week }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    const plan: GanttTask[] = [];

    content.tasks.forEach((task, idx) => {
      const start = taskPlacements[idx] ?? 0;
      const isCorrect = Math.abs(start - task.correctStart) <= 1;
      if (isCorrect) correct++;
      answers.push(`${task.name}: старт неделя ${start} (верно: ${task.correctStart}) ${isCorrect ? '✓' : '✗'}`);
      
      plan.push({
        id: `task-${idx}`,
        name: task.name,
        startWeek: start,
        duration: task.duration,
        isMilestone: false,
        dependencies: task.dependencies,
        color: colors[idx % colors.length],
      });
    });

    onPlanUpdate(plan);
    
    const finalScore = Math.min(correct + 1, content.tasks.length + 1);
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore, content.tasks.length + 1, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
      <h3 className="text-xl font-bold text-cyan-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-4">{content.description}</p>
      
      {/* Gantt Grid */}
      <div className="overflow-x-auto mb-4">
        <div className="min-w-[800px]">
          {/* Week headers */}
          <div className="flex border-b-2 border-gray-300 mb-1">
            <div className="w-40 shrink-0 text-xs font-bold text-gray-500 p-1">Задача</div>
            {Array.from({ length: totalWeeks }, (_, i) => (
              <div key={i} className={`w-6 shrink-0 text-center text-[8px] p-0.5 ${content.milestones.find(m => m.week === i + 1) ? 'bg-red-100 font-bold text-red-600' : 'text-gray-400'}`}>
                {i + 1}
              </div>
            ))}
          </div>
          
          {/* Milestones row */}
          <div className="flex border-b border-gray-200 mb-2">
            <div className="w-40 shrink-0 text-xs font-bold text-red-600 p-1">⚑ Вехи</div>
            {Array.from({ length: totalWeeks }, (_, i) => {
              const milestone = content.milestones.find(m => m.week === i + 1);
              return (
                <div key={i} className={`w-6 shrink-0 text-center text-[8px] p-0.5 ${milestone ? 'bg-red-200 text-red-700 font-bold' : ''}`}>
                  {milestone ? '⚑' : ''}
                </div>
              );
            })}
          </div>

          {/* Task rows */}
          {content.tasks.map((task, idx) => (
            <div key={idx} className="flex border-b border-gray-100 items-center">
              <div className="w-40 shrink-0 text-xs p-1 font-medium truncate" title={task.name}>{task.name}</div>
              {Array.from({ length: totalWeeks }, (_, weekIdx) => {
                const start = taskPlacements[idx];
                const isInRange = start !== undefined && weekIdx + 1 >= start && weekIdx + 1 < start + task.duration;
                return (
                  <div key={weekIdx} onClick={() => !submitted && handlePlace(idx, weekIdx + 1)}
                    className={`w-6 h-6 shrink-0 cursor-pointer border border-gray-100 transition-all ${isInRange ? '' : 'hover:bg-cyan-50'}`}
                    style={isInRange ? { backgroundColor: colors[idx % colors.length], opacity: 0.8 } : {}}>
                    {weekIdx + 1 === start && <span className="text-[8px] text-white font-bold flex items-center justify-center h-full">{task.duration}н</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Task placement controls */}
      <div className="space-y-2 mb-4">
        {content.tasks.map((task, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[idx % colors.length] }}></div>
            <span className="flex-1 text-xs">{task.name} ({task.duration} нед.)</span>
            <span className="text-xs text-gray-500">Зависит: {task.dependencies.join(', ') || 'нет'}</span>
            <input type="number" min={1} max={totalWeeks} value={taskPlacements[idx] || ''} 
              onChange={e => handlePlace(idx, parseInt(e.target.value) || 0)}
              className="w-16 p-1 border border-cyan-200 rounded text-xs text-center" placeholder="нед." disabled={submitted} />
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
        💡 Подсказка: Обратное планирование от защиты (неделя 34). Зависимости: каждая задача после предыдущей. Буфер перед КП (недели 12, 18, 26, 29).
      </div>

      {!submitted ? (
        <button onClick={handleSubmit} disabled={Object.keys(taskPlacements).length < content.tasks.length}
          className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50">
          Проверить план-график
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= content.tasks.length ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= content.tasks.length ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Баллы: {score}/{content.tasks.length + 1}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Find Errors (визуальный план-график) ====================
export function FindErrorsGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  // Визуальный план-график с ошибками
  const ganttTasks = [
    { id: 1, name: 'Литература', start: 1, duration: 3, color: '#3B82F6', hasError: false },
    { id: 2, name: 'Теория', start: 2, duration: 3, color: '#10B981', hasError: true, errorType: 'overlap', explanation: 'Параллельно с литературой — нарушение зависимости "финиш-старт"' },
    { id: 3, name: 'Эмпирика', start: 5, duration: 4, color: '#F59E0B', hasError: false },
    { id: 4, name: 'Данные', start: 9, duration: 2, color: '#EF4444', hasError: false },
    { id: 5, name: 'Продукт', start: 11, duration: 4, color: '#8B5CF6', hasError: false },
    { id: 6, name: 'Оформление', start: 15, duration: 3, color: '#EC4899', hasError: false },
    { id: 7, name: 'Заключение', start: 14, duration: 1, color: '#06B6D4', hasError: true, errorType: 'order', explanation: 'Заключение до оформления — нарушение логики' },
    { id: 8, name: 'Презентация', start: 18, duration: 2, color: '#84CC16', hasError: true, errorType: 'no_buffer', explanation: 'Нет буфера перед КП4 (неделя 18)' },
  ];

  const milestones = [
    { week: 12, name: 'КП3' },
    { week: 18, name: 'КП4' },
    { week: 26, name: 'КП5' },
    { week: 29, name: 'КП6' },
    { week: 34, name: 'Защита' },
  ];

  const [clickedTasks, setClickedTasks] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const toggleTask = (taskId: number) => {
    setClickedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    const newAnswers: string[] = [];
    
    ganttTasks.forEach(task => {
      const isClicked = clickedTasks.has(task.id);
      if (task.hasError && isClicked) {
        correct++;
        newAnswers.push(`✓ ${task.name}: ${task.explanation}`);
      } else if (task.hasError && !isClicked) {
        newAnswers.push(`✗ Пропущена ошибка: ${task.name}`);
      } else if (!task.hasError && isClicked) {
        newAnswers.push(`✗ Ложная тревога: ${task.name}`);
      }
    });

    setAnswers(newAnswers);
    setScore(correct);
    setSubmitted(true);
    onComplete(correct, ganttTasks.filter(t => t.hasError).length, newAnswers);
  };

  const totalWeeks = 20;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
      <h3 className="text-xl font-bold text-orange-800 mb-2">Найди ошибки в плане-графике</h3>
      <p className="text-gray-600 mb-4">Перед тобой визуальный план-график. Кликай на задачи, в которых есть ошибки (нарушение зависимостей, нет буферов, неправильный порядок).</p>
      
      {/* Visual Gantt Chart */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 mb-4 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Week headers */}
          <div className="flex border-b-2 border-gray-400 mb-2">
            <div className="w-32 shrink-0 text-xs font-bold text-gray-600 p-1">Задача</div>
            {Array.from({ length: totalWeeks }, (_, i) => (
              <div key={i} className={`w-8 shrink-0 text-center text-[9px] p-0.5 ${milestones.find(m => m.week === i + 1) ? 'bg-red-100 font-bold text-red-600' : 'text-gray-500'}`}>
                {i + 1}
              </div>
            ))}
          </div>

          {/* Milestones row */}
          <div className="flex border-b border-gray-300 mb-2">
            <div className="w-32 shrink-0 text-xs font-bold text-red-600 p-1">⚑ Вехи</div>
            {Array.from({ length: totalWeeks }, (_, i) => {
              const milestone = milestones.find(m => m.week === i + 1);
              return (
                <div key={i} className={`w-8 shrink-0 text-center text-[9px] p-0.5 ${milestone ? 'bg-red-200 text-red-700 font-bold' : ''}`}>
                  {milestone ? '⚑' : ''}
                </div>
              );
            })}
          </div>

          {/* Task rows */}
          {ganttTasks.map(task => (
            <div key={task.id} className="flex border-b border-gray-200 items-center">
              <div 
                onClick={() => !submitted && toggleTask(task.id)}
                className={`w-32 shrink-0 text-xs p-1 font-medium cursor-pointer transition-all ${
                  clickedTasks.has(task.id) 
                    ? (task.hasError ? 'bg-orange-200 border-2 border-orange-400' : 'bg-red-100 border-2 border-red-300')
                    : 'hover:bg-gray-100'
                }`}
                title={task.name}
              >
                {task.name}
              </div>
              {Array.from({ length: totalWeeks }, (_, weekIdx) => {
                const isInRange = weekIdx + 1 >= task.start && weekIdx + 1 < task.start + task.duration;
                return (
                  <div 
                    key={weekIdx}
                    onClick={() => !submitted && isInRange && toggleTask(task.id)}
                    className={`w-8 h-8 shrink-0 border border-gray-100 ${isInRange ? 'cursor-pointer' : ''} transition-all ${
                      clickedTasks.has(task.id) && isInRange
                        ? (task.hasError ? 'ring-2 ring-orange-500' : 'ring-2 ring-red-500')
                        : ''
                    }`}
                    style={isInRange ? { backgroundColor: task.color, opacity: 0.8 } : {}}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-xs text-blue-800">
        💡 <strong>Подсказка:</strong> Проверяй: 1) Зависимости задач (теория после литературы), 2) Порядок (заключение после данных), 3) Буферы перед вехами (КП3, КП4), 4) Перегруз недель.
      </div>

      <p className="text-sm text-gray-600 mb-2">Отмечено задач с ошибками: {clickedTasks.size}</p>

      {!submitted ? (
        <button onClick={handleSubmit}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Проверить ({clickedTasks.size} отмечено)
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 3 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 3 ? 'Отлично! Ты понимаешь принципы построения плана-графика: зависимости, буферы, равномерная загрузка, вехи, логический порядок.' : 'Не все ошибки найдены. Типичные ошибки плана: нарушение порядка, нет буферов, параллельные зависимые задачи, перегруз недель.'}</p>
          <p className="text-sm mt-2">Найдено ошибок: {score}/{ganttTasks.filter(t => t.hasError).length}</p>
          {answers.length > 0 && (
            <details className="mt-2">
              <summary className="text-sm text-orange-600 cursor-pointer">Показать все ошибки</summary>
              <ul className="mt-2 text-xs space-y-1">
                {answers.map((a: string, i: number) => <li key={i} className={a.startsWith('✓') ? 'text-green-700' : 'text-red-700'}>{a}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Readiness Checklist ====================
export function ReadinessChecklistGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const items = [
    { id: 'theme', text: 'Тема проекта сформулирована', category: 'must' },
    { id: 'problem', text: 'Проблема обозначена как вопрос/противоречие', category: 'must' },
    { id: 'domain', text: 'Предметная область определена', category: 'must' },
    { id: 'consultant', text: 'Консультант выбран и согласован', category: 'must' },
    { id: 'product', text: 'Понятно, каким будет продукт', category: 'must' },
    { id: 'structure', text: 'Знаю структуру проекта', category: 'should' },
    { id: 'goal', text: 'Цель сформулирована по SMART', category: 'later' },
    { id: 'hypothesis', text: 'Гипотеза сформулирована', category: 'later' },
    { id: 'gantt', text: 'План-график составлен', category: 'later' },
  ];
  
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    items.forEach(item => {
      const isChecked = checked.has(item.id);
      const shouldCheck = item.category === 'must';
      if (isChecked === shouldCheck) correct++;
      answers.push(`${item.text}: ${isChecked ? '✓' : '✗'} (должно быть: ${shouldCheck ? '✓' : '✗'})`);
    });
    setScore(correct);
    setSubmitted(true);
    onComplete(correct, items.length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-violet-100">
      <h3 className="text-xl font-bold text-violet-800 mb-2">Чек-лист готовности к КП1</h3>
      <p className="text-gray-600 mb-4">Отметь, что должно быть готово к первому чек-поинту (конец урока 3). Подумай: что ОБЯЗАТЕЛЬНО, а что можно доработать позже?</p>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} onClick={() => !submitted && toggle(item.id)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${checked.has(item.id) ? 'bg-violet-50 border-violet-300' : 'bg-gray-50 border-gray-200 hover:border-violet-200'} ${submitted ? (item.category === 'must' ? (checked.has(item.id) ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') : (!checked.has(item.id) ? 'border-green-300 bg-green-50' : 'border-orange-300 bg-orange-50')) : ''}`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${checked.has(item.id) ? 'bg-violet-500 border-violet-500 text-white' : 'border-gray-300'}`}>
              {checked.has(item.id) && '✓'}
            </div>
            <span className="text-sm font-medium">{item.text}</span>
            {submitted && (
              <span className="text-xs ml-auto">
                {item.category === 'must' ? '🔴 обязательно' : item.category === 'should' ? '🟡 желательно' : '🟢 позже'}
              </span>
            )}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
          Проверить
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 7 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 7 ? 'Отлично! Ты правильно определил, что обязательно для КП1.' : 'Не все верно. К КП1 ОБЯЗАТЕЛЬНЫ: тема, проблема, предметная область, консультант, понимание продукта. Цель, гипотеза и план-график — на следующих уроках.'}</p>
          <p className="text-sm mt-2">Результат: {score}/{items.length}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Passport Draft (выбор из вариантов) ====================
export function PassportDraftGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const fields = {
    theme: {
      label: 'Тема проекта:',
      options: [
        { text: 'Экология', correct: false, reason: 'Слишком общая — это направление, не тема' },
        { text: 'Разработка буклета по сортировке отходов для учеников 5–6 классов', correct: true, reason: '' },
        { text: 'Мусор', correct: false, reason: 'Это одно слово, не тема проекта' },
      ]
    },
    problem: {
      label: 'Проблема (противоречие/вопрос):',
      options: [
        { text: 'В школе много мусора', correct: false, reason: 'Это констатация факта, а не проблема' },
        { text: 'Ученики 5–6 классов не знают правил сортировки отходов, хотя в школе введён раздельный сбор', correct: true, reason: '' },
        { text: 'Проблема экологии', correct: false, reason: 'Слишком общая, нет конкретики' },
      ]
    },
    goal: {
      label: 'Цель:',
      options: [
        { text: 'Улучшить экологическую ситуацию', correct: false, reason: 'Расплывчато, нет глагола действия' },
        { text: 'Разработать буклет, повышающий знания о сортировке отходов на 30% к маю 2025 г.', correct: true, reason: '' },
        { text: 'Изучить проблему мусора', correct: false, reason: 'Это не цель, а направление. Нет продукта и сроков' },
      ]
    },
    product: {
      label: 'Продукт:',
      options: [
        { text: 'Что-нибудь полезное', correct: false, reason: 'Неконкретно' },
        { text: 'Буклет из 8 страниц с визуальными инструкциями по сортировке отходов', correct: true, reason: '' },
        { text: 'Исследование', correct: false, reason: 'Это вид работы, не продукт' },
      ]
    },
    domain: {
      label: 'Предметная область:',
      options: [
        { text: 'Всё на свете', correct: false, reason: 'Не определена' },
        { text: 'Экология / экологическое просвещение', correct: true, reason: '' },
        { text: 'Школа', correct: false, reason: 'Это место, не предметная область' },
      ]
    },
  };

  const [selections, setSelections] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (field: string, optIdx: number) => {
    setSelections(prev => ({ ...prev, [field]: optIdx }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    
    Object.entries(fields).forEach(([key, field]) => {
      const selIdx = selections[key];
      const opt = field.options[selIdx];
      if (opt && opt.correct) { correct++; answers.push(`${field.label} ✓`); }
      else { answers.push(`${field.label} ✗`); }
    });

    setScore(correct);
    setSubmitted(true);
    onComplete(correct, Object.keys(fields).length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-sky-100">
      <h3 className="text-xl font-bold text-sky-800 mb-2">Черновик паспорта проекта</h3>
      <p className="text-gray-600 mb-4">Выбери правильную формулировку для каждого поля паспорта.</p>
      <div className="space-y-4">
        {Object.entries(fields).map(([key, field]) => (
          <div key={key}>
            <label className="text-sm font-semibold text-sky-700">{field.label}</label>
            <div className="space-y-1 mt-1">
              {field.options.map((opt, idx) => (
                <div key={idx} onClick={() => !submitted && handleSelect(key, idx)}
                  className={`p-2 rounded-lg border-2 cursor-pointer text-sm transition-all ${
                    submitted 
                      ? (opt.correct ? 'bg-green-50 border-green-300' : selections[key] === idx ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200')
                      : (selections[key] === idx ? 'bg-sky-50 border-sky-300' : 'bg-gray-50 border-gray-200 hover:border-sky-200')
                  }`}>
                  <span>{opt.text}</span>
                  {submitted && !opt.correct && selections[key] === idx && opt.reason && (
                    <span className="text-xs ml-2 text-red-600">💡 {opt.reason}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={Object.keys(selections).length < Object.keys(fields).length}
          className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50">
          Проверить паспорт
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 4 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 4 ? 'Хороший черновик! Паспорт содержит все основные элементы.' : 'Есть пробелы. Паспорт должен содержать: конкретную тему, проблему как противоречие, цель с глаголом действия, продукт и предметную область.'}</p>
          <p className="text-sm mt-2">Заполнено правильно: {score}/{Object.keys(fields).length}</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Relevance Text (выбор аргументов) ====================
export function RelevanceTextGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const arguments_list = [
    { text: 'Проблема отходов актуальна для всей планеты: ежегодно образуется более 2 млрд тонн мусора', correct: true, type: 'importance' },
    { text: 'Мусор — это плохо', correct: false, type: 'importance', reason: 'Слишком общее утверждение, нет аргумента' },
    { text: 'В нашей школе с сентября введён раздельный сбор, но 70% учеников не знают правил сортировки', correct: true, type: 'now' },
    { text: 'Все говорят об экологии', correct: false, type: 'now', reason: 'Не объясняет, почему актуально именно сейчас и здесь' },
    { text: 'Недавний опрос показал: только 15% пятиклассников правильно сортируют отходы', correct: true, type: 'now' },
    { text: 'Экология важна', correct: false, type: 'importance', reason: 'Констатация, не аргумент' },
    { text: 'Результаты можно использовать классными руководителями для просветительской работы', correct: true, type: 'practice' },
    { text: 'Это будет полезно', correct: false, type: 'practice', reason: 'Неконкретно: кто, как, когда?' },
    { text: 'Буклет могут применять в 5–6 классах ежегодно, обновляя данные', correct: true, type: 'practice' },
    { text: 'Все должны заботиться о природе', correct: false, type: 'importance', reason: 'Лозунг, не аргумент актуальности' },
  ];

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const toggle = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    
    arguments_list.forEach((arg, idx) => {
      const isSelected = selected.has(idx);
      if (arg.correct && isSelected) { correct++; answers.push(`✓ ${arg.text.substring(0, 50)}...`); }
      else if (arg.correct && !isSelected) { answers.push(`✗ Пропущен: ${arg.text.substring(0, 50)}...`); }
      else if (!arg.correct && isSelected) { answers.push(`✗ Лишний: ${arg.text.substring(0, 50)}... — ${arg.reason}`); }
    });

    setScore(correct);
    setSubmitted(true);
    onComplete(correct, arguments_list.filter(a => a.correct).length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-lime-100">
      <h3 className="text-xl font-bold text-lime-800 mb-2">Аргументы актуальности</h3>
      <p className="text-gray-600 mb-4">Выбери только настоящие аргументы для текста «Актуальность». Хороший аргумент — конкретный, с данными, объясняет «почему важно», «почему сейчас», «кто использует».</p>
      <div className="space-y-2">
        {arguments_list.map((arg, idx) => (
          <div key={idx} onClick={() => !submitted && toggle(idx)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
              submitted 
                ? (arg.correct 
                    ? (selected.has(idx) ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300')
                    : (selected.has(idx) ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'))
                : (selected.has(idx) ? 'bg-lime-50 border-lime-300' : 'bg-gray-50 border-gray-200 hover:border-lime-200')
            }`}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${selected.has(idx) ? 'bg-lime-500 border-lime-500 text-white' : 'border-gray-300'}`}>
              {selected.has(idx) && '✓'}
            </div>
            <span className="text-sm flex-1">{arg.text}</span>
            {submitted && !arg.correct && selected.has(idx) && (
              <span className="text-xs text-red-600 shrink-0">💡 {arg.reason}</span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Выбрано: {selected.size} (правильных: {arguments_list.filter(a => a.correct).length})</p>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={selected.size < 3}
          className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50">
          Проверить ({selected.size} выбрано)
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 4 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 4 ? 'Хороший набор аргументов! Текст актуальности содержит обоснование важности, связь с текущей ситуацией и практическую значимость.' : 'Текст актуальности должен содержать: 1) Почему проблема важна в принципе (с данными). 2) Почему именно сейчас (конкретика). 3) Кто будет использовать результат.'}</p>
          <p className="text-sm mt-2">Правильных аргументов: {score}/{arguments_list.filter(a => a.correct).length}</p>
        </div>
      )}
    </div>
  );
}
