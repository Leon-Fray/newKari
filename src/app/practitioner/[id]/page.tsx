'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Star, Video, User, Calendar, Clock } from 'lucide-react'
import { getPractitioner, getPractitionerReviews } from '@/lib/database'

export default function PractitionerPage() {
  const params = useParams()
  const router = useRouter()
  const practitionerId = params.id as string
  const [practitioner, setPractitioner] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    consultationType: '',
    notes: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for testing
        const mockPractitioner = {
          id: practitionerId,
          profile_id: practitionerId,
          specialty: 'Cardiology',
          credentials: 'MD, PhD',
          consultation_types: ['Virtual', 'In-Person'],
          bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and interventional procedures. Dr. Johnson completed her medical degree at Harvard Medical School and her residency at Johns Hopkins Hospital. She is passionate about patient education and believes in empowering patients to take control of their heart health through lifestyle modifications and evidence-based treatments.',
          profiles: {
            full_name: 'Dr. Sarah Johnson'
          }
        }

        const mockReviews = [
          {
            id: '1',
            patient_id: 'patient1',
            practitioner_id: practitionerId,
            rating: 5,
            comment: 'Dr. Johnson is an excellent cardiologist. She took the time to explain everything clearly and made me feel comfortable throughout the consultation.',
            created_at: '2024-01-15T10:00:00Z',
            profiles: {
              full_name: 'John Smith'
            }
          },
          {
            id: '2',
            patient_id: 'patient2',
            practitioner_id: practitionerId,
            rating: 5,
            comment: 'Very professional and knowledgeable. The virtual consultation was seamless and she provided great follow-up care.',
            created_at: '2024-01-10T14:30:00Z',
            profiles: {
              full_name: 'Maria Garcia'
            }
          },
          {
            id: '3',
            patient_id: 'patient3',
            practitioner_id: practitionerId,
            rating: 4,
            comment: 'Dr. Johnson helped me understand my condition better. The appointment was thorough and she answered all my questions.',
            created_at: '2024-01-05T09:15:00Z',
            profiles: {
              full_name: 'David Lee'
            }
          }
        ]

        // Simulate loading delay
        setTimeout(() => {
          setPractitioner(mockPractitioner)
          setReviews(mockReviews)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching practitioner data:', error)
        setLoading(false)
      }
    }

    if (practitionerId) {
      fetchData()
    }
  }, [practitionerId])

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const handleBookingInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const handleBookAppointment = () => {
    // Validate required fields
    if (!bookingData.date || !bookingData.time || !bookingData.consultationType) {
      alert('Please fill in all required fields')
      return
    }
    
    // Navigate to confirmation page with booking data
    const queryParams = new URLSearchParams({
      practitionerId,
      date: bookingData.date,
      time: bookingData.time,
      consultationType: bookingData.consultationType,
      notes: bookingData.notes
    })
    
    router.push(`/booking/confirmation?${queryParams.toString()}`)
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading practitioner profile...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!practitioner) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">Practitioner Not Found</h1>
            <p className="text-muted-foreground">
              The practitioner you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Practitioner Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{practitioner.profiles.full_name}</CardTitle>
                    <p className="text-muted-foreground text-lg">{practitioner.specialty}</p>
                    {practitioner.credentials && (
                      <p className="text-sm text-muted-foreground">{practitioner.credentials}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {getRatingStars(Math.round(averageRating))}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({averageRating.toFixed(1)})
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {practitioner.bio && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-muted-foreground">{practitioner.bio}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Consultation Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {practitioner.consultation_types.map((type: string) => (
                      <Badge key={type} variant="secondary" className="flex items-center gap-1">
                        {type === 'Virtual' ? <Video className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={() => {
                      // Scroll to booking form
                      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Book Appointment
                  </Button>
                  <Button variant="outline" size="lg">
                    <Calendar className="h-4 w-4 mr-2" />
                    View Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{review.profiles.full_name}</p>
                            <div className="flex items-center space-x-1">
                              {getRatingStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card id="booking-form">
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date">Select Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => handleBookingInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Select Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={bookingData.time}
                      onChange={(e) => handleBookingInputChange('time', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Consultation Type *</Label>
                    <div className="space-y-2 mt-1">
                      {practitioner.consultation_types.map((type: string) => (
                        <div key={type} className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            name="consultationType" 
                            value={type}
                            checked={bookingData.consultationType === type}
                            onChange={(e) => handleBookingInputChange('consultationType', e.target.value)}
                          />
                          <span className="text-sm">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={bookingData.notes}
                      onChange={(e) => handleBookingInputChange('notes', e.target.value)}
                      placeholder="Any additional information you'd like to share..."
                      rows={3}
                    />
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleBookAppointment}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-muted-foreground">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-muted-foreground">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
