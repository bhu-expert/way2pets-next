'use client'

import { useMemo, useState } from 'react'
import { saveCmsResource } from '@/lib/admin-actions'
import type { CmsRow } from '@/lib/cms'
import { blogCategories, blogSubcategories, buildBlogPath } from '@/lib/taxonomy'

export default function BlogEditor({ row }: { row: CmsRow | null }) {
  const [category, setCategory] = useState(String(row?.category || (row?.pet_type === 'dog' ? 'dogs' : row?.pet_type === 'cat' ? 'cats' : 'general')))
  const [subcategory, setSubcategory] = useState(String(row?.subcategory || blogSubcategories[category]?.[0] || 'pet-care'))
  const [slug, setSlug] = useState(String(row?.slug || ''))
  const fullPath = useMemo(() => buildBlogPath(category, subcategory, slug), [category, subcategory, slug])

  return (
    <div>
      <div className="admin-page-header"><div><h1>{row?.id ? 'Edit Blog Article' : 'New Blog Article'}</h1><p>Write long-form SEO articles with Category, Subcategory, formatted HTML content, FAQ JSON and metadata.</p></div></div>
      <form action={saveCmsResource} className="admin-panel admin-form-grid">
        <input type="hidden" name="_resource" value="blog" />
        {row?.id && <input type="hidden" name="id" value={String(row.id)} />}
        <input type="hidden" name="full_path" value={fullPath} />
        <label><span>Title *</span><input name="title" required defaultValue={String(row?.title || '')} /></label>
        <label><span>Slug *</span><input name="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} /></label>
        <label><span>Category</span><select name="category" value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(blogSubcategories[e.target.value]?.[0] || '') }}>{blogCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>Subcategory</span><select name="subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)}>{(blogSubcategories[category] || []).map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="admin-field-wide"><span>Auto-generated full path</span><input readOnly value={fullPath} /></label>
        <label className="admin-field-wide"><span>Excerpt</span><textarea name="excerpt" rows={3} defaultValue={String(row?.excerpt || '')} /></label>
        <label className="admin-field-wide"><span>Content editor (paste HTML formatting)</span><textarea name="content_html" rows={16} defaultValue={String(row?.content_html || '')} placeholder="<h2>Heading</h2><p>Paragraph...</p><ul><li>List item</li></ul>" /></label>
        <label className="admin-field-wide"><span>Markdown fallback</span><textarea name="content_markdown" rows={8} defaultValue={String(row?.content_markdown || '')} /></label>
        <label><span>Featured image media asset ID</span><input name="featured_image_id" defaultValue={String(row?.featured_image_id || '')} /></label>
        <label><span>SEO title</span><input name="meta_title" defaultValue={String(row?.meta_title || '')} /></label>
        <label className="admin-field-wide"><span>SEO description</span><textarea name="meta_description" rows={3} defaultValue={String(row?.meta_description || '')} /></label>
        <label><span>Canonical URL</span><input name="canonical_url" defaultValue={String(row?.canonical_url || '')} /></label>
        <label><span>OG title</span><input name="og_title" defaultValue={String(row?.og_title || '')} /></label>
        <label className="admin-field-wide"><span>OG description</span><textarea name="og_description" rows={3} defaultValue={String(row?.og_description || '')} /></label>
        <label><span>OG image asset ID</span><input name="og_image_id" defaultValue={String(row?.og_image_id || '')} /></label>
        <label><span>Status</span><select name="status" defaultValue={String(row?.status || 'draft')}><option>draft</option><option>published</option><option>scheduled</option><option>archived</option></select></label>
        <label><span>Published date</span><input name="published_at" type="date" defaultValue={String(row?.published_at || '').slice(0, 10)} /></label>
        <label className="admin-field-wide"><span>FAQ JSON</span><textarea name="faq_json" rows={8} defaultValue={JSON.stringify(row?.faq_json || [], null, 2)} /></label>
        <div className="admin-field-wide admin-form-actions"><button className="admin-button" type="submit">Save article</button></div>
      </form>
    </div>
  )
}
