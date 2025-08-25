export interface WordleResponse {
  id: number;
  solution: string;
  print_date: string;
  days_since_launch: number;
  editor: string;
}

export interface WordleIterationResult {
  iterations: number;
  data: {
    feedback: string[][];
    solves: boolean[];
    attempts: number[];
    startingWords: string[];
  };
}

export interface WordleResult {
  solved: boolean;
  attempts: number;
  startingWord: string;
  feedback: string[];
}
