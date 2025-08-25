import { LetterPositionFrequency, Position } from '../types/analysis.model';
import { WordScore } from '../types/word.model';
import { hasDuplicateLetters } from '../util/duplicate-letters.helper';

export function performPositionFrequencyAnalysis(
  words: string[]
): LetterPositionFrequency[] {
  const positionMap = new Map<string, Map<Position, number>>();

  words.forEach((word) => {
    word.split('').forEach((letter, index) => {
      const letterPositionMap = positionMap.get(letter);

      if (letterPositionMap) {
        const positionKey = Position[Position[index] as keyof typeof Position];
        const frequencyCount = letterPositionMap.get(positionKey)!;

        letterPositionMap.set(positionKey, frequencyCount + 1);
      } else {
        positionMap.set(
          letter,
          new Map([
            [Position.ONE, 0],
            [Position.TWO, 0],
            [Position.THREE, 0],
            [Position.FOUR, 0],
            [Position.FIVE, 0],
          ])
        );
      }
    });
  });

  // convert to a useable data structure
  const positions = Array.from(positionMap).map(
    (positions) =>
      ({
        letter: positions[0],
        frequencies: Array.from(positions[1]).map((position) => ({
          position: position[0],
          frequency: position[1],
        })),
      } as LetterPositionFrequency)
  );

  return positions;
}

export function mapWordsWithFrequencyScores(
  words: string[],
  frequencyAnalysis: LetterPositionFrequency[]
): WordScore[] {
  const baseWeight = 0.2;
  const filteredWeight = 0.8;

  // compute base frequency analysis for all words
  const baseFrequencyAnalysis = performPositionFrequencyAnalysis(words);

  return words.map((word) => {
    const scoreFiltered = analyseWordUsingFrequencyAnalysis(
      word,
      frequencyAnalysis
    );
    const scoreBase = analyseWordUsingFrequencyAnalysis(
      word,
      baseFrequencyAnalysis
    );

    const adjustedScore = adjustWordScore(word, scoreFiltered);

    const combinedScore =
      scoreBase * baseWeight + adjustedScore * filteredWeight;

    return { word, score: combinedScore };
  });
}

function adjustWordScore(word: string, score: number): number {
  if (word.endsWith('s')) {
    score *= 0.7; // 30%
  }

  if (word.endsWith('y')) {
    score *= 0.8; // 15%
  }

  const { hasDuplicates, count } = hasDuplicateLetters(word);
  if (hasDuplicates) {
    score *= 0.6 / count; // significantly reduce the score
  }

  return score;
}

function analyseWordUsingFrequencyAnalysis(
  word: string,
  frequencyAnalysis: LetterPositionFrequency[]
) {
  return word
    .split('')
    .flatMap(
      (letter, index) =>
        frequencyAnalysis.find(
          (letterAnalysis) => letterAnalysis.letter === letter
        )!.frequencies[index].frequency
    )
    .reduce((acc, val) => acc + val, 0);
}
