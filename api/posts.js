const POSTS_DB_ID = process.env.POSTS_DATABASE_ID || '15aa0a3040c840adb51b3c665d506f90';

module.exports = async function handler(req, res) {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'NOTION_API_KEY is not set.' });

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${POSTS_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        filter: { property: 'Status', select: { equals: 'Published' } },
        sorts: [{ property: 'Published Date', direction: 'descending' }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || 'Notion API error' });

    const posts = data.results.map(page => {
      const p = page.properties;
      return {
        id: page.id,
        url: page.url,
        title: p['Title']?.title?.[0]?.plain_text || 'Untitled',
        status: p['Status']?.select?.name || '',
        category: p['Category']?.select?.name || '',
        summary: p['Summary']?.rich_text?.[0]?.plain_text || '',
        readTime: p['Read Time']?.number || null,
        publishedDate: p['Published Date']?.date?.start || '',
        tags: p['Tags']?.multi_select?.map(t => t.name) || []
      };
    });

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
