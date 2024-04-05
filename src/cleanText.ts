export function cleanText(inputText: string): string {
  // This regular expression matches multiple spaces, tabs, and line breaks
  // and replaces them with a single space
  return inputText.replace(/\s+/g, " ").trim();
}
