import React, { useState, useCallback } from 'react';
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
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const newOrder = [...order];
    const [removed] = newOrder.splice(dragIdx, 1);
    newOrder.splice(targetIdx, 0, removed);
    setOrder(newOrder);
    setDragIdx(null);
  };

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
      answers.push(`${idx + 1}. ${item} ${isCorrect ? '✓' : '✗ (должно быть: ' + content.correctOrder[idx] + ')'}`);
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
          <div key={item} draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(idx)}
            className={`p-3 rounded-lg border-2 cursor-move transition-all flex items-center gap-2 ${submitted ? (item === content.correctOrder[idx] ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300') : 'bg-purple-50 border-purple-200 hover:border-purple-400'}`}>
            <span className="text-lg font-bold text-purple-400 w-8">{idx + 1}.</span>
            <span className="flex-1 text-sm font-medium">{item}</span>
            {!submitted && (
              <div className="flex flex-col gap-1">
                <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-xs px-1 bg-purple-200 rounded disabled:opacity-30">▲</button>
                <button onClick={() => moveItem(idx, 1)} disabled={idx === order.length - 1} className="text-xs px-1 bg-purple-200 rounded disabled:opacity-30">▼</button>
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
  const [showReasons, setShowReasons] = useState<Record<number, boolean>>({});

  const handleClassify = (idx: number, classification: string) => {
    setClassifications(prev => ({ ...prev, [idx]: classification }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    content.ideas.forEach((idea, idx) => {
      const cls = classifications[idx];
      answers.push(`${idea.text}: ${cls || 'не определено'} → верно: ${idea.correct}`);
      if (cls === idea.correct) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    setShowReasons(Object.fromEntries(content.ideas.map((_, i) => [i, true])));
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
            {submitted && showReasons[idx] && (
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

// ==================== MINI GAME: Task Tree ====================
export function TaskTreeGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.task_tree;
  const [tasks, setTasks] = useState<string[]>(['', '', '', '']);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const updateTask = (idx: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[idx] = value;
    setTasks(newTasks);
  };

  const addTask = () => {
    if (tasks.length < 6) setTasks([...tasks, '']);
  };

  const removeTask = (idx: number) => {
    if (tasks.length > 4) setTasks(tasks.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    const filledTasks = tasks.filter(t => t.trim().length > 0);
    let correct = 0;
    const answers: string[] = [];
    
    // Check each task
    filledTasks.forEach((task, idx) => {
      const startsWithVerb = /^(изучить|провести|разработать|создать|протестировать|оформить|проанализировать|выявить|составить|подготовить|написать|сделать)/i.test(task);
      const notTooGeneral = task.length > 15;
      const isSingle = !task.includes(' и ') || task.split(' и ').length <= 2;
      
      if (startsWithVerb && notTooGeneral) correct += 0.5;
      if (isSingle) correct += 0.25;
      answers.push(`${idx + 1}. ${task} ${startsWithVerb ? '✓ глагол' : '✗ нет глагола'} ${notTooGeneral ? '✓ конкретно' : '✗ слишком общо'}`);
    });

    // Bonus for correct count
    if (filledTasks.length >= 4 && filledTasks.length <= 6) correct += 0.5;
    
    const finalScore = Math.min(Math.round(correct), content.correctTasks.length);
    setScore(finalScore);
    setSubmitted(true);
    onComplete(finalScore, content.correctTasks.length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-teal-100">
      <h3 className="text-xl font-bold text-teal-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-2">{content.description}</p>
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-teal-700">🎯 Цель: «{content.goal}»</p>
      </div>
      <div className="space-y-2">
        {tasks.map((task, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-teal-400 font-bold w-6">{idx + 1}.</span>
            <input type="text" value={task} onChange={e => updateTask(idx, e.target.value)}
              placeholder="Начните с глагола: изучить, провести, разработать..."
              className="flex-1 p-2 border-2 border-teal-200 rounded-lg text-sm focus:border-teal-400 focus:outline-none"
              disabled={submitted} />
            {!submitted && tasks.length > 4 && (
              <button onClick={() => removeTask(idx)} className="text-red-400 hover:text-red-600 text-lg">×</button>
            )}
          </div>
        ))}
      </div>
      {!submitted && tasks.length < 6 && (
        <button onClick={addTask} className="mt-2 text-sm text-teal-600 hover:text-teal-800">+ Добавить задачу</button>
      )}
      {!submitted ? (
        <button onClick={handleSubmit} disabled={tasks.filter(t => t.trim()).length < 4}
          className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50">
          Проверить ({tasks.filter(t => t.trim()).length} задач)
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 4 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 4 ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Результат: {score}/{content.correctTasks.length}</p>
          <details className="mt-2">
            <summary className="text-sm text-teal-600 cursor-pointer">Показать эталон</summary>
            <ol className="mt-2 text-sm space-y-1">
              {content.correctTasks.map((t, i) => <li key={i} className="text-gray-700">{i + 1}. {t}</li>)}
            </ol>
          </details>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Object, Subject, Hypothesis ====================
export function ObjectSubjectHypothesisGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.object_subject_hypothesis;
  const [selectedObject, setSelectedObject] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [hypothesisParts, setHypothesisParts] = useState({ if: '', then: '', because: '' });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    
    if (selectedObject !== null && content.objectOptions[selectedObject].correct) correct++;
    answers.push(`Объект: ${selectedObject !== null ? content.objectOptions[selectedObject].text : 'не выбран'} ${selectedObject !== null && content.objectOptions[selectedObject].correct ? '✓' : '✗'}`);
    
    if (selectedSubject !== null && content.subjectOptions[selectedSubject].correct) correct++;
    answers.push(`Предмет: ${selectedSubject !== null ? content.subjectOptions[selectedSubject].text : 'не выбран'} ${selectedSubject !== null && content.subjectOptions[selectedSubject].correct ? '✓' : '✗'}`);
    
    // Check hypothesis
    const ifCorrect = hypothesisParts.if.length > 20;
    const thenCorrect = hypothesisParts.then.length > 10;
    const becauseCorrect = hypothesisParts.because.length > 10;
    if (ifCorrect && thenCorrect && becauseCorrect) correct++;
      answers.push('Гипотеза: Если...' + (ifCorrect ? '✓' : '✗') + ' То...' + (thenCorrect ? '✓' : '✗') + ' Потому что...' + (becauseCorrect ? '✓' : '✗'));
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
        <h4 className="font-semibold text-amber-700 mb-2">3. Собери гипотезу «Если… то… потому что…»:</h4>
        <div className="space-y-2">
          <div className="flex gap-2 items-start">
            <span className="text-amber-600 font-bold shrink-0">Если…</span>
            <textarea value={hypothesisParts.if} onChange={e => setHypothesisParts(p => ({ ...p, if: e.target.value }))}
              placeholder="Что делаем?" className="flex-1 p-2 border-2 border-amber-200 rounded-lg text-sm" rows={2} disabled={submitted} />
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-amber-600 font-bold shrink-0">То…</span>
            <textarea value={hypothesisParts.then} onChange={e => setHypothesisParts(p => ({ ...p, then: e.target.value }))}
              placeholder="Какой результат?" className="flex-1 p-2 border-2 border-amber-200 rounded-lg text-sm" rows={2} disabled={submitted} />
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-amber-600 font-bold shrink-0">Потому что…</span>
            <textarea value={hypothesisParts.because} onChange={e => setHypothesisParts(p => ({ ...p, because: e.target.value }))}
              placeholder="Почему так произойдёт?" className="flex-1 p-2 border-2 border-amber-200 rounded-lg text-sm" rows={2} disabled={submitted} />
          </div>
        </div>
      </div>

      {!submitted ? (
        <button onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">
          Проверить
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score === 3 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score === 3 ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Результат: {score}/3</p>
          <details className="mt-2">
            <summary className="text-sm text-amber-600 cursor-pointer">Показать эталон</summary>
            <div className="mt-2 text-sm bg-amber-50 p-3 rounded">
              <p><strong>Объект:</strong> {content.objectOptions.find(o => o.correct)?.text}</p>
              <p><strong>Предмет:</strong> {content.subjectOptions.find(o => o.correct)?.text}</p>
              <p><strong>Гипотеза:</strong> {content.hypothesisParts.if} {content.hypothesisParts.then} {content.hypothesisParts.because}</p>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Defense Presentation ====================
export function DefensePresentationGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.defense_presentation;
  const [chainOrder, setChainOrder] = useState<number[]>(() => [0, 1, 2, 3].sort(() => Math.random() - 0.5));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState<string[]>([]);
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

  const submitQuestionAnswer = (answer: string) => {
    const newAnswers = [...questionAnswers, answer];
    setQuestionAnswers(newAnswers);
    if (currentQuestion < content.consultantQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate final score
      let qScore = 0;
      newAnswers.forEach(a => {
        if (a.length > 30) qScore += 0.5;
      });
      setScore(prev => Math.min(prev + Math.round(qScore), 5));
      setPhase('result');
      onComplete(Math.min(Math.round(score + qScore), 5), 5, [...questionAnswers, answer]);
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
                <button onClick={() => moveChainItem(pos, -1)} disabled={pos === 0} className="text-xs px-1 bg-rose-200 rounded disabled:opacity-30">▲</button>
                <button onClick={() => moveChainItem(pos, 1)} disabled={pos === chainOrder.length - 1} className="text-xs px-1 bg-rose-200 rounded disabled:opacity-30">▼</button>
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
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100">
        <h3 className="text-xl font-bold text-rose-800 mb-2">Вопросы консультанта ({currentQuestion + 1}/{content.consultantQuestions.length})</h3>
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 mb-4">
          <p className="font-medium">💬 {q.question}</p>
        </div>
        <textarea id="defense-answer" className="w-full p-3 border-2 border-rose-200 rounded-lg text-sm" rows={4}
          placeholder="Ваш ответ консультанту..." />
        <button onClick={() => {
          const el = document.getElementById('defense-answer') as HTMLTextAreaElement;
          submitQuestionAnswer(el?.value || '');
        }} className="mt-4 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">
          {currentQuestion < content.consultantQuestions.length - 1 ? 'Ответить →' : 'Завершить защиту'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-rose-100">
      <h3 className="text-xl font-bold text-rose-800 mb-2">Результат защиты</h3>
      <div className={`p-4 rounded-lg ${score >= 4 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
        <p className="font-semibold">{score >= 4 ? content.explanation.correct : content.explanation.incorrect}</p>
        <p className="text-sm mt-2">Баллы за защиту: {score}/5</p>
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
    
    // Bonus for milestones
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
                const isStart = start === weekIdx + 1;
                const isInRange = start !== undefined && weekIdx + 1 >= start && weekIdx + 1 < start + task.duration;
                return (
                  <div key={weekIdx} onClick={() => !submitted && handlePlace(idx, weekIdx + 1)}
                    className={`w-6 h-6 shrink-0 cursor-pointer border border-gray-100 transition-all ${isInRange ? '' : 'hover:bg-cyan-50'}`}
                    style={isInRange ? { backgroundColor: colors[idx % colors.length], opacity: 0.8 } : isStart ? { backgroundColor: colors[idx % colors.length] } : {}}>
                    {isStart && <span className="text-[8px] text-white font-bold flex items-center justify-center h-full">{task.duration}н</span>}
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

// ==================== MINI GAME: Find Errors ====================
export function FindErrorsGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const content = miniGameContent.find_errors;
  const [foundErrors, setFoundErrors] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const toggleError = (idx: number) => {
    setFoundErrors(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    content.errors.forEach((err, idx) => {
      const found = foundErrors.has(idx);
      if (found) correct++;
      answers.push(`${err.error}: ${found ? 'найдено ✓' : 'пропущено ✗'}`);
    });
    setScore(correct);
    setSubmitted(true);
    onComplete(correct, content.errors.length, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-orange-100">
      <h3 className="text-xl font-bold text-orange-800 mb-2">{content.title}</h3>
      <p className="text-gray-600 mb-4">{content.description}</p>
      
      {/* Fake Gantt chart with errors */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="text-xs font-bold text-gray-500 mb-2">План-график ученика (с ошибками):</div>
          <div className="space-y-1">
            {content.errors.map((err, idx) => (
              <div key={idx} onClick={() => !submitted && toggleError(idx)}
                className={`p-2 rounded border-2 cursor-pointer text-xs transition-all ${foundErrors.has(idx) ? 'bg-orange-100 border-orange-400' : 'bg-white border-gray-200 hover:border-orange-200'}`}>
                <span className="font-medium">Этап {idx + 1}:</span> {err.error}
                {submitted && (
                  <span className={`ml-2 ${foundErrors.has(idx) ? 'text-green-600' : 'text-red-600'}`}>
                    {foundErrors.has(idx) ? '✓ Найдено' : '✗ Пропущено'}
                  </span>
                )}
                {submitted && foundErrors.has(idx) && (
                  <p className="mt-1 text-orange-700 bg-orange-50 p-1 rounded">💡 {err.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-2">Найдено ошибок: {foundErrors.size}/{content.errors.length}</p>

      {!submitted ? (
        <button onClick={handleSubmit}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          Проверить
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= content.errors.length - 1 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= content.errors.length - 1 ? content.explanation.correct : content.explanation.incorrect}</p>
          <p className="text-sm mt-2">Найдено: {score}/{content.errors.length}</p>
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
      answers.push(item.text + ': ' + (isChecked ? '✓' : '✗') + ' (должно быть: ' + (shouldCheck ? '✓' : '✗') + ')');
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

// ==================== MINI GAME: Passport Draft ====================
export function PassportDraftGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const [fields, setFields] = useState({
    theme: '',
    problem: '',
    goal: '',
    product: '',
    domain: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    let correct = 0;
    const answers: string[] = [];
    
    // Theme: should be specific
    if (fields.theme.length > 10) { correct++; answers.push('Тема: ✓ конкретная'); }
    else answers.push('Тема: ✗ слишком краткая');
    
    // Problem: should contain question or contradiction
    if (fields.problem.length > 15 && (fields.problem.includes('?') || fields.problem.includes('но') || fields.problem.includes('однако') || fields.problem.includes('не'))) { correct++; answers.push('Проблема: ✓ содержит противоречие/вопрос'); }
    else answers.push('Проблема: ✗ нет противоречия или вопроса');
    
    // Goal: should start with verb
    if (/^(разработать|выявить|создать|доказать|исследовать|определить|составить|подготовить)/i.test(fields.goal)) { correct++; answers.push('Цель: ✓ начинается с глагола'); }
    else answers.push('Цель: ✗ не начинается с глагола действия');
    
    // Product: should be concrete
    if (fields.product.length > 5) { correct++; answers.push('Продукт: ✓ указан'); }
    else answers.push('Продукт: ✗ не указан');
    
    // Domain: should be filled
    if (fields.domain.length > 3) { correct++; answers.push('Область: ✓ указана'); }
    else answers.push('Область: ✗ не указана');

    setScore(correct);
    setSubmitted(true);
    onComplete(correct, 5, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-sky-100">
      <h3 className="text-xl font-bold text-sky-800 mb-2">Черновик паспорта проекта</h3>
      <p className="text-gray-600 mb-4">Заполни основные поля паспорта. Не бойся ошибиться — будем дорабатывать!</p>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-sky-700">Тема проекта:</label>
          <input type="text" value={fields.theme} onChange={e => updateField('theme', e.target.value)}
            className="w-full p-2 border-2 border-sky-200 rounded-lg text-sm mt-1" placeholder="Например: Разработка буклета по..." disabled={submitted} />
        </div>
        <div>
          <label className="text-sm font-semibold text-sky-700">Проблема (противоречие/вопрос):</label>
          <textarea value={fields.problem} onChange={e => updateField('problem', e.target.value)}
            className="w-full p-2 border-2 border-sky-200 rounded-lg text-sm mt-1" rows={2} placeholder="Что не так? Какое противоречие?" disabled={submitted} />
        </div>
        <div>
          <label className="text-sm font-semibold text-sky-700">Цель (глагол действия):</label>
          <input type="text" value={fields.goal} onChange={e => updateField('goal', e.target.value)}
            className="w-full p-2 border-2 border-sky-200 rounded-lg text-sm mt-1" placeholder="Разработать/Выявить/Создать..." disabled={submitted} />
        </div>
        <div>
          <label className="text-sm font-semibold text-sky-700">Продукт:</label>
          <input type="text" value={fields.product} onChange={e => updateField('product', e.target.value)}
            className="w-full p-2 border-2 border-sky-200 rounded-lg text-sm mt-1" placeholder="Буклет, сайт, исследование..." disabled={submitted} />
        </div>
        <div>
          <label className="text-sm font-semibold text-sky-700">Предметная область:</label>
          <input type="text" value={fields.domain} onChange={e => updateField('domain', e.target.value)}
            className="w-full p-2 border-2 border-sky-200 rounded-lg text-sm mt-1" placeholder="Экология, история, информатика..." disabled={submitted} />
        </div>
      </div>
      {!submitted ? (
        <button onClick={handleSubmit} className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
          Проверить паспорт
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 4 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 4 ? 'Хороший черновик! Паспорт содержит все основные элементы. Будем уточнять на следующих уроках.' : 'Есть пробелы. Паспорт должен содержать: конкретную тему, проблему как противоречие, цель с глаголом действия, продукт и предметную область.'}</p>
          <p className="text-sm mt-2">Заполнено: {score}/5</p>
        </div>
      )}
    </div>
  );
}

// ==================== MINI GAME: Relevance Text ====================
export function RelevanceTextGame({ onComplete }: { onComplete: (score: number, max: number, answers: string[]) => void }) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    const words = text.split(/\s+/).filter(w => w.length > 0);
    let correct = 0;
    const answers: string[] = [];
    
    // Length check (~half page = 100-200 words)
    if (words.length >= 50) { correct++; answers.push('✓ Объём достаточный'); }
    else answers.push(`✗ Слишком кратко (${words.length} слов, нужно ~100-200)`);
    
    // Has arguments
    const hasArgument = /важно|необходимо|проблема|актуальн|значим|потребност|нерешён/i.test(text);
    if (hasArgument) { correct++; answers.push('✓ Содержит аргументы значимости'); }
    else answers.push('✗ Нет аргументов значимости');
    
    // Has "why now"
    const hasNow = /сейчас|в настоящее|сегодня|недавно|последн|изменен|нов/i.test(text);
    if (hasNow) { correct++; answers.push('✓ Обоснована актуальность именно сейчас'); }
    else answers.push('✗ Не объяснено, почему актуально именно сейчас');
    
    // Has practical significance
    const hasPractice = /могут использовать|применить|практическ|польза|поможет/i.test(text);
    if (hasPractice) { correct++; answers.push('✓ Указана практическая значимость'); }
    else answers.push('✗ Не указана практическая значимость');

    setScore(correct);
    setSubmitted(true);
    onComplete(correct, 4, answers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-lime-100">
      <h3 className="text-xl font-bold text-lime-800 mb-2">Текст «Актуальность»</h3>
      <p className="text-gray-600 mb-4">Напиши текст актуальности (~половина страницы, 100-200 слов). Обоснуй: почему тема важна, почему сейчас, кто будет использовать результат.</p>
      <textarea value={text} onChange={e => setText(e.target.value)}
        className="w-full p-3 border-2 border-lime-200 rounded-lg text-sm" rows={8}
        placeholder="Экологическая проблема отходов в нашей школе актуальна потому что... В настоящее время... Результаты могут быть использованы..."
        disabled={submitted} />
      <p className="text-xs text-gray-400 mt-1">Слов: {text.split(/\s+/).filter(w => w.length > 0).length}</p>
      {!submitted ? (
        <button onClick={handleSubmit} disabled={text.split(/\s+/).filter(w => w.length > 0).length < 20}
          className="mt-4 px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50">
          Проверить текст
        </button>
      ) : (
        <div className={`mt-4 p-4 rounded-lg ${score >= 3 ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
          <p className="font-semibold">{score >= 3 ? 'Хороший текст актуальности! Содержит аргументы, обоснование и практическую значимость.' : 'Текст нуждается в доработке. Актуальность должна содержать: 1) Почему проблема важна в принципе. 2) Почему именно сейчас. 3) Кто будет использовать результат.'}</p>
          <p className="text-sm mt-2">Баллы: {score}/4</p>
        </div>
      )}
    </div>
  );
}
