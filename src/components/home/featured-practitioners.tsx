'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Video, User } from 'lucide-react'
import { getPractitioners } from '@/lib/database'

export function FeaturedPractitioners() {
  const [practitioners, setPractitioners] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    // Mock data for testing
    const mockPractitioners = [
      {
        id: '1',
        profile_id: '1',
        specialty: 'Cardiology',
        credentials: 'MD, PhD',
        consultation_types: ['Virtual', 'In-Person'],
        bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology and interventional procedures.',
        profiles: {
          full_name: 'Dr. Sarah Johnson'
        }
      },
      {
        id: '2',
        profile_id: '2',
        specialty: 'Dermatology',
        credentials: 'MD',
        consultation_types: ['Virtual', 'In-Person'],
        bio: 'Dr. Michael Chen is a dermatologist focused on skin cancer prevention and treatment. He has extensive experience in cosmetic dermatology and general skin health.',
        profiles: {
          full_name: 'Dr. Michael Chen'
        }
      },
      {
        id: '3',
        profile_id: '3',
        specialty: 'Pediatrics',
        credentials: 'MD, FAAP',
        consultation_types: ['Virtual', 'In-Person'],
        bio: 'Dr. Emily Rodriguez is a pediatrician dedicated to providing comprehensive care for children from infancy through adolescence. She emphasizes preventive care and family education.',
        profiles: {
          full_name: 'Dr. Emily Rodriguez'
        }
      }
    ]

    // Simulate loading delay
    setTimeout(() => {
      setPractitioners(mockPractitioners)
      setLoading(false)
    }, 500)
  }, [])

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  // Mock ratings for each practitioner
  const getPractitionerRating = (practitionerId: string) => {
    const ratings: { [key: string]: number } = {
      '1': 4.8, // Dr. Sarah Johnson
      '2': 4.6, // Dr. Michael Chen
      '3': 4.9, // Dr. Emily Rodriguez
    }
    return ratings[practitionerId] || 4.5
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Practitioners</h2>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Featured Practitioners</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet some of our top-rated healthcare professionals ready to help you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {practitioners.map((practitioner) => (
          <Card key={practitioner.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{practitioner.profiles.full_name}</CardTitle>
                  <p className="text-muted-foreground">{practitioner.specialty}</p>
                  {practitioner.credentials && (
                    <p className="text-sm text-muted-foreground">{practitioner.credentials}</p>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  {getRatingStars(Math.round(getPractitionerRating(practitioner.id)))}
                  <span className="text-sm text-muted-foreground ml-1">
                    ({getPractitionerRating(practitioner.id)})
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {practitioner.bio && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {practitioner.bio}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {practitioner.consultation_types.map((type: string) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type === 'Virtual' ? <Video className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {type}
                  </Badge>
                ))}
              </div>

              <Button className="w-full" asChild>
                <Link href={`/practitioner/${practitioner.id}`}>
                  View Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button variant="outline" size="lg" asChild>
          <Link href="/search">View All Practitioners</Link>
        </Button>
      </div>
    </section>
  )
}
