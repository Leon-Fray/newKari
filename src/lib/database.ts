import { supabase } from './supabaseClient'

export interface Practitioner {
  id: string
  profile_id: string
  specialty: string
  credentials?: string
  consultation_types: string[]
  bio?: string
  profile_picture_url?: string
  id_image_url?: string
  profiles: {
    full_name: string
  }
}

export interface Appointment {
  id: string
  patient_id: string
  practitioner_id: string
  start_time: string
  end_time: string
  type: string
  status: string
  notes?: string
  practitioners: {
    specialty: string
    profiles: {
      full_name: string
    }
  }
}

export interface Review {
  id: string
  patient_id: string
  practitioner_id: string
  rating: number
  comment: string
  created_at: string
  profiles: {
    full_name: string
  }
}

export interface Profile {
  id: string
  full_name: string
  role: string
  created_at: string
  updated_at: string
}

export interface SearchFilters {
  specialty?: string
  date?: string
  rating?: string
  consultationType?: string
}

export const getPractitioners = async (filters?: SearchFilters): Promise<Practitioner[]> => {
  let query = supabase
    .from('practitioners')
    .select(`
      id,
      profile_id,
      specialty,
      credentials,
      consultation_types,
      bio,
      profiles!inner (
        full_name
      )
    `)

  if (filters?.specialty) {
    query = query.eq('specialty', filters.specialty)
  }

  if (filters?.consultationType) {
    query = query.contains('consultation_types', [filters.consultationType])
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching practitioners:', error)
    return []
  }

  // Transform the data to match our interface
  return (data || []).map((item: any) => ({
    id: item.id,
    profile_id: item.profile_id,
    specialty: item.specialty,
    credentials: item.credentials,
    consultation_types: item.consultation_types,
    bio: item.bio,
    profile_picture_url: undefined,
    id_image_url: undefined,
    profiles: {
      full_name: (item.profiles as any).full_name
    }
  }))
}

export const getPractitioner = async (id: string): Promise<Practitioner | null> => {
  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      id,
      profile_id,
      specialty,
      credentials,
      consultation_types,
      bio,
      profiles!inner (
        full_name
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching practitioner:', error)
    return null
  }

  // Transform the data to match our interface
  return {
    id: data.id,
    profile_id: data.profile_id,
    specialty: data.specialty,
    credentials: data.credentials,
    consultation_types: data.consultation_types,
    bio: data.bio,
    profile_picture_url: undefined,
    id_image_url: undefined,
    profiles: {
      full_name: (data.profiles as any).full_name
    }
  }
}

export const createAppointment = async (appointmentData: {
  patient_id: string
  practitioner_id: string
  start_time: string
  end_time: string
  type: string
  notes?: string
}): Promise<Appointment | null> => {
  // Mock appointment creation for frontend testing
  const mockAppointment: Appointment = {
    id: `mock-${Date.now()}`,
    patient_id: appointmentData.patient_id,
    practitioner_id: appointmentData.practitioner_id,
    start_time: appointmentData.start_time,
    end_time: appointmentData.end_time,
    type: appointmentData.type,
    status: 'pending',
    notes: appointmentData.notes || undefined,
    practitioners: {
      specialty: 'Cardiology', // Mock specialty
      profiles: {
        full_name: 'Dr. Sarah Johnson' // Mock practitioner name
      }
    }
  }

  // Store notes locally if provided
  if (appointmentData.notes) {
    const appointmentNotes = {
      appointmentId: mockAppointment.id,
      notes: appointmentData.notes,
      createdAt: new Date().toISOString()
    }
    
    // Get existing notes from localStorage
    const existingNotes = JSON.parse(localStorage.getItem('appointmentNotes') || '[]')
    existingNotes.push(appointmentNotes)
    localStorage.setItem('appointmentNotes', JSON.stringify(existingNotes))
  }

  // Store appointment locally for testing
  const existingAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]')
  existingAppointments.push(mockAppointment)
  localStorage.setItem('mockAppointments', JSON.stringify(existingAppointments))

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  console.log('Mock appointment created:', mockAppointment)
  return mockAppointment
}

// Helper function to get notes from localStorage
const getAppointmentNotes = (appointmentId: string): string | undefined => {
  try {
    const notes = JSON.parse(localStorage.getItem('appointmentNotes') || '[]')
    const appointmentNote = notes.find((note: any) => note.appointmentId === appointmentId)
    return appointmentNote?.notes
  } catch (error) {
    console.error('Error getting appointment notes:', error)
    return undefined
  }
}

export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  // For frontend testing, return mock appointments from localStorage
  try {
    const mockAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]')
    const patientAppointments = mockAppointments.filter((apt: any) => apt.patient_id === patientId)
    
    // Add notes to each appointment
    return patientAppointments.map((appointment: any) => ({
      ...appointment,
      notes: getAppointmentNotes(appointment.id)
    }))
  } catch (error) {
    console.error('Error fetching mock appointments:', error)
    return []
  }
}

export const getPractitionerAppointments = async (practitionerId: string): Promise<Appointment[]> => {
  // For frontend testing, return mock appointments from localStorage
  try {
    const mockAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]')
    const practitionerAppointments = mockAppointments.filter((apt: any) => apt.practitioner_id === practitionerId)
    
    // Add notes to each appointment
    return practitionerAppointments.map((appointment: any) => ({
      ...appointment,
      notes: getAppointmentNotes(appointment.id)
    }))
  } catch (error) {
    console.error('Error fetching mock practitioner appointments:', error)
    return []
  }
}

export const updateAppointmentStatus = async (id: string, status: string): Promise<boolean> => {
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating appointment status:', error)
    return false
  }

  return true
}

export const getPractitionerReviews = async (practitionerId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      patient_id,
      practitioner_id,
      rating,
      comment,
      created_at,
      profiles (
        full_name
      )
    `)
    .eq('practitioner_id', practitionerId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  // Transform the data to match our interface
  return (data || []).map((item: any) => ({
    id: item.id,
    patient_id: item.patient_id,
    practitioner_id: item.practitioner_id,
    rating: item.rating,
    comment: item.comment,
    created_at: item.created_at,
    profiles: {
      full_name: item.profiles.full_name
    }
  }))
}

export const createReview = async (reviewData: {
  patient_id: string
  practitioner_id: string
  rating: number
  comment: string
}): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select(`
      id,
      patient_id,
      practitioner_id,
      rating,
      comment,
      created_at,
      profiles (
        full_name
      )
    `)
    .single()

  if (error) {
    console.error('Error creating review:', error)
    return null
  }

  // Transform the data to match our interface
  return {
    id: data.id,
    patient_id: data.patient_id,
    practitioner_id: data.practitioner_id,
    rating: data.rating,
    comment: data.comment,
    created_at: data.created_at,
    profiles: {
      full_name: (data.profiles as any).full_name
    }
  }
}

export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

export const updateProfile = async (userId: string, data: Partial<Profile>): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)

  if (error) {
    console.error('Error updating profile:', error)
    return false
  }

  return true
}
