'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Calendar, DollarSign, Users, MessageSquare } from 'lucide-react'

export function PractitionerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Practitioner Dashboard</h1>
        <p className="text-muted-foreground">Manage your practice and appointments.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings (Month)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,450</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Today's Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Jennifer Martinez */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">JM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Jennifer Martinez</p>
                    <p className="text-sm text-muted-foreground">9:00 AM, Virtual</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Confirmed
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Michael Rodriguez */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">MR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Michael Rodriguez</p>
                    <p className="text-sm text-muted-foreground">10:30 AM, In-Person</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Confirmed
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Sarah Thompson */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">ST</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Sarah Thompson</p>
                    <p className="text-sm text-muted-foreground">2:00 PM, Virtual</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Confirmed
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Booking Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>New Booking Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* David Wilson */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">DW</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">David Wilson</p>
                    <p className="text-sm text-muted-foreground">Skin consultation</p>
                    <p className="text-sm text-muted-foreground">December 18, 2024 at 3:20 PM</p>
                    <p className="text-sm text-muted-foreground">Virtual</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Accept
                  </Button>
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                </div>
              </div>

              {/* Lisa Chen */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">LC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Lisa Chen</p>
                    <p className="text-sm text-muted-foreground">Follow-up appointment</p>
                    <p className="text-sm text-muted-foreground">December 19, 2024 at 11:00 AM</p>
                    <p className="text-sm text-muted-foreground">In-Person</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Accept
                  </Button>
                  <Button size="sm" variant="outline">
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
