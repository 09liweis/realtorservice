import { fetchAndParseRSS } from '$lib/utils/rssUtils';

export async function load() {
  try {
    const rssFeed = await fetchAndParseRSS('https://www.canadianrealestatemagazine.ca/feed/');
    return { rssFeed };
  } catch (error:any) {
    return { error: error.message };
  }
}