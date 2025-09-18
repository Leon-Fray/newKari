import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Calendar, MessageCircle } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: 'Find Your Practitioner',
      description: 'Search by specialty, location, or availability to find the perfect healthcare professional for your needs.'
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary" />,
      title: 'Book Your Appointment',
      description: 'Choose from available time slots and book your appointment with just a few clicks.'
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: 'Connect & Get Care',
      description: 'Attend your appointment virtually or in-person and receive the care you need.'
    }
  ]

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Getting the healthcare you need has never been easier. Follow these simple steps to get started.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                {step.icon}
              </div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
