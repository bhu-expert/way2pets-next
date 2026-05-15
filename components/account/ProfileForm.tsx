'use client'

import { useState } from 'react'
import type { Row } from '@/lib/account-data'

export function ProfileForm({ profile, email }: { profile: Row | null; email?: string }) {
  const [message, setMessage] = useState('')
  async function submit(formData: FormData) {
    const res = await fetch('/api/account/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData.entries())) })
    const result = await res.json()
    setMessage(result.success ? 'Profile saved.' : result.message || 'Save failed.')
  }
  return <form action={submit} className="admin-form auth-card">
    <h1>My Profile</h1>
    <label>Email</label><input value={String(profile?.email || email || '')} className="form-input" disabled />
    <label>Full name</label><input name="full_name" defaultValue={String(profile?.full_name || '')} className="form-input" required />
    <label>Mobile</label><input name="mobile" defaultValue={String(profile?.mobile || '')} className="form-input" />
    <label>WhatsApp</label><input name="whatsapp" defaultValue={String(profile?.whatsapp || '')} className="form-input" />
    <label>City</label><input name="city" defaultValue={String(profile?.city || '')} className="form-input" />
    <label>Address</label><textarea name="address" defaultValue={String(profile?.address || '')} className="form-input" rows={3} />
    <button className="btn btn-primary">Save profile</button>{message && <p className="form-message success">{message}</p>}
  </form>
}

export function PetEditForm({ pet }: { pet: Row }) {
  const [message, setMessage] = useState('')
  async function submit(formData: FormData) {
    const res = await fetch(`/api/account/pets/${pet.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(formData.entries())) })
    const result = await res.json(); setMessage(result.success ? 'Pet saved.' : result.message || 'Save failed.')
  }
  return <form action={submit} className="admin-form account-inline-form">
    <input name="name" defaultValue={String(pet.name || '')} className="form-input" placeholder="Pet name" />
    <input name="pet_type" defaultValue={String(pet.pet_type || '')} className="form-input" placeholder="Pet type" />
    <input name="breed" defaultValue={String(pet.breed || '')} className="form-input" placeholder="Breed" />
    <input name="age" defaultValue={String(pet.age || '')} className="form-input" placeholder="Age" />
    <select name="gender" defaultValue={String(pet.gender || 'unknown')} className="form-select"><option>male</option><option>female</option><option>unknown</option></select>
    <input name="vaccination_status" defaultValue={String(pet.vaccination_status || '')} className="form-input" placeholder="Vaccination status" />
    <textarea name="health_notes" defaultValue={String(pet.health_notes || '')} className="form-input" placeholder="Notes" />
    <button className="btn btn-primary">Save pet</button>{message && <p>{message}</p>}
  </form>
}
