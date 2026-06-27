export function extractHtmlFromText(text: string): string | null {
  const completeRegex = /```html\s*\n([\s\S]*?)```/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = completeRegex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }

  if (matches.length > 0) {
    return matches[matches.length - 1];
  }

  const unclosedRegex = /```html\s*\n([\s\S]*)$/;
  const unclosedMatch = text.match(unclosedRegex);
  if (unclosedMatch && unclosedMatch[1].trim().length > 50) {
    return unclosedMatch[1].trim();
  }

  return null;
}
