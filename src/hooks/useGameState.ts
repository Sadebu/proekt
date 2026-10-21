import { useState, useEffect, useCallback } from 'react';
import { GameState, PlayerProfile, MiniGameResult, CheckpointResult, SceneAnswer, GanttTask } from '../types';

const STORAGE_KEY = 'project_quest_save';
const TEACHER_KEY = 'project_quest_teacher_data';

const defaultProjectData = {
  ideas: [],
  selectedIdea: '',
  consultant: '',
  theme: '',
  problem: '',
  goal: '',
  tasks: [],
  object: '',
  subject: '',
  hypothesis: '',
  relevance: '',
  ganttPlan: [],
};

const defaultGameState: GameState = {
  profile: null,
  currentScene: 'intro',
  completedScenes: [],
  miniGameResults: [],
  checkpointResults: [],
  sceneAnswers: [],
  projectData: { ...defaultProjectData },
  totalScore: 0,
  completed: false,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load save:', e);
    }
    return { ...defaultGameState };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save:', e);
    }
  }, [gameState]);

  const startGame = useCallback((name: string, className?: string) => {
    const profile: PlayerProfile = {
      name,
      className: className || undefined,
      startedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
    };
    setGameState({
      ...defaultGameState,
      profile,
      currentScene: 'intro',
    });
  }, []);

  const continueGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, lastPlayedAt: new Date().toISOString() } : prev.profile,
    }));
  }, []);

  const completeScene = useCallback((sceneId: string) => {
    setGameState(prev => ({
      ...prev,
      completedScenes: prev.completedScenes.includes(sceneId)
        ? prev.completedScenes
        : [...prev.completedScenes, sceneId],
    }));
  }, []);

  const goToScene = useCallback((sceneId: string) => {
    setGameState(prev => ({
      ...prev,
      currentScene: sceneId,
      profile: prev.profile ? { ...prev.profile, lastPlayedAt: new Date().toISOString() } : prev.profile,
    }));
  }, []);

  const addMiniGameResult = useCallback((result: MiniGameResult) => {
    setGameState(prev => {
      const existing = prev.miniGameResults.findIndex(r => r.gameId === result.gameId);
      const newResults = existing >= 0
        ? prev.miniGameResults.map((r, i) => i === existing ? result : r)
        : [...prev.miniGameResults, result];
      const totalScore = calculateTotalScore(newResults, prev.checkpointResults);
      return { ...prev, miniGameResults: newResults, totalScore };
    });
  }, []);

  const addCheckpointResult = useCallback((result: CheckpointResult) => {
    setGameState(prev => {
      const existing = prev.checkpointResults.findIndex(r => r.checkpointId === result.checkpointId);
      const newResults = existing >= 0
        ? prev.checkpointResults.map((r, i) => i === existing ? result : r)
        : [...prev.checkpointResults, result];
      const totalScore = calculateTotalScore(prev.miniGameResults, newResults);
      return { ...prev, checkpointResults: newResults, totalScore };
    });
  }, []);

  const addSceneAnswer = useCallback((answer: SceneAnswer) => {
    setGameState(prev => ({
      ...prev,
      sceneAnswers: [...prev.sceneAnswers, answer],
    }));
  }, []);

  const updateProjectData = useCallback((data: Partial<GameState['projectData']>) => {
    setGameState(prev => ({
      ...prev,
      projectData: { ...prev.projectData, ...data },
    }));
  }, []);

  const updateGanttPlan = useCallback((plan: GanttTask[]) => {
    setGameState(prev => ({
      ...prev,
      projectData: { ...prev.projectData, ganttPlan: plan },
    }));
  }, []);

  const completeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, completed: true }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({ ...defaultGameState });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasSave = useCallback(() => {
    return gameState.profile !== null;
  }, [gameState.profile]);

  // Save to teacher data
  useEffect(() => {
    if (gameState.profile) {
      try {
        const teacherDataStr = localStorage.getItem(TEACHER_KEY);
        const teacherData = teacherDataStr ? JSON.parse(teacherDataStr) : {};
        teacherData[gameState.profile.name] = {
          profile: gameState.profile,
          gameState,
        };
        localStorage.setItem(TEACHER_KEY, JSON.stringify(teacherData));
      } catch (e) {
        console.error('Failed to save teacher data:', e);
      }
    }
  }, [gameState]);

  return {
    gameState,
    startGame,
    continueGame,
    completeScene,
    goToScene,
    addMiniGameResult,
    addCheckpointResult,
    addSceneAnswer,
    updateProjectData,
    updateGanttPlan,
    completeGame,
    resetGame,
    hasSave,
  };
}

function calculateTotalScore(miniGames: MiniGameResult[], checkpoints: CheckpointResult[]): number {
  let total = 0;
  for (const cp of checkpoints) {
    total += cp.score;
  }
  return Math.min(total, 15);
}

export function getTeacherData(): Record<string, { profile: PlayerProfile; gameState: GameState }> {
  try {
    const data = localStorage.getItem(TEACHER_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function clearTeacherData(): void {
  localStorage.removeItem(TEACHER_KEY);
}
