'use client'

import { useState } from 'react'
import { useI18n } from '@/src/i18n'

export default function BoardingForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { t } = useI18n()

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
      setErrorMsg(t.boardingForm.genericError)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t.boardingForm.ownerName}</label>
        <input type="text" name="boardingOwnerName" className="form-input" placeholder={t.boardingForm.ownerNamePlaceholder} required />
      </div>
      <div className="form-group">
        <label>{t.boardingForm.petType}</label>
        <select name="boardingPetType" className="form-select"><option value="dog">{t.boardingForm.dog}</option><option value="cat">{t.boardingForm.cat}</option></select>
      </div>
      <div className="form-group">
        <label>{t.boardingForm.petName}</label>
        <input type="text" name="boardingPetName" className="form-input" placeholder={t.boardingForm.petNamePlaceholder} required />
      </div>
      <div className="form-group">
        <label>{t.boardingForm.breed}</label>
        <input type="text" name="boardingBreed" className="form-input" placeholder={t.boardingForm.breedPlaceholder} />
      </div>
      <div className="form-group">
        <label>{t.boardingForm.dates}</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input type="date" name="boardingCheckIn" className="form-input" required />
          <input type="date" name="boardingCheckOut" className="form-input" required />
        </div>
      </div>
      <div className="form-group">
        <label>{t.boardingForm.foodPreference}</label>
        <select name="boardingFood" className="form-select">
          <option>{t.boardingForm.naturalFood}</option>
          <option>{t.boardingForm.kibble}</option>
          <option>{t.boardingForm.specialDiet}</option>
        </select>
      </div>
      <div className="form-group">
        <label>{t.boardingForm.medical}</label>
        <textarea name="boardingMedical" className="form-input" rows={2} />
      </div>
      <div className="form-group">
        <label>{t.boardingForm.vaccination}</label>
        <select name="boardingVaccination" className="form-select"><option>{t.boardingForm.complete}</option><option>{t.boardingForm.partial}</option><option>{t.boardingForm.notSure}</option></select>
      </div>
      <div className="form-group">
        <label>{t.boardingForm.aggression}</label>
        <select name="boardingAggression" className="form-select"><option>{t.boardingForm.none}</option><option>{t.boardingForm.mild}</option><option>{t.boardingForm.moderate}</option><option>{t.boardingForm.high}</option></select>
      </div>
      <div className="form-group">
        <label><input type="checkbox" name="boardingPackagedFood" /> {t.boardingForm.packagedFood}</label>
        <label><input type="checkbox" name="boardingFreshFood" defaultChecked /> {t.boardingForm.freshFood}</label>
      </div>
      <div className="form-group">
        <label>{t.boardingForm.instructions}</label>
        <textarea name="boardingInstructions" className="form-input" rows={2} />
      </div>
      <div className="form-group">
        <label>{t.boardingForm.mobile}</label>
        <input type="tel" name="boardingContact" className="form-input" placeholder="+91..." required />
      </div>
      <div className="form-group">
        <label>{t.boardingForm.whatsapp}</label>
        <input type="tel" name="boardingWhatsApp" className="form-input" placeholder="+91..." />
      </div>
      <div className="form-group">
        <label>{t.boardingForm.city}</label>
        <input type="text" name="boardingCity" className="form-input" placeholder="Lucknow" />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={status === 'loading'}>
        {status === 'loading' ? t.boardingForm.submitting : t.boardingForm.submit}
      </button>
      {status === 'success' && (
        <p className="form-message success">{t.boardingForm.success}</p>
      )}
      {status === 'error' && (
        <p className="form-message error">{errorMsg}</p>
      )}
    </form>
  )
}
