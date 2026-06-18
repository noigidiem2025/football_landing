import { parseArticleBody } from "@/lib/markdown";

/** Renders long-form article body text. Safe (plain text, no HTML injection). */
export function ArticleBody({ body }: { body: string }) {
  const blocks = parseArticleBody(body);
  if (blocks.length === 0) return null;

  return (
    <div className="space-y-5">
      {blocks.map((block, i) =>
        block.type === "h2" ? (
          <h2
            key={i}
            className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl"
          >
            {block.text}
          </h2>
        ) : (
          <p key={i} className="text-[15px] leading-relaxed text-foreground/85">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}
