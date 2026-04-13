import { LucideIcon } from 'lucide-react';

export enum SubjectType {
  PHYSICS = 'Physics',
  CHEMISTRY = 'Chemistry',
  BIOLOGY = 'Biology',
  MATH = 'Math',
  CS = 'CS',
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ObservationTable {
  columns: string[];
  rows?: number;
}

export interface Assignment {
  id: number;
  question: string;
  marks: number;
}

export interface LabContent {
  aim: string;
  requirements: string[];
  theory: string;
  procedure: string[];
  objectives: string[];
  safety?: string[];
  instructions?: string[];
  result?: string;
  realWorldApplications?: string[];
  vivaQuestions?: VivaQuestion[];
  quizQuestions?: QuizQuestion[];
  observationTable?: ObservationTable;
  assignments?: Assignment[];
  videoId?: string;
}

export type Board = 'Karnataka PUC';
export type Standard = '1st PUC / Class 11' | '2nd PUC / Class 12';

export interface LabExperiment {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: string;
  category: string;
  content?: LabContent;
  boards?: Board[];
  standards?: Standard[];
}

export interface SubjectData {
  id: string;
  name: SubjectType;
  icon: LucideIcon;
  color: string;
  hex: string;
  description: string;
  labs: LabExperiment[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
}

export interface NavItem {
  label: string;
  path: string;
}
