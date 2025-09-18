'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Clock, User, X } from 'lucide-react'
import { format } from 'date-fns'
import { getPatientAppointments, updateAppointmentStatus, Profile } from '@/lib/database'

export function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        // Mock data for testing
        const mockAppointments = [
          {
            id: '1',
            patient_id: user.id,
            practitioner_id: '1',
            start_time: '2024-01-20T10:00:00Z',
            end_time: '2024-01-20T11:00:00Z',
            type: 'Virtual',
            status: 'confirmed',
            practitioners: {
              specialty: 'Cardiology',
              profiles: {
                full_name: 'Dr. Sarah Johnson'
              }
            }
          },
          {
            id: '2',
            patient_id: user.id,
            practitioner_id: '2',
            start_time: '2024-01-18T14:30:00Z',
            end_time: '2024-01-18T15:30:00Z',
            type: 'In-Person',
            status: 'completed',
            practitioners: {
              specialty: 'Dermatology',
              profiles: {
                full_name: 'Dr. Michael Chen'
              }
            }
          },
          {
            id: '3',
            patient_id: user.id,
            practitioner_id: '3',
            start_time: '2024-01-15T09:00:00Z',
            end_time: '2024-01-15T10:00:00Z',
            type: 'Virtual',
            status: 'completed',
            practitioners: {
              specialty: 'Pediatrics',
              profiles: {
                full_name: 'Dr. Emily Rodriguez'
              }
            }
          },
          {
            id: '4',
            patient_id: user.id,
            practitioner_id: '4',
            start_time: '2024-01-12T11:00:00Z',
            end_time: '2024-01-12T12:00:00Z',
            type: 'In-Person',
            status: 'cancelled',
            practitioners: {
              specialty: 'General Practice',
              profiles: {
                full_name: 'Dr. James Wilson'
              }
            }
          }
        ]

        const mockProfile = {
          id: user.id,
          full_name: 'John Doe',
          role: 'patient',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }

        // Simulate loading delay
        setTimeout(() => {
          setAppointments(mockAppointments)
          setProfile(mockProfile)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const success = await updateAppointmentStatus(appointmentId, 'cancelled')
      if (success) {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: 'cancelled' }
              : apt
          )
        )
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error)
    }
  }

  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.start_time) > new Date() && apt.status !== 'cancelled'
  )
  
  const pastAppointments = appointments.filter(apt => 
    new Date(apt.start_time) <= new Date() || apt.status === 'cancelled'
  )

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {profile?.full_name || user?.email}</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
          <TabsTrigger value="past">Past Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                <p className="text-muted-foreground mb-4">
                  You don&apos;t have any upcoming appointments scheduled.
                </p>
                <Button asChild>
                  <a href="/search">Find a Practitioner</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {appointment.practitioners.profiles.full_name}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {appointment.practitioners.specialty}
                      </p>
                    </div>
                    <Badge variant="secondary">{appointment.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(appointment.start_time), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(appointment.start_time), 'h:mm a')} - 
                        {format(new Date(appointment.end_time), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/practitioner/${appointment.practitioner_id}`}>
                        View Practitioner
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Appointments</h3>
                <p className="text-muted-foreground">
                  Your appointment history will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {appointment.practitioners.profiles.full_name}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {appointment.practitioners.specialty}
                      </p>
                    </div>
                    <Badge variant={appointment.status === 'cancelled' ? 'destructive' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(appointment.start_time), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(appointment.start_time), 'h:mm a')} - 
                        {format(new Date(appointment.end_time), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/practitioner/${appointment.practitioner_id}`}>
                      View Practitioner
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
