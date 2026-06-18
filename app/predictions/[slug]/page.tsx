import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BackLink } from "@/components/common/BackLink";
import { MatchHeader } from "@/components/prediction/MatchHeader";
import { MatchTime } from "@/components/prediction/MatchTime";
import { MatchStatistics } from "@/components/prediction/MatchStatistics";
import { RecentForm } from "@/components/prediction/RecentForm";
import { HeadToHead } from "@/components/prediction/HeadToHead";
import { PredictionSummary } from "@/components/prediction/PredictionSummary";
import { ArticleContent } from "@/components/prediction/ArticleContent";
import { RelatedArticles } from "@/components/prediction/RelatedArticles";
import { CTABanner } from "@/components/sections/CTABanner";
import { InArticleCTA } from "@/components/conversion/InArticleCTA";
import { SidebarVIPTips } from "@/components/conversion/SidebarVIPTips";
import {
  getPredictionArticle,
  getPredictionSlugs,
  getRelatedArticles,
} from "@/lib/cms/articles";
import { getCta, getVipTips } from "@/lib/cms/cta";
import { site } from "@/mocks";

type PageProps = { params: Promise<{ slug: string }> };

/** Pre-render every known prediction slug; new sheet rows render on demand (ISR). */
export async function generateStaticParams() {
  const slugs = await getPredictionSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** SEO metadata generated automatically from the article data. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPredictionArticle(slug);
  if (!article) return { title: "Prediction not found" };

  const canonical = `/predictions/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    keywords: [
      article.home.name,
      article.away.name,
      `${article.home.name} vs ${article.away.name}`,
      "prediction",
      "World Cup 2026",
      article.group,
    ],
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: canonical,
      siteName: site.name,
      publishedTime: article.publishedAt || undefined,
      authors: [article.author],
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function PredictionPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getPredictionArticle(slug);
  if (!article) notFound();

  const [related, inArticleCta, sidebarCta, vipTips] = await Promise.all([
    getRelatedArticles(article.slug, article.related),
    getCta("in_article"),
    getCta("sidebar"),
    getVipTips(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${article.home.name} vs ${article.away.name}`,
    sport: "Soccer",
    startDate: article.kickoffISO,
    eventStatus: "https://schema.org/EventScheduled",
    location: article.venue
      ? { "@type": "Place", name: article.venue }
      : undefined,
    competitor: [
      { "@type": "SportsTeam", name: article.home.name },
      { "@type": "SportsTeam", name: article.away.name },
    ],
    subjectOf: {
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      author: { "@type": "Organization", name: article.author },
      datePublished: article.publishedAt || undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Container className="py-8 sm:py-10">
        <BackLink href="/#predictions" labelKey="prediction.allPredictions" />

        <h1 className="sr-only">{article.title}</h1>

        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-8">
          {/* Main content */}
          <div className="space-y-10 sm:space-y-12">
            <MatchHeader article={article} />
            <MatchTime article={article} />
            <PredictionSummary article={article} />
            <MatchStatistics article={article} />
            <RecentForm article={article} />
            <HeadToHead article={article} />
            <ArticleContent article={article} />
            {inArticleCta && <InArticleCTA cta={inArticleCta} />}
            <RelatedArticles articles={related} />
          </div>

          {/* Sidebar */}
          <aside className="mt-10 lg:mt-0 lg:sticky lg:top-24">
            {sidebarCta && <SidebarVIPTips cta={sidebarCta} tips={vipTips} />}
          </aside>
        </div>
      </Container>

      <CTABanner />
    </>
  );
}
