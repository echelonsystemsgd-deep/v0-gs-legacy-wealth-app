'use client'

import { useState, useEffect } from 'react'
import { ClientBookingCalendar } from '@/components/dashboard/client-booking-calendar'
import { MyBookingsCalendar } from '@/components/dashboard/my-bookings-calendar'
import { CalendarDays, CalendarRange } from 'lucide-react'

interface BookingTabsWrapperProps {
  userId: string
  userRole: string
  userEmail: string
  defaultTab?: 'book' | 'my-bookings'
}

export function BookingTabsWrapper({ userId, userRole, userEmail, defaultTab = 'book' }: BookingTabsWrapperProps) {
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings'>(defaultTab)

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab])

  return (
    <div className="space-y-8 w-full">
      {/* Sleek Tab Bar switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/8 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('book')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'book'
              ? 'bg-gold text-background border border-gold/10 font-bold shadow-[0_0_10px_rgba(212,175,55,0.25)]'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          <CalendarDays size={14} />
          <span>Schedule Call</span>
        </button>
        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === 'my-bookings'
              ? 'bg-gold text-background border border-gold/10 font-bold shadow-[0_0_10px_rgba(212,175,55,0.25)]'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
          }`}
        >
          <CalendarRange size={14} />
          <span>My Bookings</span>
        </button>
      </div>

      {/* Render selected tab calendar */}
      <div className="animate-fade-in w-full">
        {activeTab === 'book' ? (
          <ClientBookingCalendar
            userId={userId}
            userRole={userRole}
            userEmail={userEmail}
          />
        ) : (
          <MyBookingsCalendar
            userId={userId}
            userRole={userRole}
            userEmail={userEmail}
          />
        )}
      </div>
    </div>
  )
}
