const VENTURES_DB_ID = process.env.VENTURES_DATABASE_ID || '04559f3f6a174a0c851588c180d7bb92';

module.exports = async function handler(req, res) {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'NOTION_API_KEY is not set.' });

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${VENTURES_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        sorts: [{ property: 'Date Started', direction: 'descending' }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || 'Notion API error' });

    const ventures = data.results.map(page => {
      const p = page.properties;
      return {
        id: page.id,
        url: page.url,
        name: p['Name']?.title?.[0]?.plain_text || 'Untitled',
        status: p['Status']?.select?.name || '',
        category: p['Category']?.select?.name || '',
        summary: p['Summary']?.rich_text?.[0]?.plain_text || '',
        tags: p['Tags']?.multi_select?.map(t => t.name) || [],
        website: p['Website']?.url || '',
        dateStarted: p['Date Started']?.date?.start || ''
      };
    });

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(ventures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
