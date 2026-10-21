export interface PlayerProfile {
  name: string;
  className?: string;
  startedAt: string;
  lastPlayedAt: string;
}

export interface MiniGameResult {
  gameId: string;
  score: number;
  maxScore: number;
  answers: string[];
  completed: boolean;
  timestamp: string;
}

export interface CheckpointResult {
  checkpointId: string;
  score: number;
  maxScore: number;
  decision: 'accepted' | 'revision';
  reasons: string[];
  recommendations: string[];
  timestamp: string;
}

export interface SceneAnswer {
  sceneId: string;
  selectedOption: string;
  explanation: string;
  timestamp: string;
}

export interface GameState {
  profile: PlayerProfile | null;
  currentScene: string;
  completedScenes: string[];
  miniGameResults: MiniGameResult[];
  checkpointResults: CheckpointResult[];
  sceneAnswers: SceneAnswer[];
  // Project data accumulated through the game
  projectData: {
    ideas: { text: string; domain: string }[];
    selectedIdea: string;
    consultant: string;
    theme: string;
    problem: string;
    goal: string;
    tasks: string[];
    object: string;
    subject: string;
    hypothesis: string;
    relevance: string;
    ganttPlan: GanttTask[];
  };
  totalScore: number;
  completed: boolean;
}

export interface GanttTask {
  id: string;
  name: string;
  startWeek: number;
  duration: number;
  isMilestone: boolean;
  dependencies: string[];
  color: string;
}

export interface Scene {
  id: string;
  title: string;
  lessonNumber: number;
  block: number;
  narrative: string[];
  choices?: SceneChoice[];
  miniGameId?: string;
  checkpointId?: string;
  nextScene: string;
}

export interface SceneChoice {
  id: string;
  text: string;
  consequence: string;
  isOptimal: boolean;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  lessonRef: number;
}

export interface TeacherStudentData {
  profile: PlayerProfile;
  gameState: GameState;
}
