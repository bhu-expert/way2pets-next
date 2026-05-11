const unsafeBlocks = /<\/?(script|iframe|object|embed|form|input|button|style|link|meta)[^>]*>/gi
const unsafeAttrs = /\s(on\w+|style)=("[^"]*"|'[^']*'|[^\s>]+)/gi
const jsUrls = /(href|src)=("|')\s*javascript:[^"']*("|')/gi

export function sanitizeHtml(html: string) {
  return html.replace(unsafeBlocks, '').replace(unsafeAttrs, '').replace(jsUrls, '$1="#"')
}

export function markdownToHtml(markdown: string) {
  return markdown.split('\n').map((line) => {
    const text = line.trim()
    if (!text) return ''
    if (text.startsWith('## ')) return `<h2>${escapeHtml(text.slice(3))}</h2>`
    if (text.startsWith('# ')) return `<h1>${escapeHtml(text.slice(2))}</h1>`
    if (text.startsWith('- ')) return `<li>${escapeHtml(text.slice(2))}</li>`
    return `<p>${escapeHtml(text)}</p>`
  }).join('\n')
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}
