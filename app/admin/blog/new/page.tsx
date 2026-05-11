import CmsForm from '@/components/admin/CmsForm'
import { resources } from '@/lib/cms'

export default function Page() {
  return <CmsForm resourceKey="blog" resource={resources.blog} row={null} />
}
