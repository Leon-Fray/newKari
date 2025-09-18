import React from 'react'
import { Header } from './header'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t bg-background">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Kari Healthcare</h3>
              <p className="text-sm text-muted-foreground">
                Connecting patients with healthcare professionals
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>&copy; 2024 Kari Healthcare. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
