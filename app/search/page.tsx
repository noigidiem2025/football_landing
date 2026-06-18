import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchView, type SearchItem } from "@/components/search/SearchView";
import { getAllNews } from "@/lib/cms/news";
import { getAllPredictionArticles } from "@/lib/cms/articles";
import { buildFixtures } from "@/mocks/fixtures";

export const metadata: Metadata = {
  title: "Search",
  description: "Search World Cup 2026 news, predictions and fixtures.",
  alternates: { canonical: "/search" },
  robots: { index: false },
};

export const revalidate = 600;

export default async function SearchPage() {
  const [news, predictions] = await Promise.all([
    getAllNews(),
    getAllPredictionArticles(),
  ]);
  const fixtures = buildFixtures(new Date());

  const items: SearchItem[] = [
    ...news.map((a) => ({
      title: a.title,
      href: `/news/${a.slug}`,
      type: "News",
      meta: a.category,
    })),
    ...predictions.map((p) => ({
      title: p.title,
      href: `/predictions/${p.slug}`,
      type: "Prediction",
      meta: p.group,
    })),
    ...fixtures.map((f) => ({
      title: `${f.home.name} vs ${f.away.name}`,
      href: "/fixtures",
      type: "Fixture",
      meta: `${f.league} · ${f.venue}`,
    })),
  ];

  return (
    <Container className="py-8 sm:py-12">
      <PageHeader titleKey="page.search.title" />
      <SearchView items={items} />
    </Container>
  );
}
