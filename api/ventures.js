const VENTURES_DB_ID = process.env.VENTURES_DATABASE_ID || '04559f3f6a174a0c851588c180d7bb92';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'NOTION_API_KEY is not set.' });

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${VENTURES_DB_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sorts: [{ property: 'Date Started', direction: 'descending' }],
          page_size: 100,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.message || 'Notion API error' });
    }

    const data = await response.json();
    const ventures = data.results.map((page) => ({
      id: page.id,
      url: page.url,
      name: page.properties.Name?.title?.[0]?.plain_text || 'Untitled',
      status: page.properties.Status?.select?.name || null,
      category: page.properties.Category?.select?.name || null,
      summary: page.properties.Summary?.rich_text?.[0]?.plain_text || '',
      tags: page.properties.Tags?.multi_select?.map((t) => t.name) || [],
      website: page.properties.Website?.url || null,
      dateStarted: page.properties['Date Started']?.date?.start || null,
    }));

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(ventures);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error.' });
  }
                  };
