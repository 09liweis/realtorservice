import { DOMParser } from 'xmldom';

export async function load() {
  try {
    const response = await fetch('https://www.bankofcanada.ca/topic/interest-rates/feed/');
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const items = xmlDoc.getElementsByTagName('item');
    const rssFeed = Array.from(items).map(item => ({
      title: item.getElementsByTagName('title')[0]?.textContent || 'No title',
      link: item.getElementsByTagName('link')[0]?.textContent || '#',
      description: item.getElementsByTagName('description')[0]?.textContent || 'No description',
      pubDate: item.getElementsByTagName('pubDate')[0]?.textContent || 'No date'
    }));
    return { rssFeed };
  } catch (error) {
    return { error: error.message };
  }
}