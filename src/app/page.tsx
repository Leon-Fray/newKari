import React from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { SearchCard } from '@/components/search/search-card'
import { HowItWorks } from '@/components/home/how-it-works'
import { FeaturedPractitioners } from '@/components/home/featured-practitioners'

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Find Your Perfect Healthcare Match
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with qualified healthcare professionals and book appointments that fit your schedule.
          </p>
          <SearchCard />
        </div>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Featured Practitioners */}
        <FeaturedPractitioners />
      </div>
    </MainLayout>
  )
}
