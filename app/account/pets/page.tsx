import { PetEditForm } from '@/components/account/ProfileForm'
import { getUserRows } from '@/lib/account-data'
import { requireUser } from '@/lib/user-auth'
export default async function PetsPage() { const user = await requireUser(); const rows = (await getUserRows('pets', user.id)).filter((pet) => pet.editable_by_user !== false); return <><h1>My Pets</h1>{rows.length ? rows.map((pet) => <div className="account-card" key={String(pet.id)}><h2>{String(pet.name || pet.pet_name || 'Pet')}</h2><PetEditForm pet={pet} /></div>) : <p>No editable pets linked to your account yet.</p>}</> }
