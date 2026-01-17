import { NextResponse } from "next/server";

export async function GET() {
  // Support both variable names for flexibility
  const API_KEY = process.env.NEWSDATA_API_KEY || process.env.NEWS_API_KEY;

  // 1. If no key, return error (Frontend will switch to Mock Data)
  if (!API_KEY) {
    return NextResponse.json(
      { error: "NEWSDATA_API_KEY missing in .env" },
      { status: 401 },
    );
  }

  // 2. Fetch from NewsData.io
  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&category=business&language=en`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from NewsData.io" },
        { status: res.status },
      );
    }

    const data = await res.json();

    // Map NewsData.io format to our internal Article interface
    const articles = (data.results || []).map((item: any) => ({
      title: item.title,
      description: item.description,
      url: item.link, // NewsData uses 'link'
      source: { name: item.source_id || "News" }, // NewsData uses 'source_id'
      publishedAt: item.pubDate, // NewsData uses 'pubDate'
    }));

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
