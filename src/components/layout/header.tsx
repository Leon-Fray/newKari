'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, Loader2 } from 'lucide-react'
import DoctorsIcon from '../../../icons/Doctors_icon.png'
import PatientsIcon from '../../../icons/Patients_Icon.png'

export function Header() {
  const { user, profile, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Determine the correct dashboard path based on the user's role
  const dashboardPath = profile?.role === 'practitioner' 
    ? '/practitioner/dashboard' 
    : '/dashboard'

  // Determine which logo to show - Patients icon when no practitioner is logged in
  const logoSrc = profile?.role === 'practitioner' ? DoctorsIcon : PatientsIcon
  const logoAlt = profile?.role === 'practitioner' ? 'Doctors Logo' : 'Patients Logo'

  // Helper function to determine if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/dashboard' || href === '/practitioner/dashboard') {
      return pathname === '/dashboard' || pathname === '/practitioner/dashboard'
    }
    return pathname === href
  }

  // Get role-based color classes
  const getRoleBasedColors = () => {
    if (profile?.role === 'practitioner') {
      return {
        bg: 'bg-secondary-doctor',
        text: 'text-secondary-doctor-foreground',
        hover: 'hover:bg-secondary-doctor hover:text-secondary-doctor-foreground'
      }
    }
    return {
      bg: 'bg-secondary-patient',
      text: 'text-secondary-patient-foreground',
      hover: 'hover:bg-secondary-patient hover:text-secondary-patient-foreground'
    }
  }

  const roleColors = getRoleBasedColors()

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      // Redirect to home page after successful sign out
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false) // Reset state if sign out fails
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            {user && profile ? (
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={192}
                height={192}
                className="h-48 w-48"
              />
            ) : (
              <Image
                src={PatientsIcon}
                alt="Patients Logo"
                width={192}
                height={192}
                className="h-48 w-48"
              />
            )}
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/search"
              className={`transition-colors px-3 py-2 rounded-md ${
                isActiveLink('/search')
                  ? `${roleColors.bg} ${roleColors.text}`
                  : `text-foreground/60 ${roleColors.hover}`
              }`}
            >
              Find Practitioners
            </Link>
            <Link
              href="/practitioner-signup"
              className={`transition-colors px-3 py-2 rounded-md ${
                isActiveLink('/practitioner-signup')
                  ? `${roleColors.bg} ${roleColors.text}`
                  : `text-foreground/60 ${roleColors.hover}`
              }`}
            >
              For Practitioners
            </Link>
            {user && (
              <Link
                href={dashboardPath}
                className={`transition-colors px-3 py-2 rounded-md ${
                  isActiveLink(dashboardPath)
                    ? `${roleColors.bg} ${roleColors.text}`
                    : `text-foreground/60 ${roleColors.hover}`
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search can be added here later */}
          </div>
          <nav className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user.email || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardPath}>
                      <Settings className="mr-2 h-4 w-4" />
                      My Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className={isSigningOut ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    {isSigningOut ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    {isSigningOut ? 'Signing out...' : 'Sign out'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
