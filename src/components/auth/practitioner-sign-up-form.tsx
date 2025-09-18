'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function PractitionerSignUpForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Step 1: Account Information
    fullName: '',
    email: '',
    password: '',
    
    // Step 2: Professional Details
    specialty: '',
    credentials: '',
    consultationTypes: [] as string[],
    bio: ''
  })

  const specialties = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Endocrinology',
    'Gastroenterology',
    'Neurology',
    'Oncology',
    'Pediatrics',
    'Psychiatry',
    'Radiology'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConsultationTypeChange = (type: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      consultationTypes: checked
        ? [...prev.consultationTypes, type]
        : prev.consultationTypes.filter(t => t !== type)
    }))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError('Please fill in all required fields')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }
    }
    setError('')
    setCurrentStep(2)
  }

  const handleSubmit = async () => {
    if (!formData.specialty || formData.consultationTypes.length === 0) {
      setError('Please fill in all required fields')
      return
    }

    setError('')
    setLoading(true)

    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. Create profile with role: 'practitioner'
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: formData.fullName,
            role: 'practitioner'
          })

        if (profileError) throw profileError

        // 3. Create practitioner record
        const { error: practitionerError } = await supabase
          .from('practitioners')
          .insert({
            profile_id: authData.user.id,
            specialty: formData.specialty,
            credentials: formData.credentials || null,
            consultation_types: formData.consultationTypes,
            bio: formData.bio || null
          })

        if (practitionerError) throw practitionerError

        router.push("/practitioner/dashboard")
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during sign up"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Join Kari as a Healthcare Professional</CardTitle>
        <CardDescription>
          Step {currentStep} of 2: {currentStep === 1 ? 'Account Information' : 'Professional Details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
              />
              <p className="text-sm text-muted-foreground">Minimum 6 characters</p>
            </div>

            <Button onClick={handleNext} className="w-full">
              Next Step
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specialty">Specialty *</Label>
              <Select value={formData.specialty} onValueChange={(value) => handleInputChange('specialty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentials">Credentials (Optional)</Label>
              <Input
                id="credentials"
                type="text"
                value={formData.credentials}
                onChange={(e) => handleInputChange('credentials', e.target.value)}
                placeholder="e.g., MD, PhD, RN"
              />
            </div>

            <div className="space-y-2">
              <Label>Consultation Types *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virtual"
                    checked={formData.consultationTypes.includes('Virtual')}
                    onCheckedChange={(checked) => 
                      handleConsultationTypeChange('Virtual', checked as boolean)
                    }
                  />
                  <Label htmlFor="virtual">Virtual Consultations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-person"
                    checked={formData.consultationTypes.includes('In-Person')}
                    onCheckedChange={(checked) => 
                      handleConsultationTypeChange('In-Person', checked as boolean)
                    }
                  />
                  <Label htmlFor="in-person">In-Person Consultations</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio (Optional)</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell patients about your experience and approach..."
                rows={4}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <a href="/auth/sign-in" className="text-primary hover:underline">
            Sign in
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
