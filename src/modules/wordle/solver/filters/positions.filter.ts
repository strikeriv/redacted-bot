export function filterWordsByRequiredPositions(
  requiredPositions: string[][]
): (word: string) => boolean {
  return (word: string) =>
    requiredPositions.every((letters, position) => {
      if (letters.length === 0) return true;
      return letters.includes(word[position]);
    });
}

export function filterWordsByIncorrectPositions(
  incorrectPositions: string[][]
): (word: string) => boolean {
  return (word: string) =>
    incorrectPositions.every((letters, position) => {
      if (letters.length === 0) return true;
      return !letters.includes(word[position]);
    });
}
