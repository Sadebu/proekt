import React, { useState, useCallback } from 'react';
import { useGameState } from './hooks/useGameState';
import { scenes } from './data/gameData';
import { checkpointCriteria } from './data/gameData';
import { GameState } from './types';
import { TeacherPage } from './components/TeacherPage';
import { Glossary } from './components/Glossary';
import {
  ProjectVsReferatGame,
  StructureAssemblyGame,
  IdeaFilterGame,
  SmartConstructorGame,
  TaskTreeGame,
  ObjectSubjectHypothesisGame,
  DefensePresentationGame,
  GanttBuilderGame,
  FindErrorsGame,
  ReadinessChecklistGame,
  PassportDraftGame,
  RelevanceTextGame,
} from './components/MiniGames';

type Screen = 'start' | 'game' | 'teacher';

export default function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [showGlossary, setShowGlossary] = useState(false);
  const {
    gameState, startGame, continueGame, completeScene, goToScene,
    addMiniGameResult, addCheckpointResult, addSceneAnswer,
    updateProjectData, updateGanttPlan, completeGame, resetGame, hasSave,
  } = useGameState();

  if (screen === 'teacher') {
    return <TeacherPage onBack={() => setScreen('start')} />;
  }

  if (!gameState.profile || screen === 'start') {
    return (
      <StartScreen
        hasSave={hasSave()}
        onStart={(name, cls) => { startGame(name, cls); setScreen('game'); }}
        onContinue={() => { continueGame(); setScreen('game'); }}
        onTeacher={() => setScreen('teacher')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top bar */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-blue-800">🎓 Проектный Квест</span>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-600">{gameState.profile.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
              {gameState.totalScore}/15 баллов
            </span>
            <button onClick={() => setShowGlossary(true)} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200">
              📖 Глоссарий
            </button>
            <button onClick={() => setScreen('start')} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
              Меню
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto px-4 pt-3">
        <div className="flex items-center gap-1">
          {scenes.filter(s => s.block > 0).map((scene, idx) => {
            const isCompleted = gameState.completedScenes.includes(scene.id);
            const isCurrent = gameState.currentScene === scene.id;
            return (
              <div key={scene.id} className={`flex-1 h-2 rounded-full transition-all ${isCompleted ? 'bg-green-400' : isCurrent ? 'bg-blue-400 animate-pulse' : 'bg-gray-200'}`}
                title={`Урок ${scene.lessonNumber}: ${scene.title}`} />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Блок 1: Инициация</span>
          <span>Блок 2: Целеполагание</span>
          <span>Блок 3: План-график</span>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <GameContent
          gameState={gameState}
          onCompleteScene={completeScene}
          onGoToScene={goToScene}
          onAddMiniGameResult={addMiniGameResult}
          onAddCheckpointResult={addCheckpointResult}
          onAddSceneAnswer={addSceneAnswer}
          onUpdateProjectData={updateProjectData}
          onUpdateGanttPlan={updateGanttPlan}
          onCompleteGame={completeGame}
        />
      </div>

      {/* Glossary modal */}
      {showGlossary && <Glossary onClose={() => setShowGlossary(false)} />}
    </div>
  );
}

// ==================== START SCREEN ====================
function StartScreen({ hasSave, onStart, onContinue, onTeacher }: {
  hasSave: boolean;
  onStart: (name: string, cls?: string) => void;
  onContinue: () => void;
  onTeacher: () => void;
}) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [mode, setMode] = useState<'menu' | 'new' | 'continue'>('menu');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-white mb-2">Проектный Квест</h1>
          <p className="text-blue-200">Индивидуальная проектная деятельность • 10 класс</p>
          <p className="text-blue-300 text-sm mt-1">Уроки 1–9: от идеи до плана-графика</p>
        </div>

        {/* Menu */}
        {mode === 'menu' && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-3">
            <button onClick={() => setMode('new')}
              className="w-full p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02]">
              🚀 Начать новую игру
            </button>
            {hasSave && (
              <button onClick={() => { setMode('continue'); onContinue(); }}
                className="w-full p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02]">
                ▶ Продолжить
              </button>
            )}
            <button onClick={onTeacher}
              className="w-full p-4 bg-slate-600 hover:bg-slate-700 text-white rounded-xl font-bold transition-all hover:scale-[1.02]">
              📋 Страница учителя
            </button>
            <div className="text-center text-blue-200 text-xs mt-4">
              <p>Сюжетная игра-симулятор • 30–40 минут • 3 раздела • 9+ мини-игр</p>
              <p className="mt-1">Проживи первую четверть проектной работы: от генерации идеи до диаграммы Ганта</p>
            </div>
          </div>
        )}

        {/* New game form */}
        {mode === 'new' && (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Профиль участника</h2>
            <div className="space-y-3">
              <div>
                <label className="text-blue-200 text-sm">Имя *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full p-3 bg-white/20 text-white rounded-lg border border-white/30 placeholder-blue-300 focus:outline-none focus:border-blue-400"
                  placeholder="Введите ваше имя" />
              </div>
              <div>
                <label className="text-blue-200 text-sm">Класс (необязательно)</label>
                <input type="text" value={className} onChange={e => setClassName(e.target.value)}
                  className="w-full p-3 bg-white/20 text-white rounded-lg border border-white/30 placeholder-blue-300 focus:outline-none focus:border-blue-400"
                  placeholder="Например: 10А" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setMode('menu')} className="flex-1 p-3 bg-white/20 text-white rounded-lg hover:bg-white/30">
                  ← Назад
                </button>
                <button onClick={() => { if (name.trim()) onStart(name.trim(), className.trim()); }}
                  disabled={!name.trim()}
                  className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-bold">
                  Начать →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== GAME CONTENT ====================
function GameContent({ gameState, onCompleteScene, onGoToScene, onAddMiniGameResult, onAddCheckpointResult, onAddSceneAnswer, onUpdateProjectData, onUpdateGanttPlan, onCompleteGame }: {
  gameState: GameState;
  onCompleteScene: (id: string) => void;
  onGoToScene: (id: string) => void;
  onAddMiniGameResult: (r: any) => void;
  onAddCheckpointResult: (r: any) => void;
  onAddSceneAnswer: (a: any) => void;
  onUpdateProjectData: (d: any) => void;
  onUpdateGanttPlan: (p: any) => void;
  onCompleteGame: () => void;
}) {
  const scene = scenes.find(s => s.id === gameState.currentScene);
  const [miniGameCompleted, setMiniGameCompleted] = useState(false);
  const [checkpointEvaluated, setCheckpointEvaluated] = useState(false);
  const [showNarrative, setShowNarrative] = useState(0);

  if (!scene) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Сцена не найдена</p>
        <button onClick={() => onGoToScene('intro')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Вернуться в начало
        </button>
      </div>
    );
  }

  const handleMiniGameComplete = (gameId: string) => (score: number, max: number, answers: string[]) => {
    onAddMiniGameResult({
      gameId,
      score,
      maxScore: max,
      answers,
      completed: true,
      timestamp: new Date().toISOString(),
    });
    setMiniGameCompleted(true);
  };

  const handleCheckpointEvaluate = (cpId: string) => {
    const criteria = checkpointCriteria[cpId as keyof typeof checkpointCriteria];
    if (!criteria) return;

    // Calculate score based on mini-game results
    let score = 0;
    const reasons: string[] = [];
    const recommendations: string[] = [];

    if (cpId === 'cp1') {
      // Based on idea_filter and project_vs_referat results
      const ideaResult = gameState.miniGameResults.find(r => r.gameId === 'idea_filter');
      const pvResult = gameState.miniGameResults.find(r => r.gameId === 'project_vs_referat');
      const structResult = gameState.miniGameResults.find(r => r.gameId === 'structure_assembly');
      
      if (ideaResult && ideaResult.score >= 4) { score += 2; reasons.push('Идеи с предметными областями представлены'); }
      else { recommendations.push('Доработай идеи: каждая должна иметь предметную область'); }
      
      if (pvResult && pvResult.score >= 4 && structResult && structResult.score >= 5) { score += 2; reasons.push('Структура проекта понята'); }
      else { recommendations.push('Повтори отличия проекта от реферата и структуру'); }
      
      // Consultant choice is always available
      score += 2; reasons.push('Консультант выбран');
    } else if (cpId === 'cp2') {
      const smartResult = gameState.miniGameResults.find(r => r.gameId === 'smart_constructor');
      const taskResult = gameState.miniGameResults.find(r => r.gameId === 'task_tree');
      const objResult = gameState.miniGameResults.find(r => r.gameId === 'object_subject_hypothesis');
      const defResult = gameState.miniGameResults.find(r => r.gameId === 'defense_presentation');

      // Theme and problem
      if (gameState.projectData.theme && gameState.projectData.problem) { score += 2; reasons.push('Тема и проблема сформулированы'); }
      else { score += 1; recommendations.push('Уточни формулировку проблемы как противоречия'); }

      // SMART goal
      if (smartResult && smartResult.score >= 1) { score += 2; reasons.push('Цель по SMART'); }
      else { score += 1; recommendations.push('Переформулируй цель по SMART: глагол + измеримость + сроки'); }

      // Tasks
      if (taskResult && taskResult.score >= 3) { score += 1; reasons.push('Задачи декомпозированы'); }
      else { recommendations.push('Задачи должны начинаться с глагола, 4-6 штук'); }

      // Hypothesis
      if (objResult && objResult.score >= 2) { score += 2; reasons.push('Гипотеза сформулирована'); }
      else { score += 1; recommendations.push('Гипотеза по формуле: Если…то…потому что…'); }
    } else if (cpId === 'cp3') {
      const ganttResult = gameState.miniGameResults.find(r => r.gameId === 'gantt_builder');
      const errorsResult = gameState.miniGameResults.find(r => r.gameId === 'find_errors');

      if (ganttResult && ganttResult.score >= 5) { score += 1; reasons.push('Диаграмма с этапами, зависимостями и вехами'); }
      else { recommendations.push('Добавь зависимости, вехи и буферы в план-график'); }

      if (ganttResult && ganttResult.score >= 7) { score += 1; reasons.push('Сроки реалистичны'); }
      else { recommendations.push('Проверь реалистичность длительностей этапов'); }
    }

    score = Math.min(score, criteria.maxScore);
    const decision = score >= criteria.passScore ? 'accepted' : 'revision';

    onAddCheckpointResult({
      checkpointId: cpId,
      score,
      maxScore: criteria.maxScore,
      decision,
      reasons,
      recommendations,
      timestamp: new Date().toISOString(),
    });
    setCheckpointEvaluated(true);
  };

  const handleNext = () => {
    onCompleteScene(scene.id);
    if (scene.nextScene) {
      onGoToScene(scene.nextScene);
      setMiniGameCompleted(false);
      setCheckpointEvaluated(false);
      setShowNarrative(0);
    } else {
      // Final scene
      onCompleteGame();
    }
  };

  return (
    <div className="space-y-6">
      {/* Scene header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-2">
          {scene.block > 0 && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              Блок {scene.block} • Урок {scene.lessonNumber}
            </span>
          )}
          {scene.checkpointId && (
            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-bold">
              ⚡ ЧЕК-ПОИНТ
            </span>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{scene.title}</h2>
      </div>

      {/* Narrative */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="space-y-4">
          {scene.narrative.map((para, idx) => (
            <div key={idx} className={`transition-all duration-500 ${idx <= showNarrative ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {para && (
                <p className="text-gray-700 leading-relaxed">{para}</p>
              )}
            </div>
          ))}
        </div>
        {showNarrative < scene.narrative.length - 1 && (
          <button onClick={() => setShowNarrative(prev => prev + 1)}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm">
            Читать далее →
          </button>
        )}
        {showNarrative >= scene.narrative.length - 1 && !scene.miniGameId && !scene.checkpointId && (
          <button onClick={handleNext}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">
            {scene.id === 'final_report' ? '🏆 Завершить' : 'Далее →'}
          </button>
        )}
      </div>

      {/* Mini-game */}
      {scene.miniGameId && showNarrative >= scene.narrative.length - 1 && (
        <div>
          <MiniGameRenderer gameId={scene.miniGameId} onComplete={handleMiniGameComplete(scene.miniGameId!)} onPlanUpdate={onUpdateGanttPlan} />
          {miniGameCompleted && (
            <div className="mt-4 flex justify-end">
              <button onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold">
                Далее →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Checkpoint evaluation */}
      {scene.checkpointId && showNarrative >= scene.narrative.length - 1 && (
        <div>
          {!checkpointEvaluated ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
              <h3 className="font-bold text-red-800 mb-4">Оценивание чек-поинта</h3>
              <CheckpointSummary gameState={gameState} cpId={scene.checkpointId} />
              <button onClick={() => handleCheckpointEvaluate(scene.checkpointId!)}
                className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold">
                ⚡ Оценить
              </button>
            </div>
          ) : (
            <CheckpointResultView gameState={gameState} cpId={scene.checkpointId} onNext={handleNext} />
          )}
        </div>
      )}

      {/* Final report */}
      {scene.id === 'final_report' && showNarrative >= scene.narrative.length - 1 && (
        <FinalReport gameState={gameState} />
      )}
    </div>
  );
}

// ==================== MINI GAME RENDERER ====================
function MiniGameRenderer({ gameId, onComplete, onPlanUpdate }: { gameId: string; onComplete: (s: number, m: number, a: string[]) => void; onPlanUpdate: (p: any) => void }) {
  switch (gameId) {
    case 'project_vs_referat': return <ProjectVsReferatGame onComplete={onComplete} />;
    case 'structure_assembly': return <StructureAssemblyGame onComplete={onComplete} />;
    case 'idea_filter': return <IdeaFilterGame onComplete={onComplete} />;
    case 'passport_draft': return <PassportDraftGame onComplete={onComplete} />;
    case 'readiness_checklist': return <ReadinessChecklistGame onComplete={onComplete} />;
    case 'smart_constructor': return <SmartConstructorGame onComplete={onComplete} />;
    case 'task_tree': return <TaskTreeGame onComplete={onComplete} />;
    case 'object_subject_hypothesis': return <ObjectSubjectHypothesisGame onComplete={onComplete} />;
    case 'relevance_text': return <RelevanceTextGame onComplete={onComplete} />;
    case 'defense_presentation': return <DefensePresentationGame onComplete={onComplete} />;
    case 'gantt_builder': return <GanttBuilderGame onComplete={onComplete} onPlanUpdate={onPlanUpdate} />;
    case 'find_errors': return <FindErrorsGame onComplete={onComplete} />;
    default: return <div className="p-4 bg-red-50 rounded-lg">Мини-игра "{gameId}" не найдена</div>;
  }
}

// ==================== CHECKPOINT SUMMARY ====================
function CheckpointSummary({ gameState, cpId }: { gameState: any; cpId: string }) {
  const criteria = checkpointCriteria[cpId as keyof typeof checkpointCriteria];
  if (!criteria) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">Критерии оценивания:</p>
      {criteria.criteria.map(crit => (
        <div key={crit.id} className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium text-sm">{crit.name}</span>
            <span className="text-xs text-gray-500">{crit.maxScore} балл(а)</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{crit.descriptor}</p>
        </div>
      ))}
      <p className="text-xs text-gray-400">Проходной балл: {criteria.passScore} из {criteria.maxScore}</p>
    </div>
  );
}

// ==================== CHECKPOINT RESULT ====================
function CheckpointResultView({ gameState, cpId, onNext }: { gameState: any; cpId: string; onNext: () => void }) {
  const result = gameState.checkpointResults.find((r: any) => r.checkpointId === cpId);
  const criteria = checkpointCriteria[cpId as keyof typeof checkpointCriteria];
  if (!result || !criteria) return null;

  const isAccepted = result.decision === 'accepted';

  return (
    <div className={`rounded-xl shadow-lg p-6 border-2 ${isAccepted ? 'bg-green-50 border-green-300' : 'bg-orange-50 border-orange-300'}`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{isAccepted ? '✅' : '🔄'}</span>
        <div>
          <h3 className={`font-bold text-lg ${isAccepted ? 'text-green-800' : 'text-orange-800'}`}>
            {isAccepted ? 'ПРИНЯТО' : 'ВЕРНУТЬ НА ДОРАБОТКУ'}
          </h3>
          <p className="text-sm text-gray-600">{criteria.title}: {result.score}/{result.maxScore} баллов</p>
        </div>
      </div>

      {result.reasons.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700">Что хорошо:</p>
          <ul className="text-sm text-green-700 list-disc ml-4">
            {result.reasons.map((r: string, i: number) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700">Что улучшить:</p>
          <ul className="text-sm text-orange-700 list-disc ml-4">
            {result.recommendations.map((r: string, i: number) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-4 p-3 bg-white/50 rounded-lg">
        <p className="text-xs text-gray-600">
          {isAccepted
            ? '🎉 Отличная работа! Переходим к следующему блоку.'
            : '💪 Не расстраивайся! Доработка — нормальная часть проектной работы. Исправь замечания и двигайся дальше.'}
        </p>
      </div>

      <button onClick={onNext}
        className={`mt-4 px-6 py-3 text-white rounded-lg font-bold ${isAccepted ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
        {isAccepted ? 'К следующему блоку →' : 'Продолжить (с доработкой) →'}
      </button>
    </div>
  );
}

// ==================== FINAL REPORT ====================
function FinalReport({ gameState }: { gameState: any }) {
  const cp1 = gameState.checkpointResults.find((r: any) => r.checkpointId === 'cp1');
  const cp2 = gameState.checkpointResults.find((r: any) => r.checkpointId === 'cp2');
  const cp3 = gameState.checkpointResults.find((r: any) => r.checkpointId === 'cp3');

  const total = gameState.totalScore;
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (cp1 && cp1.score >= 5) strengths.push('Уверенная инициация проекта');
  else if (cp1 && cp1.score < 4) gaps.push('Инициация проекта требует доработки');

  if (cp2 && cp2.score >= 6) strengths.push('Сильное целеполагание и научный аппарат');
  else if (cp2 && cp2.score < 5) gaps.push('Целеполагание и научный аппарат нуждаются в уточнении');

  if (cp3 && cp3.score >= 2) strengths.push('Грамотный план-график');
  else if (cp3 && cp3.score < 1) gaps.push('План-график требует пересмотра');

  if (gameState.miniGameResults.some((r: any) => r.gameId === 'idea_filter' && r.score >= 5)) strengths.push('Хорошее понимание жизнеспособности идей');
  if (gameState.miniGameResults.some((r: any) => r.gameId === 'smart_constructor' && r.score >= 1)) strengths.push('Понимание SMART-целеполагания');
  if (gameState.miniGameResults.some((r: any) => r.gameId === 'find_errors' && r.score >= 5)) strengths.push('Умение видеть ошибки в планировании');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
      <h3 className="text-2xl font-bold text-indigo-800 mb-4">🏆 Итоговая карточка</h3>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">{cp1?.score || 0}</div>
          <div className="text-xs text-gray-500">КП1 из 6</div>
          <div className={`text-xs mt-1 ${cp1?.decision === 'accepted' ? 'text-green-600' : 'text-orange-600'}`}>
            {cp1?.decision === 'accepted' ? '✓ принято' : cp1 ? '↻ доработка' : '—'}
          </div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">{cp2?.score || 0}</div>
          <div className="text-xs text-gray-500">КП2 из 7</div>
          <div className={`text-xs mt-1 ${cp2?.decision === 'accepted' ? 'text-green-600' : 'text-orange-600'}`}>
            {cp2?.decision === 'accepted' ? '✓ принято' : cp2 ? '↻ доработка' : '—'}
          </div>
        </div>
        <div className="text-center p-4 bg-cyan-50 rounded-lg">
          <div className="text-3xl font-bold text-cyan-600">{cp3?.score || 0}</div>
          <div className="text-xs text-gray-500">План из 2</div>
          <div className={`text-xs mt-1 ${cp3?.decision === 'accepted' ? 'text-green-600' : 'text-orange-600'}`}>
            {cp3?.decision === 'accepted' ? '✓ принято' : cp3 ? '↻ доработка' : '—'}
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-indigo-600">{total}</div>
        <div className="text-gray-500">из 15 баллов</div>
        <div className="mt-2 text-sm">
          {total >= 13 ? '🌟 Превосходно!' : total >= 10 ? '⭐ Хорошо!' : total >= 7 ? '👍 Удовлетворительно' : '💪 Нужно подтянуть'}
        </div>
      </div>

      {strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-green-700 text-sm">✅ Сильные стороны:</h4>
          <ul className="text-sm text-green-600 list-disc ml-4 mt-1">
            {strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {gaps.length > 0 && (
        <div className="mb-4">
          <h4 className="font-bold text-orange-700 text-sm">⚠ Пробелы:</h4>
          <ul className="text-sm text-orange-600 list-disc ml-4 mt-1">
            {gaps.map((g, i) => <li key={i}>{g}</li>)}
          </ul>
        </div>
      )}

      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <p className="text-sm text-indigo-800">
          <strong>📌 Рекомендация:</strong> Впереди раздел 3.2 — работа с источниками. 
          Напоминаем: <strong>КП3 целиком сдаётся на уроке 12</strong> — источники и аннотации. 
          Начни собирать литературу уже сейчас!
        </p>
      </div>
    </div>
  );
}
