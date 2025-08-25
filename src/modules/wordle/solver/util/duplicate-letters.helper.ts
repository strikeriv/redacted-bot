import { DuplicateCheck } from '../types/word.model';

export function hasDuplicateLetters(word: string): DuplicateCheck {
  const counts: Record<string, number> = {};

  for (const letter of word) {
    counts[letter] = (counts[letter] || 0) + 1;
  }

  // we do this to catch words like onion
  const repeatedLetters = Object.values(counts).filter((v) => v > 1);
  return {
    hasDuplicates: repeatedLetters.length > 0,
    count: repeatedLetters.length,
  };
}
