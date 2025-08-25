import axios from 'axios';
import { from, map, Observable } from 'rxjs';
import { parseFeedback, playWordleGame } from './game/game.service';
import { WordleFeedback } from './game/types/game.types';
import { evaluateBestWordMatches } from './solver';
import {
  WordleIterationResult,
  WordleResponse,
  WordleResult,
} from './wordle.types';

export const wordleService = {
  getTodaysWordle: (): Observable<WordleResponse> => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return from(
      axios.request<WordleResponse>({
        method: 'GET',
        url: `https://www.nytimes.com/svc/wordle/v2/${year}-${month}-${day}.json`,
      })
    ).pipe(map((response) => response.data));
  },

  checkGuessAgainstSolution: (
    guess: string,
    solution: string
  ): WordleFeedback => {
    return parseFeedback(guess, playWordleGame(guess, solution));
  },

  playWordle: (solution: string): WordleResult => {
    let solved = false;
    let attempts = 0;
    let startingWord = '';

    const excludedLetters: string[] = []; // array of letters not in puzzle
    const feedback: string[] = [];

    let incorrectLetters: string[][] = []; // 2d array of letters that are in the puzzle, but incorrect spot
    let correctLetters: string[][] = []; // 2d array of letters in the correct position

    // bot has 6 tries to guess the word
    for (let iterations = 1; iterations < 7; iterations++) {
      const { words } = evaluateBestWordMatches(
        excludedLetters,
        incorrectLetters,
        correctLetters
      );

      let guess = words[0];
      if (iterations === 1) {
        // use a random word for the first guess
        const randomStartingWord =
          words[Math.floor(Math.random() * words.length)];
        guess = randomStartingWord;
        startingWord = randomStartingWord;
      }

      const {
        newCorrectLetters,
        newExcludedLetters,
        newIncorrectLetters,
        prettyFeedback,
      } = wordleService.checkGuessAgainstSolution(guess, solution);

      feedback.push(prettyFeedback);
      excludedLetters.push(...newExcludedLetters);

      incorrectLetters = newIncorrectLetters;
      correctLetters = newCorrectLetters;

      if (guess === solution) {
        solved = true;
        break;
      } else {
        attempts = iterations;
      }
    }

    return {
      solved,
      attempts,
      feedback,
      startingWord,
    };
  },

  runWordleIterations: (solution: string): WordleIterationResult => {
    const iterations = 100;

    const iterationFeedbacks: string[][] = [];
    const iterationStartingWords: string[] = [];
    const iterationSolvedResults: boolean[] = [];
    const iterationAttemptsResults: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const { solved, attempts, feedback, startingWord } =
        wordleService.playWordle(solution);

      iterationSolvedResults.push(solved);
      iterationAttemptsResults.push(attempts);
      iterationStartingWords.push(startingWord);
      iterationFeedbacks.push(feedback);
    }

    return {
      iterations,
      data: {
        feedback: iterationFeedbacks,
        solves: iterationSolvedResults,
        attempts: iterationAttemptsResults,
        startingWords: iterationStartingWords,
      },
    };
  },

  attemptsToJoke: (attempts: number): string => {
    if (attempts <= 2) {
      return 'Easy Peasy';
    } else if (attempts <= 3.8) {
      return 'Some Effort Required';
    } else if (attempts <= 4.6) {
      return 'Pretty Hard';
    } else if (attempts <= 5.2) {
      return 'Extremely Challenging';
    } else {
      return "Don't Even Try (bot sucks LMFAO)";
    }
  },
};
