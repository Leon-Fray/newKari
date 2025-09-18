'use client'

import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { MainLayout } from '@/components/layout/main-layout'
import { PractitionerDashboard } from '@/components/dashboard/practitioner-dashboard'

export default function PractitionerDashboardPage() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You need to be signed in to access the practitioner dashboard.
            </p>
            <a href="/auth/sign-in" className="text-primary hover:underline">
              Sign in to continue
            </a>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (profile?.role !== 'practitioner') {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              This dashboard is only accessible to practitioners. You are currently signed in as a {profile?.role || 'patient'}.
            </p>
            <p className="text-muted-foreground mb-6">
              Please return to your patient dashboard to manage your appointments and bookings.
            </p>
            <a 
              href="/dashboard" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Go to Patient Dashboard
            </a>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <PractitionerDashboard />
      </div>
    </MainLayout>
  )
}
