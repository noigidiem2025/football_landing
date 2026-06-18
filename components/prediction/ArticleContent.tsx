import type { PredictionArticle } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Block {
  type: "h2" | "p";
  text: string;
}

/**
 * Minimal, safe markdown-ish parser: blank-line paragraphs and `## ` headings.
 * Content from the Google Sheet is untrusted, so it is rendered as plain text
 * (no dangerouslySetInnerHTML).
 */
function parseBody(body: string): Block[] {
  return body
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map<Block>((chunk) =>
      chunk.startsWith("## ")
        ? { type: "h2", text: chunk.slice(3).trim() }
        : { type: "p", text: chunk },
    );
}

export function ArticleContent({ article }: { article: PredictionArticle }) {
  const blocks = parseBody(article.body);
  if (blocks.length === 0) return null;

  return (
    <section id="analysis" aria-labelledby="analysis-heading" className="scroll-mt-24">
      <SectionHeading id="analysis-heading" eyebrow="Full analysis" title="Match Preview" />

      <article className="card p-5 sm:p-8">
        <p className="mb-6 text-[11px] font-semibold uppercase tracking-wider text-muted">
          By {article.author}
          {article.publishedAt ? ` · ${article.publishedAt}` : ""}
        </p>
        <div className="space-y-5">
          {blocks.map((block, i) =>
            block.type === "h2" ? (
              <h3
                key={i}
                className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl"
              >
                {block.text}
              </h3>
            ) : (
              <p key={i} className="text-[15px] leading-relaxed text-foreground/85">
                {block.text}
              </p>
            ),
          )}
        </div>
      </article>
    </section>
  );
}
