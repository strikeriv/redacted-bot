export interface Word {
  word: string;
}

export interface WordScore {
  word: string;
  score: number;
}

export interface DuplicateCheck {
  hasDuplicates: boolean;
  count: number; // # of duplicate letters (onion) = 2, (union) = 1
}

export interface WordMatches {
  words: string[];
  scores: WordScore[];
}
