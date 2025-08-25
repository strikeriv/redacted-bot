import generateLetterRegexMatch from '../util/generate-regex.helper';

export function filterValidWords(
  disalowedLetters: Set<string>,
  requiredLetters: Set<string>
): (word: string) => boolean {
  // need to remove conflicts

  const cleanedDisallowed = [...disalowedLetters].filter(
    (l) => !requiredLetters.has(l)
  );

  const disalowedPattern =
    cleanedDisallowed.length > 0
      ? generateLetterRegexMatch(cleanedDisallowed)
      : null;

  const requiredPattern =
    requiredLetters.size > 0
      ? generateLetterRegexMatch([...requiredLetters], true)
      : null;

  const conflictLetters = [...disalowedLetters].filter((l) =>
    requiredLetters.has(l)
  );

  return (word: string) => {
    const disallowedPass = disalowedPattern
      ? !disalowedPattern.test(word)
      : true;
    const requiredPass = requiredPattern ? requiredPattern.test(word) : true;
    const conflictPass = !conflictLetters.some(
      (l) => word.split(l).length - 1 > 1
    );

    return disallowedPass && requiredPass && conflictPass;
  };
}
