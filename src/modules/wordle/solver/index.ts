import {
  mapWordsWithFrequencyScores,
  performPositionFrequencyAnalysis,
} from './analysis/position.analysis';
import {
  filterWordsByIncorrectPositions,
  filterWordsByRequiredPositions,
} from './filters/positions.filter';
import { filterValidWords } from './filters/valid-words.filter';
import { words } from './static/words.data';
import { WordMatches } from './types/word.model';

export function evaluateBestWordMatches(
  excludedLetters: string[],
  incorrectLetters: string[][],
  correctLetters: string[][]
): WordMatches {
  // build the sets
  const disalowedLetters = new Set(excludedLetters);
  const requiredLetters = new Set([
    ...correctLetters.flat(),
    ...incorrectLetters.flat(),
  ]);

  let filteredWords = words
    .filter(filterValidWords(disalowedLetters, requiredLetters))
    .filter(filterWordsByRequiredPositions(correctLetters))
    .filter(filterWordsByIncorrectPositions(incorrectLetters));

  const frequencyAnalysis = performPositionFrequencyAnalysis(filteredWords);
  const wordScores = mapWordsWithFrequencyScores(
    filteredWords,
    frequencyAnalysis
  );

  const sortedWords = wordScores
    .sort((a, b) => b.score - a.score)
    .map((score) => score.word);

  return {
    words: sortedWords,
    scores: wordScores,
  };
}
