import { DOMParser } from 'xmldom';

export async function fetchAndParseRSS(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const items = xmlDoc.getElementsByTagName('item');
    return Array.from(items).map(item => ({
      title: item.getElementsByTagName('title')[0]?.textContent || 'No title',
      link: item.getElementsByTagName('link')[0]?.textContent || '#',
      description: item.getElementsByTagName('description')[0]?.textContent || 'No description',
      pubDate: item.getElementsByTagName('pubDate')[0]?.textContent || ''
    }));
  } catch (error) {
    throw error;
  }
}