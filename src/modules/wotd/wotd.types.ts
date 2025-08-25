export interface WordOfTheDayResponse {
  word: string;
  note: string;
  definitions: [{ text: string }];
  examples: [{ text: string }];
}
