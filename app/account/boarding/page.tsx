import { SimpleTable } from '@/components/account/AccountShell'
import { getUserRows } from '@/lib/account-data'
import { requireUser } from '@/lib/user-auth'
export default async function BoardingPage() { const user = await requireUser(); const rows = await getUserRows('boarding_bookings', user.id); return <><h1>My Boarding Requests</h1><SimpleTable rows={rows} columns={[{key:'pet_name',label:'Pet name'},{key:'pet_type',label:'Pet type'},{key:'check_in_date',label:'Check-in'},{key:'check_out_date',label:'Check-out'},{key:'booking_status',label:'Booking status'},{key:'payment_status',label:'Payment status'},{key:'created_at',label:'Created'}]} /></> }
