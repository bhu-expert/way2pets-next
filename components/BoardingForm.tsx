'use client'

import { useState } from 'react'

export default function BoardingForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = {
      ownerName: (form.elements.namedItem('boardingOwnerName') as HTMLInputElement).value,
      mobile: (form.elements.namedItem('boardingContact') as HTMLInputElement).value,
      whatsapp: (form.elements.namedItem('boardingWhatsApp') as HTMLInputElement).value,
      city: (form.elements.namedItem('boardingCity') as HTMLInputElement).value,
      petType: (form.elements.namedItem('boardingPetType') as HTMLSelectElement).value,
      breed: (form.elements.namedItem('boardingBreed') as HTMLInputElement).value,
      petName: (form.elements.namedItem('boardingPetName') as HTMLInputElement).value,
      checkIn: (form.elements.namedItem('boardingCheckIn') as HTMLInputElement).value,
      checkOut: (form.elements.namedItem('boardingCheckOut') as HTMLInputElement).value,
      foodPreference: (form.elements.namedItem('boardingFood') as HTMLSelectElement).value,
      medical: (form.elements.namedItem('boardingMedical') as HTMLTextAreaElement).value,
      vaccinationStatus: (form.elements.namedItem('boardingVaccination') as HTMLSelectElement).value,
      aggressionStatus: (form.elements.namedItem('boardingAggression') as HTMLSelectElement).value,
      specialInstructions: (form.elements.namedItem('boardingInstructions') as HTMLTextAreaElement).value,
      packagedFoodByOwner: (form.elements.namedItem('boardingPackagedFood') as HTMLInputElement).checked,
      freshCookedFoodByWay2Pets: (form.elements.namedItem('boardingFreshFood') as HTMLInputElement).checked,
      contact: (form.elements.namedItem('boardingContact') as HTMLInputElement).value,
    }

    try {
      const res = await fetch('/api/boarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (result.success) {
        setStatus('success')
        form.reset()
        window.location.href = '/thank-you/boarding'
      } else {
        setErrorMsg(result.message)
        setStatus('error')
      }
    } catch {
      setErrorMsg('Something went wrong. Please try again later.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Owner Name</label>
        <input type="text" name="boardingOwnerName" className="form-input" placeholder="Your full name" required />
      </div>
      <div className="form-group">
        <label>Pet Type</label>
        <select name="boardingPetType" className="form-select"><option value="dog">Dog</option><option value="cat">Cat</option></select>
      </div>
      <div className="form-group">
        <label>Pet Name</label>
        <input type="text" name="boardingPetName" className="form-input" placeholder="e.g. Bruno" required />
      </div>
      <div className="form-group">
        <label>Breed</label>
        <input type="text" name="boardingBreed" className="form-input" placeholder="e.g. Labrador, Persian Cat" />
      </div>
      <div className="form-group">
        <label>Dates</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="date" name="boardingCheckIn" className="form-input" required />
          <input type="date" name="boardingCheckOut" className="form-input" required />
        </div>
      </div>
      <div className="form-group">
        <label>Food Preference</label>
        <select name="boardingFood" className="form-select">
          <option>Natural Food (Served by Us)</option>
          <option>Kibble (Provided by Owner)</option>
          <option>Special Diet</option>
        </select>
      </div>
      <div className="form-group">
        <label>Any Medical Issues?</label>
        <textarea name="boardingMedical" className="form-input" rows={2} />
      </div>
      <div className="form-group">
        <label>Vaccination Status</label>
        <select name="boardingVaccination" className="form-select"><option>Complete</option><option>Partial</option><option>Not sure</option></select>
      </div>
      <div className="form-group">
        <label>Aggression Status</label>
        <select name="boardingAggression" className="form-select"><option>None</option><option>Mild</option><option>Moderate</option><option>High</option></select>
      </div>
      <div className="form-group">
        <label><input type="checkbox" name="boardingPackagedFood" /> Packaged food by owner</label>
        <label><input type="checkbox" name="boardingFreshFood" defaultChecked /> Fresh cooked food by Way2Pets</label>
      </div>
      <div className="form-group">
        <label>Special Instructions</label>
        <textarea name="boardingInstructions" className="form-input" rows={2} />
      </div>
      <div className="form-group">
        <label>Your Mobile</label>
        <input type="tel" name="boardingContact" className="form-input" placeholder="+91..." required />
      </div>
      <div className="form-group">
        <label>WhatsApp Number</label>
        <input type="tel" name="boardingWhatsApp" className="form-input" placeholder="+91..." />
      </div>
      <div className="form-group">
        <label>City</label>
        <input type="text" name="boardingCity" className="form-input" placeholder="Lucknow" />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting...' : 'Request Booking'}
      </button>
      {status === 'success' && (
        <p className="form-message success">Booking request sent! We will contact you soon to confirm.</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
