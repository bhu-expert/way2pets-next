import CmsForm from '@/components/admin/CmsForm'
import { resources } from '@/lib/cms'

export default function Page() {
  return <CmsForm resourceKey="pages" resource={resources.pages} row={null} />
}
