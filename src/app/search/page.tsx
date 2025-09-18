'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { getPractitioners, SearchFilters as SearchFiltersType } from '@/lib/database'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [practitioners, setPractitioners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<SearchFiltersType>({
    specialty: searchParams.get('specialty') || undefined,
    date: searchParams.get('date') || undefined,
    rating: searchParams.get('rating') || undefined,
    consultationType: searchParams.get('consultationType') || undefined,
  })

  useEffect(() => {
    const fetchPractitioners = async () => {
      setLoading(true)
      try {
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
          },
          {
            id: '4',
            profile_id: '4',
            specialty: 'General Practice',
            credentials: 'MD',
            consultation_types: ['Virtual', 'In-Person'],
            bio: 'Dr. James Wilson is a family medicine physician with a focus on preventive care and chronic disease management. He provides comprehensive primary care for patients of all ages.',
            profiles: {
              full_name: 'Dr. James Wilson'
            }
          },
          {
            id: '5',
            profile_id: '5',
            specialty: 'Neurology',
            credentials: 'MD, PhD',
            consultation_types: ['Virtual'],
            bio: 'Dr. Lisa Park is a neurologist specializing in movement disorders and epilepsy. She has extensive experience in treating complex neurological conditions.',
            profiles: {
              full_name: 'Dr. Lisa Park'
            }
          },
          {
            id: '6',
            profile_id: '6',
            specialty: 'Psychiatry',
            credentials: 'MD',
            consultation_types: ['Virtual', 'In-Person'],
            bio: 'Dr. Robert Martinez is a psychiatrist focused on mood disorders and anxiety. He combines medication management with psychotherapy approaches.',
            profiles: {
              full_name: 'Dr. Robert Martinez'
            }
          }
        ]

        // Apply filters to mock data
        let filteredData = mockPractitioners

        if (filters.specialty) {
          filteredData = filteredData.filter(p => p.specialty === filters.specialty)
        }

        if (filters.consultationType) {
          filteredData = filteredData.filter(p => p.consultation_types.includes(filters.consultationType!))
        }

        // Simulate loading delay
        setTimeout(() => {
          setPractitioners(filteredData)
          setLoading(false)
        }, 300)
      } catch (error) {
        console.error('Error fetching practitioners:', error)
        setPractitioners([])
        setLoading(false)
      }
    }

    fetchPractitioners()
  }, [filters])

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Find Healthcare Practitioners</h1>
          <p className="text-muted-foreground">
            Search and filter to find the perfect healthcare professional for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading practitioners...</p>
              </div>
            ) : (
              <SearchResults practitioners={practitioners} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
