import { NewsSectionView } from "./NewsSectionView";
import { getLatestNews } from "@/lib/cms/news";

/** Homepage "Latest News" section (server fetch → client view for i18n). */
export async function NewsSection() {
  const articles = await getLatestNews(3);
  return <NewsSectionView articles={articles} />;
}
