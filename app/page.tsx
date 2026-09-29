import { Shell } from "@/components/shell";
import { Home } from "@/components/home";
import news from "@/lib/news.json";
export default function Page() {
  return (
    <Shell>
      <Home
        news={news
          .filter(
            (n) =>
              /conference|short.term|reporting dates/i.test(n.title) &&
              n.title.length < 200,
          )
          .slice(0, 3)}
      />
    </Shell>
  );
}
