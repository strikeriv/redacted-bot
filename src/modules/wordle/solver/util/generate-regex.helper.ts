export default function generateLetterRegexMatch(
  letters: string[],
  requireAll = false
) {
  if (letters.length === 0) return /.*/;

  if (requireAll) {
    // lookahead for every letter
    return new RegExp(letters.map((l) => `(?=.*${l})`).join('') + '.*', 'i');
  }

  // any of them
  return new RegExp(`[${letters.join('')}]`, 'i');
}
