import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ArticleBody } from "@/components/ArticleBody";
import { BackLink } from "@/components/common/BackLink";
import { NewsByline } from "@/components/news/NewsByline";
import { RelatedNews } from "@/components/news/RelatedNews";
import { getNewsArticle, getNewsSlugs, getRelatedNews } from "@/lib/cms/news";
import { site } from "@/mocks";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getNewsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) return { title: "Article not found" };

  const canonical = `/news/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    keywords: [...article.tags, "World Cup 2026", "news"],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: canonical,
      siteName: site.name,
      publishedTime: article.publishedAt || undefined,
      authors: [article.author],
      images: article.coverUrl ? [{ url: article.coverUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverUrl ? [article.coverUrl] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  const related = await getRelatedNews(article.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt || undefined,
    author: { "@type": "Organization", name: article.author },
    articleSection: article.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-8 sm:py-10">
        <BackLink href="/news" labelKey="news.allNews" />

        <article className="mx-auto max-w-3xl">
          {article.coverUrl && (
            <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
              <Image
                src={article.coverUrl}
                alt={article.coverAlt ?? ""}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}
          <header className="mb-6">
            <span className="mb-3 inline-block rounded-full bg-pitch-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pitch">
              {article.category}
            </span>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {article.title}
            </h1>
            <NewsByline author={article.author} dateISO={article.publishedAt} />
            <p className="mt-4 text-lg text-muted">{article.excerpt}</p>
          </header>

          <div className="card p-5 sm:p-8">
            <ArticleBody body={article.body} />
          </div>
        </article>

        <RelatedNews articles={related} />
      </Container>
    </>
  );
}
