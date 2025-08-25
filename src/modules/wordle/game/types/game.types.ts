export interface WordleFeedback {
  prettyFeedback: string;
  newExcludedLetters: string[];
  newIncorrectLetters: string[][];
  newCorrectLetters: string[][];
}
