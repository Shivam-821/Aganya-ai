"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, ExternalLink, Loader2 } from "lucide-react";

interface Article {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
  publishedAt: string;
}

const MOCK_NEWS: Article[] = [
  {
    title: "RBI keeps Repo Rate unchanged at 6.5% for 7th consecutive time",
    description:
      "The Reserve Bank of India's Monetary Policy Committee decided to keep the policy repo rate unchanged at 6.5 per cent.",
    url: "https://economictimes.indiatimes.com/topic/rbi-repo-rate",
    source: { name: "The Economic Times" },
    publishedAt: new Date().toISOString(),
  },
  {
    title: "India's Retail Inflation eases to 4.85% in March",
    description:
      "Consumer Price Index (CPI) based retail inflation in India eased to 4.85 per cent in March 2026.",
    url: "https://www.livemint.com/topic/inflation",
    source: { name: "LiveMint" },
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    title: "Startups in India see 15% growth in Q1 2026",
    description:
      "Indian startup ecosystem continues to show resilience with significant growth in Tier-2 and Tier-3 cities.",
    url: "https://www.financialexpress.com/industry/sme/startup-india",
    source: { name: "Financial Express" },
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    title: "Gold prices hit record high amidst global uncertainty",
    description:
      "Gold prices soared to a new record high on Monday as geopolitical tensions drove demand for safe-haven assets.",
    url: "https://www.business-standard.com/topic/gold-price",
    source: { name: "Business Standard" },
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export default function NewsWidget() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        if (res.ok) {
          const data = await res.json();
          // Map NewsAPI format to our Article interface if needed, or just use directly if matches
          // NewsAPI returns: { source: { name }, title, description, url, publishedAt }
          if (Array.isArray(data) && data.length > 0) {
            setArticles(data.slice(0, 5)); // Limit to 5 items
            setLoading(false);
            return;
          }
        }
        throw new Error("Failed to load live news");
      } catch (err) {
        console.warn("NewsWidget: Falling back to Mock Data", err);
        // Fallback to Mock Data
        setArticles(MOCK_NEWS);
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative h-full flex flex-col"
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-blue-500 z-20"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-blue-500 z-20"></div>

      {/* Diagonal Accent Stripe */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-primary to-transparent"></div>

      <div className="relative bg-gradient-to-br from-background via-background to-blue-500/5 p-6 pt-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-500/30"></span>
            <Newspaper className="w-5 h-5 text-blue-500" />
            Market Pulse
          </h2>
          <span
            className="text-xs font-medium px-3 py-1.5 bg-blue-500/10 text-blue-500 border border-blue-500/30 animate-pulse"
            style={{
              clipPath:
                "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
            }}
          >
            LIVE
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            articles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative p-4 bg-gradient-to-br from-muted/30 to-muted/10 border border-border/50 hover:border-blue-500/50 transition-all overflow-hidden"
                style={{
                  clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
              >
                {/* Clipped corner accent */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500/20"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500/20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-start gap-3 relative z-10">
                  <h3 className="font-medium text-sm leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground/70">
                  <span className="font-semibold text-foreground/60">
                    {article.source.name}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
