'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { saveWebsiteContent } from '@/lib/admin-actions'
import type { WebsiteContent, WebsiteSection, WebsiteSectionItem } from '@/lib/website-content'

const tabs = [
  ['hero', 'Hero'],
  ['feature_cards', 'Feature Cards'],
  ['our_story', 'Our Story'],
  ['difference', 'Difference'],
  ['services', 'Services / What We Offer'],
  ['testimonials', 'Testimonials'],
  ['contact', 'Contact'],
  ['floating_buttons', 'Floating Buttons'],
  ['footer', 'Footer'],
]

const sectionTabs = new Set(['hero', 'our_story', 'difference', 'services', 'testimonials', 'contact', 'footer'])

type UploadTarget = { type: 'section'; key: string } | { type: 'item'; sectionKey: string; itemKey: string }

function Field({ label, value, onChange, textarea = false }: { label: string; value?: string | null; onChange: (value: string) => void; textarea?: boolean }) {
  return (
    <label>
      <span>{label}</span>
      {textarea ? <textarea rows={3} value={value || ''} onChange={(event) => onChange(event.target.value)} /> : <input value={value || ''} onChange={(event) => onChange(event.target.value)} />}
    </label>
  )
}

function ToggleOrder({ active, order, onActive, onOrder }: { active?: boolean; order?: number; onActive: (value: boolean) => void; onOrder: (value: number) => void }) {
  return (
    <div className="admin-inline-fields">
      <label><input type="checkbox" checked={active !== false} onChange={(event) => onActive(event.target.checked)} /> Active</label>
      <label><span>Display order</span><input type="number" value={order || 0} onChange={(event) => onOrder(Number(event.target.value || 0))} /></label>
    </div>
  )
}

export default function WebsiteContentManager({ initialContent, saved }: { initialContent: WebsiteContent; saved?: boolean }) {
  const [sections, setSections] = useState<Record<string, WebsiteSection>>(initialContent.sections)
  const [items, setItems] = useState<Record<string, WebsiteSectionItem[]>>(initialContent.items)
  const [activeTab, setActiveTab] = useState('hero')
  const [uploading, setUploading] = useState('')
  const sectionList = useMemo(() => Object.values(sections), [sections])
  const itemList = useMemo(() => Object.values(items).flat(), [items])

  const updateSection = (key: string, patch: Partial<WebsiteSection>) => setSections((current) => ({ ...current, [key]: { ...current[key], ...patch } }))
  const updateSectionMeta = (key: string, metaKey: string, value: string) => updateSection(key, { metadata_json: { ...(sections[key]?.metadata_json || {}), [metaKey]: value } })
  const updateItem = (sectionKey: string, itemKey: string, patch: Partial<WebsiteSectionItem>) => setItems((current) => ({
    ...current,
    [sectionKey]: (current[sectionKey] || []).map((item) => item.item_key === itemKey ? { ...item, ...patch } : item),
  }))
  const updateItemMeta = (sectionKey: string, itemKey: string, metaKey: string, value: string) => setItems((current) => ({
    ...current,
    [sectionKey]: (current[sectionKey] || []).map((item) => item.item_key === itemKey ? { ...item, metadata_json: { ...(item.metadata_json || {}), [metaKey]: value } } : item),
  }))

  async function uploadImage(file: File | undefined, target: UploadTarget) {
    if (!file) return
    const targetKey = target.type === 'section' ? target.key : `${target.sectionKey}:${target.itemKey}`
    setUploading(targetKey)
    const data = new FormData()
    data.append('file', file)
    data.append('category', 'website')
    data.append('title', targetKey)
    data.append('altText', targetKey)
    const res = await fetch('/api/admin/media/upload', { method: 'POST', body: data, credentials: 'same-origin' })
    const json = await res.json()
    setUploading('')
    if (!res.ok || !json.success || !json.asset?.secure_url) {
      alert(json.message || 'Upload failed')
      return
    }
    if (target.type === 'section') updateSection(target.key, { image_url: json.asset.secure_url })
    else updateItem(target.sectionKey, target.itemKey, { image_url: json.asset.secure_url })
  }

  const renderImageUpload = (url: string | null | undefined, target: UploadTarget) => {
    const targetKey = target.type === 'section' ? target.key : `${target.sectionKey}:${target.itemKey}`
    return (
      <div className="admin-image-field">
        {url && <Image src={url} alt="Current CMS image" width={220} height={140} style={{ objectFit: 'cover' }} />}
        <label><span>Image URL</span><input value={url || ''} onChange={(event) => target.type === 'section' ? updateSection(target.key, { image_url: event.target.value }) : updateItem(target.sectionKey, target.itemKey, { image_url: event.target.value })} /></label>
        <label><span>Upload image</span><input type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0], target)} /></label>
        {uploading === targetKey && <small>Uploading...</small>}
      </div>
    )
  }

  const renderCommonSection = (key: string) => {
    const section = sections[key]
    if (!section) return null
    return (
      <div className="admin-panel website-cms-card">
        <h2>{tabs.find(([tab]) => tab === key)?.[1]}</h2>
        <div className="admin-form-grid">
          <Field label="Heading EN" value={section.title_en} onChange={(value) => updateSection(key, { title_en: value })} />
          <Field label="Heading HI" value={section.title_hi} onChange={(value) => updateSection(key, { title_hi: value })} />
          <Field label="Subtitle EN" value={section.subtitle_en} onChange={(value) => updateSection(key, { subtitle_en: value })} textarea />
          <Field label="Subtitle HI" value={section.subtitle_hi} onChange={(value) => updateSection(key, { subtitle_hi: value })} textarea />
          <Field label="Description EN" value={section.description_en} onChange={(value) => updateSection(key, { description_en: value })} textarea />
          <Field label="Description HI" value={section.description_hi} onChange={(value) => updateSection(key, { description_hi: value })} textarea />
          <Field label="Button text EN" value={section.button_text_en} onChange={(value) => updateSection(key, { button_text_en: value })} />
          <Field label="Button text HI" value={section.button_text_hi} onChange={(value) => updateSection(key, { button_text_hi: value })} />
          <Field label="Button link" value={section.button_link} onChange={(value) => updateSection(key, { button_link: value })} />
          <ToggleOrder active={section.is_active} order={section.sort_order} onActive={(value) => updateSection(key, { is_active: value })} onOrder={(value) => updateSection(key, { sort_order: value })} />
        </div>
        {(key === 'hero' || key === 'our_story') && renderImageUpload(section.image_url, { type: 'section', key })}
      </div>
    )
  }

  const renderOurStory = () => {
    const section = sections.our_story
    return (
      <>
        {renderCommonSection('our_story')}
        <div className="admin-panel website-cms-card">
          <h2>Our Story paragraphs</h2>
          <div className="admin-form-grid">
            {[1, 2, 3].flatMap((number) => [
              <Field key={`p${number}en`} label={`Paragraph ${number} EN`} textarea value={String(section?.metadata_json?.[`paragraph${number}_en`] || '')} onChange={(value) => updateSectionMeta('our_story', `paragraph${number}_en`, value)} />,
              <Field key={`p${number}hi`} label={`Paragraph ${number} HI`} textarea value={String(section?.metadata_json?.[`paragraph${number}_hi`] || '')} onChange={(value) => updateSectionMeta('our_story', `paragraph${number}_hi`, value)} />,
            ])}
            <Field label="Image alt EN" value={String(section?.metadata_json?.image_alt_en || '')} onChange={(value) => updateSectionMeta('our_story', 'image_alt_en', value)} />
            <Field label="Image alt HI" value={String(section?.metadata_json?.image_alt_hi || '')} onChange={(value) => updateSectionMeta('our_story', 'image_alt_hi', value)} />
          </div>
        </div>
      </>
    )
  }

  const renderItems = (sectionKey: string, includeImages = false) => (
    <div className="website-cms-list">
      {(items[sectionKey] || []).map((item) => (
        <div className="admin-panel website-cms-card" key={item.item_key}>
          <h2>{item.item_key.replace(/_/g, ' ')}</h2>
          <div className="admin-form-grid">
            <Field label="Title EN" value={item.title_en} onChange={(value) => updateItem(sectionKey, item.item_key, { title_en: value })} />
            <Field label="Title HI" value={item.title_hi} onChange={(value) => updateItem(sectionKey, item.item_key, { title_hi: value })} />
            <Field label="Subtitle EN" value={item.subtitle_en} onChange={(value) => updateItem(sectionKey, item.item_key, { subtitle_en: value })} />
            <Field label="Subtitle HI" value={item.subtitle_hi} onChange={(value) => updateItem(sectionKey, item.item_key, { subtitle_hi: value })} />
            <Field label="Description EN" value={item.description_en} onChange={(value) => updateItem(sectionKey, item.item_key, { description_en: value })} textarea />
            <Field label="Description HI" value={item.description_hi} onChange={(value) => updateItem(sectionKey, item.item_key, { description_hi: value })} textarea />
            <Field label="Button text EN" value={item.button_text_en} onChange={(value) => updateItem(sectionKey, item.item_key, { button_text_en: value })} />
            <Field label="Button text HI" value={item.button_text_hi} onChange={(value) => updateItem(sectionKey, item.item_key, { button_text_hi: value })} />
            <Field label="Button link / phone / URL" value={item.button_link} onChange={(value) => updateItem(sectionKey, item.item_key, { button_link: value })} />
            {sectionKey === 'feature_cards' && <Field label="Icon class" value={item.icon_key} onChange={(value) => updateItem(sectionKey, item.item_key, { icon_key: value })} />}
            <ToggleOrder active={item.is_active} order={item.sort_order} onActive={(value) => updateItem(sectionKey, item.item_key, { is_active: value })} onOrder={(value) => updateItem(sectionKey, item.item_key, { sort_order: value })} />
          </div>
          {includeImages && renderImageUpload(item.image_url, { type: 'item', sectionKey, itemKey: item.item_key })}
          {includeImages && <div className="admin-form-grid"><Field label="Image alt EN" value={String(item.metadata_json?.image_alt_en || '')} onChange={(value) => updateItemMeta(sectionKey, item.item_key, 'image_alt_en', value)} /><Field label="Image alt HI" value={String(item.metadata_json?.image_alt_hi || '')} onChange={(value) => updateItemMeta(sectionKey, item.item_key, 'image_alt_hi', value)} /></div>}
          {sectionKey === 'testimonials' && <Field label="Rating" value={String(item.metadata_json?.rating || 5)} onChange={(value) => updateItemMeta(sectionKey, item.item_key, 'rating', value)} />}
        </div>
      ))}
    </div>
  )

  const renderContact = () => {
    const contact = sections.contact
    return (
      <>
        {renderCommonSection('contact')}
        <div className="admin-panel website-cms-card">
          <h2>Contact details and form labels</h2>
          <div className="admin-form-grid">
            {['address', 'phone', 'email'].map((key) => <Field key={key} label={key} value={String(contact?.metadata_json?.[key] || '')} onChange={(value) => updateSectionMeta('contact', key, value)} />)}
            {['timing', 'form_heading', 'topic_boarding', 'topic_product', 'topic_grooming', 'topic_other'].flatMap((key) => [
              <Field key={`${key}_en`} label={`${key} EN`} value={String(contact?.metadata_json?.[`${key}_en`] || '')} onChange={(value) => updateSectionMeta('contact', `${key}_en`, value)} />,
              <Field key={`${key}_hi`} label={`${key} HI`} value={String(contact?.metadata_json?.[`${key}_hi`] || '')} onChange={(value) => updateSectionMeta('contact', `${key}_hi`, value)} />,
            ])}
          </div>
        </div>
      </>
    )
  }

  const renderFooter = () => {
    const footer = sections.footer
    return (
      <>
        {renderCommonSection('footer')}
        <div className="admin-panel website-cms-card">
          <h2>Footer links and contact</h2>
          <div className="admin-form-grid">
            {['phone', 'whatsapp', 'email', 'facebook', 'instagram', 'copyright_en', 'copyright_hi'].map((key) => <Field key={key} label={key} value={String(footer?.metadata_json?.[key] || '')} onChange={(value) => updateSectionMeta('footer', key, value)} />)}
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Website Content</h1>
          <p>Edit public homepage and shared website text/images without changing layout or design.</p>
        </div>
      </div>
      {saved && <p className="form-message success">Website content saved.</p>}
      <div className="website-cms-tabs">
        {tabs.map(([key, label]) => <button key={key} type="button" className={activeTab === key ? 'active' : ''} onClick={() => setActiveTab(key)}>{label}</button>)}
      </div>
      <form action={saveWebsiteContent}>
        <input type="hidden" name="sections" value={JSON.stringify(sectionList)} />
        <input type="hidden" name="items" value={JSON.stringify(itemList)} />
        {activeTab === 'our_story' ? renderOurStory() : activeTab === 'contact' ? renderContact() : activeTab === 'footer' ? renderFooter() : activeTab === 'services' ? <>{renderCommonSection('services')}{renderItems('services', true)}</> : activeTab === 'difference' ? <>{renderCommonSection('difference')}{renderItems('difference')}</> : activeTab === 'testimonials' ? <>{renderCommonSection('testimonials')}{renderItems('testimonials')}</> : sectionTabs.has(activeTab) ? renderCommonSection(activeTab) : renderItems(activeTab)}
        <div className="admin-form-actions website-save-bar">
          <button type="submit">Save Website Content</button>
          <small>Changes are stored in Supabase and the public homepage keeps hardcoded fallback content if database content is unavailable.</small>
        </div>
      </form>
    </div>
  )
}
