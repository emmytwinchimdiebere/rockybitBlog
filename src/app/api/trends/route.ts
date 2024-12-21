import { NextResponse } from 'next/server';
import googleTrends from 'google-trends-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const geo = searchParams.get('geo') || 'US';
  const categories = searchParams.get('categories')?.split(',') || [];

  try {
    // Try realTimeTrends first
    let trendingStories = await fetchRealTimeTrends(geo, categories);

    // If no results, fallback to dailyTrends
    if (!trendingStories || trendingStories.length === 0) {
      trendingStories = await fetchDailyTrends(geo);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trendsWithInterest = await Promise.all(trendingStories.map(async (story: any) => {
      const searchInterest = await fetchSearchInterest(story.title);

      return {
        title: story.title,
        entityNames: story.entityNames || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        articles: (story.articles || []).map((article: any) => ({
          title: article.articleTitle || article.title,
          url: article.url,
          source: article.source,
        })),
        searchInterest,
        category: story.category || 'Trending',
      };
    }));

    return NextResponse.json({ trendingStories: trendsWithInterest });
  } catch (error) {
    console.error('Error fetching trends with interest:', error);
    return NextResponse.json({ error: 'Failed to fetch trends with interest' }, { status: 500 });
  }
}

async function fetchRealTimeTrends(geo: string, categories: string[]) {
  try {
    const result = await googleTrends.realTimeTrends({
      geo: geo,
      category: categories.length > 0 ? categories : 'all',
    });
    const data = JSON.parse(result);
    return data.storySummaries?.trendingStories || [];
  } catch (error) {
    console.error('Error fetching real-time trends:', error);
    return [];
  }
}

async function fetchDailyTrends(geo: string) {
  try {
    const result = await googleTrends.dailyTrends({
      geo: geo,
    });
    const data = JSON.parse(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.default.trendingSearchesDays[0].trendingSearches.map((trend: any) => ({
      title: trend.title.query,
      articles: trend.articles,
      entityNames: [trend.formattedTraffic],
      category: trend.formattedTraffic,
    }));
  } catch (error) {
    console.error('Error fetching daily trends:', error);
    return [];
  }
}

async function fetchSearchInterest(keyword: string) {
  try {
    const result = await googleTrends.interestOverTime({
      keyword: keyword,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
      endTime: new Date(),
    });
    const data = JSON.parse(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.default.timelineData.reduce((sum: number, point: any) => sum + point.value[0], 0);
  } catch (error) {
    console.error('Error fetching search interest:', error);
    return 0;
  }
}