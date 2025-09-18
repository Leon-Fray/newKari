import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { SignUpForm } from '@/components/auth/sign-up-form'

export default function SignUpPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <SignUpForm />
        </div>
      </div>
    </MainLayout>
  )
}
