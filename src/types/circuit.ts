export type CircuitType = 'series' | 'parallel' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Resistor {
  id: string;
  value: number; // in Ohm
  label: string; // z.B. "R₁", "R₂"
}

export interface VoltageSource {
  value: number; // in Volt
}

// Einfaches, strukturiertes Format für die Schaltungsvisualisierung
// Die Schaltung wird als Sequenz von Elementen dargestellt, die in Reihe geschaltet sind
// Jedes Element kann entweder ein einzelner Widerstand oder eine Parallelschaltung sein
export type CircuitElement =
  | { type: 'resistor'; resistorId: string }
  | { type: 'parallel'; resistorIds: string[] };

export interface CircuitData {
  type: CircuitType;
  voltage: VoltageSource;
  resistors: Resistor[];
  // Strukturierte Darstellung für Visualisierung
  // Array von Elementen, die in REIHE geschaltet sind
  // Jedes Element ist entweder ein Widerstand oder eine Parallelschaltung
  layout?: CircuitElement[];
  // Lesbare Beschreibung
  description?: string;
}

export interface Exercise {
  id: string;
  circuitType: CircuitType;
  difficulty: Difficulty;
  circuit: CircuitData;
  question: string;
  requiredAnswers: RequiredAnswer[];
}

export interface RequiredAnswer {
  id: string;
  label: string;
  unit: string;
  correctValue: number;
  tolerance: number;
}

export interface UserAnswer {
  answerId: string;
  value: number | null;
}

export interface CheckResult {
  isCorrect: boolean;
  answers: AnswerResult[];
  explanation?: string;
}

export interface AnswerResult {
  answerId: string;
  label: string;
  userValue: number | null;
  correctValue: number;
  unit: string;
  isCorrect: boolean;
}

export interface AIResponse {
  exercise?: Exercise;
  checkResult?: CheckResult;
  error?: string;
}
