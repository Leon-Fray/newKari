import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { PractitionerSignUpForm } from '@/components/auth/practitioner-sign-up-form'

export default function PractitionerSignUpPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Join Kari as a Healthcare Professional
            </h1>
            <p className="text-muted-foreground text-lg">
              Connect with patients and grow your practice with our comprehensive healthcare platform.
            </p>
          </div>
          <PractitionerSignUpForm />
        </div>
      </div>
    </MainLayout>
  )
}
