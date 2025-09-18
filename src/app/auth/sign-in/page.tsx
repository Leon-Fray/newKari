import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { SignInForm } from '@/components/auth/sign-in-form'

export default function SignInPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <SignInForm />
        </div>
      </div>
    </MainLayout>
  )
}
