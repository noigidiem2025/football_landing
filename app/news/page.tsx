import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { UpdatingNotice } from "@/components/common/UpdatingNotice";
import { NewsCard } from "@/components/news/NewsCard";
import { getAllNews } from "@/lib/cms/news";

export const metadata: Metadata = {
  title: "News",
  description:
    "World Cup 2026 news, match reports, features and analysis — the latest stories from the tournament.",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "News | WORLD CUP 2026",
    description: "Match reports, features and analysis from World Cup 2026.",
    type: "website",
  },
};

export const revalidate = 600;

export default async function NewsPage() {
  const articles = await getAllNews();

  return (
    <Container className="py-8 sm:py-12">
      <PageHeader
        eyebrowKey="page.news.eyebrow"
        titleKey="page.news.title"
        descKey="page.news.desc"
      />

      {articles.length === 0 ? (
        <UpdatingNotice />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </Container>
  );
}
