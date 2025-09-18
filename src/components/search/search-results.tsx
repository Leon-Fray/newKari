'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Clock, Video, User } from 'lucide-react'
import { Practitioner } from '@/lib/database'

interface SearchResultsProps {
  practitioners: Practitioner[]
}

export function SearchResults({ practitioners }: SearchResultsProps) {
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
      '4': 4.5, // Dr. James Wilson
      '5': 4.7, // Dr. Lisa Park
      '6': 4.4  // Dr. Robert Martinez
    }
    return ratings[practitionerId] || 4.5
  }

  return (
    <div className="space-y-4">
      {practitioners.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No practitioners found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        practitioners.map((practitioner) => (
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
                <p className="text-sm text-muted-foreground mb-4">{practitioner.bio}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                {practitioner.consultation_types.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type === 'Virtual' ? <Video className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {type}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>Available Online</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/practitioner/${practitioner.id}`}>
                      View Profile
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/practitioner/${practitioner.id}`}>
                      Book Appointment
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
