module.exports = async function handler(req, res) {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'NOTION_API_KEY is not set.' });

  const id = req.query && req.query.id;
  if (!id) return res.status(400).json({ error: 'Missing id parameter' });

  try {
    const response = await fetch(`https://api.notion.com/v1/blocks/${id}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28'
      }
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || 'Notion API error' });

    const html = blocksToHtml(data.results || []);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ html });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

function getRichText(richText) {
  if (!richText || !richText.length) return '';
  return richText.map(t => {
    let text = (t.plain_text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    if (t.annotations) {
      if (t.annotations.bold) text = '<strong>' + text + '</strong>';
      if (t.annotations.italic) text = '<em>' + text + '</em>';
      if (t.annotations.strikethrough) text = '<s>' + text + '</s>';
      if (t.annotations.underline) text = '<u>' + text + '</u>';
      if (t.annotations.code) text = '<code>' + text + '</code>';
    }
    if (t.href) text = '<a href="' + t.href + '" target="_blank" rel="noopener">' + text + '</a>';
    return text;
  }).join('');
}

function blocksToHtml(blocks) {
  let html = '';
  let inUl = false;
  let inOl = false;

  for (const block of blocks) {
    if (block.type !== 'bulleted_list_item' && inUl) { html += '</ul>'; inUl = false; }
    if (block.type !== 'numbered_list_item' && inOl) { html += '</ol>'; inOl = false; }

    switch (block.type) {
      case 'paragraph': {
        const text = getRichText(block.paragraph && block.paragraph.rich_text);
        html += text ? '<p>' + text + '</p>' : '<p style="height:1em"></p>';
        break;
      }
      case 'heading_1':
        html += '<h1>' + getRichText(block.heading_1 && block.heading_1.rich_text) + '</h1>';
        break;
      case 'heading_2':
        html += '<h2>' + getRichText(block.heading_2 && block.heading_2.rich_text) + '</h2>';
        break;
      case 'heading_3':
        html += '<h3>' + getRichText(block.heading_3 && block.heading_3.rich_text) + '</h3>';
        break;
      case 'bulleted_list_item':
        if (!inUl) { html += '<ul>'; inUl = true; }
        html += '<li>' + getRichText(block.bulleted_list_item && block.bulleted_list_item.rich_text) + '</li>';
        break;
      case 'numbered_list_item':
        if (!inOl) { html += '<ol>'; inOl = true; }
        html += '<li>' + getRichText(block.numbered_list_item && block.numbered_list_item.rich_text) + '</li>';
        break;
      case 'quote':
        html += '<blockquote>' + getRichText(block.quote && block.quote.rich_text) + '</blockquote>';
        break;
      case 'code': {
        const lang = (block.code && block.code.language) || '';
        const code = getRichText(block.code && block.code.rich_text);
        html += '<pre><code class="language-' + lang + '">' + code + '</code></pre>';
        break;
      }
      case 'divider':
        html += '<hr>';
        break;
      case 'image': {
        const img = block.image || {};
        const imgUrl = img.type === 'external' ? (img.external && img.external.url) : (img.file && img.file.url);
        const cap = img.caption ? getRichText(img.caption) : '';
        if (imgUrl) html += '<figure><img src="' + imgUrl + '" alt="' + cap + '" loading="lazy">' + (cap ? '<figcaption style="font-size:12px;color:var(--text-dim);margin-top:8px">' + cap + '</figcaption>' : '') + '</figure>';
        break;
      }
      case 'callout': {
        const co = block.callout || {};
        const icon = (co.icon && co.icon.emoji) ? co.icon.emoji + ' ' : '';
        html += '<div class="callout">' + icon + getRichText(co.rich_text) + '</div>';
        break;
      }
      case 'toggle': {
        const tog = block.toggle || {};
        html += '<details style="margin:12px 0;padding:12px 16px;border:1px solid var(--border);border-radius:4px"><summary style="cursor:pointer;color:var(--text)">' + getRichText(tog.rich_text) + '</summary></details>';
        break;
      }
      default:
        break;
    }
  }

  if (inUl) html += '</ul>';
  if (inOl) html += '</ol>';
  return html;
}
