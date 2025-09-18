import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PractitionerDashboard } from '@/components/dashboard/practitioner-dashboard'

export default function PractitionerDashboardPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <PractitionerDashboard />
      </div>
    </MainLayout>
  )
}
