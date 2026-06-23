'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { LogOut, User, Globe, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface UserProfileDropdownProps {
  fullName: string | null
  email: string
  avatarLetter: string
  profileLink?: string
}

export function UserProfileDropdown({
  fullName,
  email,
  avatarLetter,
  profileLink,
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const displayName = fullName ?? email.split('@')[0]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger: Profile Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-gold/10 transition-all duration-200 cursor-pointer select-none"
        aria-label="User Menu"
      >
        <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center select-none shrink-0 shadow-inner">
          <span className="text-xs font-bold text-gold uppercase">
            {avatarLetter}
          </span>
        </div>
        <div className="hidden sm:flex flex-col items-start text-left max-w-[120px]">
          <span className="text-xs font-semibold text-foreground truncate w-full">
            {displayName}
          </span>
          <span className="text-[9px] text-muted-foreground truncate w-full">
            {email}
          </span>
        </div>
        <ChevronDown size={12} className={`text-muted-foreground/60 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#0B0B0C]/95 backdrop-blur-md rounded-xl border border-gold/20 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 text-sm animate-fade-in">
          {/* User Details (Mobile only, or as secondary header) */}
          <div className="px-4 py-3 bg-black/20 border-b border-gold/10 flex flex-col gap-0.5 sm:hidden">
            <span className="font-semibold text-foreground truncate">{displayName}</span>
            <span className="text-[10px] text-muted-foreground truncate">{email}</span>
          </div>

          {/* Links */}
          <div className="p-1 space-y-0.5">
            {profileLink && (
              <Link
                href={profileLink}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-gold hover:bg-gold/5 transition-all text-xs font-medium"
              >
                <User size={14} className="shrink-0" />
                Profile Settings
              </Link>
            )}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-gold hover:bg-gold/5 transition-all text-xs font-medium"
            >
              <Globe size={14} className="shrink-0" />
              View Public Site
            </Link>
          </div>

          <div className="h-px bg-gold/10 my-1" />

          {/* Sign Out Button */}
          <div className="p-1">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-medium cursor-pointer text-left"
            >
              <LogOut size={14} className="shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
