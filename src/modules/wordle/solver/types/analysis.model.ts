export interface LetterPositionFrequency {
  letter: string;
  frequencies: {
    position: Position;
    frequency: number;
  }[];
}

export interface LetterPositionFrequencyMap {
  letter: string;
  frequencies: Map<Position, number>;
}

export enum Position {
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
}
