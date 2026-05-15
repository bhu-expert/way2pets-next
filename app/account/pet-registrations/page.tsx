import { SimpleTable } from '@/components/account/AccountShell'
import { getUserRows } from '@/lib/account-data'
import { requireUser } from '@/lib/user-auth'
export default async function RegistrationsPage() { const user = await requireUser(); const rows = await getUserRows('pet_registrations', user.id); return <><h1>My Pet Registrations</h1><SimpleTable rows={rows} columns={[{key:'pet_name',label:'Pet name'},{key:'pet_type',label:'Pet type'},{key:'breed',label:'Breed'},{key:'purpose',label:'Purpose'},{key:'status',label:'Status'},{key:'created_at',label:'Created'}]} /></> }
