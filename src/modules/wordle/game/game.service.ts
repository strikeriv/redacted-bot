import { WordleFeedback } from './types/game.types';

export function playWordleGame(guess: string, solution: string): string[] {
  return Array.from(guess).map((letter, i) => {
    if (letter === solution[i]) return 'Y'; // correct spot
    if (solution.includes(letter)) return 'N'; // wrong spot
    return 'X'; // not in word
  });
}

export function prettyFeedback(feedback: string[]): string {
  return feedback
    .map((l) => {
      if (l === 'Y') {
        return '🟩';
      } else if (l === 'N') {
        return '🟨';
      } else {
        return '⬜';
      }
    })
    .join('');
}

export function parseFeedback(
  guess: string,
  feedback: string[]
): WordleFeedback {
  const excludedLetters: string[] = [];
  const incorrectLetters: string[][] = [];
  const correctLetters: string[][] = [];

  const guessLetters = guess.split('');

  feedback.forEach((tile, index) => {
    switch (tile) {
      case 'Y':
        correctLetters[index] = [guessLetters[index]];
        break;
      case 'N':
        incorrectLetters[index] = [guessLetters[index]];
        break;
      default:
        excludedLetters.push(guessLetters[index]);
        break;
    }
  });

  return {
    prettyFeedback: prettyFeedback(feedback),
    newExcludedLetters: excludedLetters,
    newIncorrectLetters: incorrectLetters,
    newCorrectLetters: correctLetters,
  };
}
