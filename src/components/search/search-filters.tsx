'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface SearchFiltersProps {
  filters: {
    specialty?: string
    date?: string
    rating?: string
    consultationType?: string
  }
  onFiltersChange: (filters: any) => void
}

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

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({ ...filters, specialty })
    } else {
      onFiltersChange({ ...filters, specialty: undefined })
    }
  }

  const handleRatingChange = (rating: string) => {
    onFiltersChange({ ...filters, rating })
  }

  const handleConsultationTypeChange = (type: string, checked: boolean) => {
    const currentTypes = filters.consultationType ? [filters.consultationType] : []
    let newTypes: string[] = []
    
    if (checked) {
      newTypes = [...currentTypes, type]
    } else {
      newTypes = currentTypes.filter(t => t !== type)
    }
    
    onFiltersChange({ 
      ...filters, 
      consultationType: newTypes.length > 0 ? newTypes[0] : undefined 
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Specialty Filter */}
        <div>
          <h3 className="font-medium mb-3">Specialty</h3>
          <div className="space-y-2">
            {specialties.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={specialty}
                  checked={filters.specialty === specialty}
                  onCheckedChange={(checked) => 
                    handleSpecialtyChange(specialty, checked as boolean)
                  }
                />
                <Label htmlFor={specialty} className="text-sm">
                  {specialty}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <h3 className="font-medium mb-3">Minimum Rating</h3>
          <RadioGroup
            value={filters.rating || ''}
            onValueChange={handleRatingChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4" id="rating-4" />
              <Label htmlFor="rating-4" className="text-sm">4+ Stars</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3" id="rating-3" />
              <Label htmlFor="rating-3" className="text-sm">3+ Stars</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="rating-2" />
              <Label htmlFor="rating-2" className="text-sm">2+ Stars</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Consultation Type Filter */}
        <div>
          <h3 className="font-medium mb-3">Consultation Type</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="virtual"
                checked={filters.consultationType === 'Virtual'}
                onCheckedChange={(checked) => 
                  handleConsultationTypeChange('Virtual', checked as boolean)
                }
              />
              <Label htmlFor="virtual" className="text-sm">Virtual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-person"
                checked={filters.consultationType === 'In-Person'}
                onCheckedChange={(checked) => 
                  handleConsultationTypeChange('In-Person', checked as boolean)
                }
              />
              <Label htmlFor="in-person" className="text-sm">In-Person</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
