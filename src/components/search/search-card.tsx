'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function SearchCard() {
  const router = useRouter()

  const handleFindPractitioners = () => {
    router.push('/search')
  }

  return (
    <div className="flex justify-center">
      <Button onClick={handleFindPractitioners} size="lg" className="px-8">
        Find Practitioners
      </Button>
    </div>
  )
}
