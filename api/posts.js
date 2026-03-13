const POSTS_DB_ID = process.env.POSTS_DATABASE_ID || '15aa0a3040c840adb51b3c665d506f90';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'NOTION_API_KEY is not set.' });

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${POSTS_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Status',
            select: { equals: 'Published' },
          },
          sorts: [{ property: 'Published Date', direction: 'descending' }],
          page_size: 100,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.message || 'Notion API error' });
    }

    const data = await response.json();
    const posts = data.results.map((page) => ({
      id: page.id,
      url: page.url,
      title: page.properties.Title?.title?.[0]?.plain_text || 'Untitled',
      status: page.properties.Status?.select?.name || null,
      category: page.properties.Category?.select?.name || null,
      summary: page.properties.Summary?.rich_text?.[0]?.plain_text || '',
      readTime: page.properties['Read Time']?.rich_text?.[0]?.plain_text || null,
      publishedDate: page.properties['Published Date']?.date?.start || null,
      tags: page.properties.Tags?.multi_select?.map((t) => t.name) || [],
    }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
