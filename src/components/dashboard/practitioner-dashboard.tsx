'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { getPractitionerAppointments, updateAppointmentStatus } from '@/lib/database'

export function PractitionerDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return

      try {
        // Mock data for testing
        const mockAppointments = [
          {
            id: '1',
            patient_id: 'patient1',
            practitioner_id: user.id,
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
            patient_id: 'patient2',
            practitioner_id: user.id,
            start_time: '2024-01-20T14:00:00Z',
            end_time: '2024-01-20T15:00:00Z',
            type: 'In-Person',
            status: 'pending',
            practitioners: {
              specialty: 'Cardiology',
              profiles: {
                full_name: 'Dr. Sarah Johnson'
              }
            }
          },
          {
            id: '3',
            patient_id: 'patient3',
            practitioner_id: user.id,
            start_time: '2024-01-19T09:00:00Z',
            end_time: '2024-01-19T10:00:00Z',
            type: 'Virtual',
            status: 'completed',
            practitioners: {
              specialty: 'Cardiology',
              profiles: {
                full_name: 'Dr. Sarah Johnson'
              }
            }
          },
          {
            id: '4',
            patient_id: 'patient4',
            practitioner_id: user.id,
            start_time: '2024-01-18T11:00:00Z',
            end_time: '2024-01-18T12:00:00Z',
            type: 'Virtual',
            status: 'pending',
            practitioners: {
              specialty: 'Cardiology',
              profiles: {
                full_name: 'Dr. Sarah Johnson'
              }
            }
          },
          {
            id: '5',
            patient_id: 'patient5',
            practitioner_id: user.id,
            start_time: '2024-01-17T15:00:00Z',
            end_time: '2024-01-17T16:00:00Z',
            type: 'In-Person',
            status: 'completed',
            practitioners: {
              specialty: 'Cardiology',
              profiles: {
                full_name: 'Dr. Sarah Johnson'
              }
            }
          }
        ]

        // Simulate loading delay
        setTimeout(() => {
          setAppointments(mockAppointments)
          setLoading(false)
        }, 500)
      } catch (error) {
        console.error('Error fetching appointments:', error)
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user])

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const success = await updateAppointmentStatus(appointmentId, status)
      if (success) {
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status }
              : apt
          )
        )
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const today = new Date()
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.start_time)
    return aptDate.toDateString() === today.toDateString()
  })

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending')
  const completedAppointments = appointments.filter(apt => apt.status === 'completed')

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
        <h1 className="text-3xl font-bold text-foreground">Practitioner Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.length === 0 ? 'No appointments today' : 'Appointments scheduled'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting your confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Today&apos;s Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Appointments Today</h3>
              <p className="text-muted-foreground">
                You have no appointments scheduled for today.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(appointment.start_time), 'h:mm a')} - 
                        {format(new Date(appointment.end_time), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{appointment.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{appointment.status}</Badge>
                    {appointment.status === 'pending' && (
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Booking Requests */}
      {pendingAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>New Booking Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {format(new Date(appointment.start_time), 'MMM dd, yyyy')}
                      </span>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(appointment.start_time), 'h:mm a')} - 
                        {format(new Date(appointment.end_time), 'h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{appointment.type} consultation</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed')}
                    >
                      Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled')}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button asChild>
              <a href="/practitioner/profile">Set Availability</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/practitioner/profile">Update Profile</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
