export function extractHtmlFromText(text: string): string | null {
  // Match complete ```html ... ``` blocks
  const completeRegex = /```html\s*\n([\s\S]*?)```/g;
  const matches: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = completeRegex.exec(text)) !== null) {
    matches.push(match[1].trim());
  }

  if (matches.length > 0) {
    return matches[matches.length - 1];
  }

  // Fallback: unclosed code block (streaming in progress)
  const unclosedRegex = /```html\s*\n([\s\S]*)$/;
  const unclosedMatch = text.match(unclosedRegex);
  if (unclosedMatch && unclosedMatch[1].trim().length > 50) {
    return autoCloseHtml(unclosedMatch[1].trim());
  }

  return null;
}

/**
 * Attempt to auto-close truncated HTML by balancing open tags.
 * This makes partially-generated HTML renderable during streaming.
 */
function autoCloseHtml(html: string): string {
  // Match opening tags (excluding self-closing and void elements)
  const voidElements = new Set([
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr", "!doctype",
  ]);

  const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*\/?>/g;
  const stack: string[] = [];
  let tagMatch: RegExpExecArray | null;

  while ((tagMatch = tagRegex.exec(html)) !== null) {
    const fullTag = tagMatch[0];
    const tagName = tagMatch[1].toLowerCase();

    if (voidElements.has(tagName)) continue;
    if (fullTag.endsWith("/>")) continue; // self-closing

    if (fullTag.startsWith("</")) {
      // Closing tag - pop from stack
      if (stack.length > 0 && stack[stack.length - 1] === tagName) {
        stack.pop();
      }
    } else {
      // Opening tag - push to stack
      stack.push(tagName);
    }
  }

  // Close unclosed tags in reverse order
  const closingTags = stack.reverse().map((tag) => `</${tag}>`).join("");
  return html + closingTags;
}
