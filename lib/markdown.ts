export interface ArticleBlock {
  type: "h2" | "p";
  text: string;
}

/**
 * Minimal, safe markdown-ish parser: blank-line paragraphs and `## ` headings.
 * Content is rendered as plain text (no HTML injection) since it may come from
 * the untrusted Google Sheet.
 */
export function parseArticleBody(body: string): ArticleBlock[] {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map<ArticleBlock>((chunk) =>
      chunk.startsWith("## ")
        ? { type: "h2", text: chunk.slice(3).trim() }
        : { type: "p", text: chunk },
    );
}
