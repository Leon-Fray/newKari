'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createAppointment } from '@/lib/database'

export default function BookingConfirmationPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    practitionerId: '', // This would come from URL params in a real app
    date: '',
    time: '',
    consultationType: '',
    reason: '',
    notes: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be signed in to book an appointment')
      return
    }

    setError('')
    setLoading(true)

    try {
      const startTime = new Date(`${formData.date}T${formData.time}`)
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour later

      const appointmentData = {
        patient_id: user.id,
        practitioner_id: formData.practitionerId,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        type: formData.consultationType
      }

      const appointment = await createAppointment(appointmentData)
      
      if (appointment) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while booking'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <Card>
              <CardContent className="p-8">
                <div className="text-green-600 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Appointment Booked!</h1>
                <p className="text-muted-foreground mb-4">
                  Your appointment has been successfully booked. You&apos;ll receive a confirmation email shortly.
                </p>
                <Button onClick={() => router.push('/dashboard')}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Confirm Your Appointment</h1>
            <p className="text-muted-foreground">
              Please review and confirm your appointment details.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationType">Consultation Type *</Label>
                  <select
                    id="consultationType"
                    value={formData.consultationType}
                    onChange={(e) => handleInputChange('consultationType', e.target.value)}
                    required
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select consultation type</option>
                    <option value="Virtual">Virtual</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit *</Label>
                  <Input
                    id="reason"
                    type="text"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Brief description of your concern"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional information you'd like to share"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? 'Booking...' : 'Confirm Appointment'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
