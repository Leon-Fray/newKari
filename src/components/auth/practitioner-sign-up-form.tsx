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
import { FileUpload } from '@/components/ui/file-upload'

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
    bio: '',
    
    // Step 3: Document Uploads
    profilePicture: null as File | null,
    idImage: null as File | null
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

  const handleFileSelect = (field: 'profilePicture' | 'idImage', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
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
    } else if (currentStep === 2) {
      if (!formData.specialty || formData.consultationTypes.length === 0) {
        setError('Please fill in all required fields')
        return
      }
    }
    setError('')
    setCurrentStep(currentStep + 1)
  }

  const handleSubmit = async () => {
    if (!formData.profilePicture || !formData.idImage) {
      setError('Please upload both profile picture and ID image')
      return
    }

    setError('')
    setLoading(true)

    try {
      console.log('Starting signup process...')
      
      // 1. Sign up user
      console.log('Step 1: Creating user account...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw authError
      }

      console.log('User created successfully:', authData.user?.id)

      if (authData.user) {
        // 2. Store files locally and create references
        console.log('Step 2: Storing files locally...')
        const profilePictureRef = await storeFileLocally(formData.profilePicture!, authData.user.id, 'profile')
        const idImageRef = await storeFileLocally(formData.idImage!, authData.user.id, 'id')
        console.log('Files stored with keys:', { profilePictureRef, idImageRef })

        // 3. Create profile with role: 'practitioner'
        console.log('Step 3: Creating profile...')
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: formData.fullName,
            role: 'practitioner'
          })

        if (profileError) {
          console.error('Profile error:', profileError)
          throw profileError
        }
        console.log('Profile created successfully')

        // 4. Create practitioner record (without URL columns for now)
        console.log('Step 4: Creating practitioner record...')
        const practitionerData = {
          profile_id: authData.user.id,
          specialty: formData.specialty,
          credentials: formData.credentials || null,
          consultation_types: formData.consultationTypes,
          bio: formData.bio || null
          // Note: profile_picture_url and id_image_url columns don't exist yet
          // Files are stored locally with keys: profilePictureRef, idImageRef
        }
        console.log('Practitioner data to insert:', practitionerData)
        console.log('Files stored locally with keys:', { profilePictureRef, idImageRef })

        const { error: practitionerError } = await supabase
          .from('practitioners')
          .insert(practitionerData)

        if (practitionerError) {
          console.error('Practitioner error:', practitionerError)
          throw practitionerError
        }
        console.log('Practitioner record created successfully')

        console.log('Signup completed successfully!')
        router.push("/practitioner/dashboard")
      }
    } catch (err: unknown) {
      console.error('Signup error details:', err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred during sign up"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to store file locally and return a reference
  const storeFileLocally = async (file: File, userId: string, type: 'profile' | 'id'): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        console.log(`Storing ${type} file:`, { fileName: file.name, fileSize: file.size })
        
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          try {
            const base64Data = reader.result as string
            const fileKey = `practitioner_${userId}_${type}_${Date.now()}`
            
            console.log(`Storing file with key: ${fileKey}`)
            
            // Store in localStorage with a unique key
            localStorage.setItem(fileKey, base64Data)
            
            console.log(`File stored successfully with key: ${fileKey}`)
            // Return the key as reference (much smaller than base64)
            resolve(fileKey)
          } catch (error) {
            console.error('Error processing file data:', error)
            reject(error)
          }
        }
        reader.onerror = error => {
          console.error('FileReader error:', error)
          reject(error)
        }
      } catch (error) {
        console.error('Error in storeFileLocally:', error)
        reject(error)
      }
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Join Kari as a Healthcare Professional</CardTitle>
        <CardDescription>
          Step {currentStep} of 3: {
            currentStep === 1 ? 'Account Information' : 
            currentStep === 2 ? 'Professional Details' : 
            'Document Upload'
          }
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
              <Button onClick={handleNext} className="flex-1">
                Next Step
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Upload Required Documents</h3>
              <p className="text-sm text-gray-600">
                Please upload your profile picture and a clear image of your professional ID for verification.
              </p>
              <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">
                ⚠️ Note: Images are stored locally in your browser. Database URL columns will be added later.
              </p>
            </div>

            <FileUpload
              label="Profile Picture"
              onFileSelect={(file) => handleFileSelect('profilePicture', file)}
              required
              maxSize={5}
            />

            <FileUpload
              label="Professional ID Image"
              onFileSelect={(file) => handleFileSelect('idImage', file)}
              required
              maxSize={5}
            />

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
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
