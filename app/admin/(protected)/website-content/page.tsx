import WebsiteContentManager from '@/components/admin/WebsiteContentManager'
import { getWebsiteContent } from '@/lib/website-content'

export default async function WebsiteContentPage({ searchParams }: { searchParams?: Promise<{ saved?: string }> }) {
  const [content, params] = await Promise.all([getWebsiteContent({ admin: true, includeInactive: true }), searchParams])
  return <WebsiteContentManager initialContent={content} saved={params?.saved === '1'} />
}
