'use client'

import React from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { MainLayout } from '@/components/layout/main-layout'
import { PatientDashboard } from '@/components/dashboard/patient-dashboard'
import { PractitionerDashboard } from '@/components/dashboard/practitioner-dashboard'

export default function DashboardPage() {
  const { user, loading } = useAuth()

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
              You need to be signed in to access your dashboard.
            </p>
            <a href="/auth/sign-in" className="text-primary hover:underline">
              Sign in to continue
            </a>
          </div>
        </div>
      </MainLayout>
    )
  }

  // For now, we'll show patient dashboard by default
  // In a real app, you'd check the user's role from their profile
  const isPractitioner = false // This would come from user profile

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {isPractitioner ? <PractitionerDashboard /> : <PatientDashboard />}
      </div>
    </MainLayout>
  )
}
