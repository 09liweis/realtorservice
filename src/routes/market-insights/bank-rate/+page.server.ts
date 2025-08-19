import { fetchAndParseRSS } from '$lib/utils/rssUtils';

export async function load() {
  try {
    const rssFeed = await fetchAndParseRSS('https://www.bankofcanada.ca/topic/interest-rates/feed/');
    return { rssFeed };
  } catch (error:any) {
    return { error: error.message };
  }
}