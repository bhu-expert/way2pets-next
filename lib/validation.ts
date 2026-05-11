export type ValidationResult<T> = { ok: true; data: T } | { ok: false; message: string }

type Raw = Record<string, unknown>

function text(input: unknown, label: string, min = 1, max = 500) {
  const value = String(input || '').trim()
  if (value.length < min) throw new Error(`${label} is required.`)
  if (value.length > max) throw new Error(`${label} is too long.`)
  return value
}

function optionalText(input: unknown, max = 1000) {
  const value = String(input || '').trim()
  if (value.length > max) throw new Error('A field is too long.')
  return value || null
}

function phone(input: unknown, label = 'Mobile number') {
  const value = text(input, label, 7, 20)
  if (!/^[+\d][\d\s-]{6,19}$/.test(value)) throw new Error(`${label} is invalid.`)
  return value
}

function email(input: unknown, required = false) {
  const value = String(input || '').trim()
  if (!value && !required) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('Email is invalid.')
  return value
}

function date(input: unknown, label: string) {
  const value = text(input, label)
  if (Number.isNaN(Date.parse(value))) throw new Error(`${label} is invalid.`)
  return value
}

function bool(input: unknown) {
  return input === true || input === 'true' || input === 'yes' || input === 'on'
}

function spam(raw: Raw) {
  if (String(raw.website || raw.company || '').trim()) throw new Error('Invalid form submission.')
}

function wrap<T>(fn: () => T): ValidationResult<T> {
  try {
    return { ok: true, data: fn() }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Invalid form submission.' }
  }
}

export function validateContact(raw: Raw) {
  return wrap(() => {
    spam(raw)
    return ({
    name: text(raw.name, 'Name', 2, 120),
    mobile: phone(raw.phone || raw.mobile, 'Mobile number'),
    email: email(raw.email),
    topic: text(raw.topic, 'Topic', 2, 120),
    message: optionalText(raw.message, 2000),
    source_page: optionalText(raw.sourcePage || raw.source_page, 300),
    lead_status: 'new',
  })
  })
}

export function validateFindPet(raw: Raw) {
  return wrap(() => {
    spam(raw)
    return ({
    name: optionalText(raw.name, 120),
    mobile: phone(raw.contact || raw.mobile, 'Mobile number'),
    topic: `Find a pet: ${text(raw.petType, 'Pet type', 2, 80)}`,
    message: `Preferred size/breed: ${text(raw.preferredSize, 'Preferred size or breed', 2, 160)}`,
    source_page: '/find-a-pet',
    lead_status: 'new',
  })
  })
}

export function validatePetRegistration(raw: Raw) {
  return wrap(() => {
    spam(raw)
    return ({
    owner_name: text(raw.ownerName || raw.owner_name, 'Owner name', 2, 120),
    mobile: phone(raw.phone || raw.mobile, 'Mobile number'),
    whatsapp: optionalText(raw.whatsapp || raw.phone || raw.mobile, 20),
    email: email(raw.email),
    city: optionalText(raw.city, 120),
    pet_type: text(raw.petType || raw.pet_type, 'Pet type', 2, 40).toLowerCase(),
    breed: optionalText(raw.breed, 120),
    pet_name: text(raw.petName || raw.pet_name, 'Pet name', 1, 120),
    age: optionalText(raw.dob || raw.age, 80),
    gender: optionalText(raw.gender, 40),
    vaccination_status: optionalText(raw.vaccinationStatus || raw.vaccination_status, 80),
    purpose: optionalText(raw.purpose, 80),
    notes: optionalText(raw.medical || raw.notes, 2000),
    status: 'new',
  })
  })
}

export function validateBoarding(raw: Raw) {
  return wrap(() => {
    const checkIn = date(raw.checkIn || raw.check_in_date, 'Check-in date')
    const checkOut = date(raw.checkOut || raw.check_out_date, 'Check-out date')
    if (Date.parse(checkOut) <= Date.parse(checkIn)) throw new Error('Check-out date must be after check-in date.')
    spam(raw)
    const days = Math.max(1, Math.ceil((Date.parse(checkOut) - Date.parse(checkIn)) / 86_400_000))

    return {
      owner_name: text(raw.ownerName || raw.owner_name || 'Pet Parent', 'Owner name', 2, 120),
      mobile: phone(raw.contact || raw.mobile, 'Mobile number'),
      whatsapp: optionalText(raw.whatsapp || raw.contact || raw.mobile, 20),
      email: email(raw.email),
      city: optionalText(raw.city, 120),
      pet_type: text(raw.petType || raw.pet_type || 'dog', 'Pet type', 2, 40).toLowerCase(),
      breed: optionalText(raw.breed, 120),
      pet_name: text(raw.petName || raw.pet_name, 'Pet name and breed', 1, 160),
      check_in_date: checkIn,
      check_out_date: checkOut,
      number_of_days: days,
      food_preference: text(raw.foodPreference || raw.food_preference, 'Food preference', 2, 160),
      packaged_food_by_owner: bool(raw.packagedFoodByOwner || raw.packaged_food_by_owner),
      fresh_cooked_food_by_way2pets: bool(raw.freshCookedFoodByWay2Pets || raw.fresh_cooked_food_by_way2pets),
      medical_condition: optionalText(raw.medical || raw.medical_condition, 2000),
      vaccination_status: optionalText(raw.vaccinationStatus || raw.vaccination_status, 100),
      aggression_status: optionalText(raw.aggressionStatus || raw.aggression_status, 100),
      special_instructions: optionalText(raw.specialInstructions || raw.special_instructions, 2000),
      booking_status: 'new',
      payment_status: 'pending',
    }
  })
}
