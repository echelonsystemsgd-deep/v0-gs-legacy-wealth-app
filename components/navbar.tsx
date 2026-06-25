"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, LayoutDashboard, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { SocialMediaLinks } from "@/components/social-media-links"
import { createClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/pricing", label: "Pricing" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const supabase = createClient()
  // Seed from cached local session immediately so the nav renders
  // the correct state on first paint — before the async getUser() network
  // round-trip completes. This eliminates the blank-button flash on mobile.
  const [user, setUser] = useState<any>(() => {
    if (typeof window === "undefined") return null
    try {
      // Supabase SSR client stores the session under this stable key
      const raw = localStorage.getItem("sb-ladebhmyywkcqtyazxxk-auth-token")
      if (raw) {
        const parsed = JSON.parse(raw)
        return parsed?.user ?? null
      }
    } catch {}
    return null
  })
  const [profile, setProfile] = useState<any>(null)
  // Only show loading skeleton if there is genuinely no cached session;
  // this avoids the blank-button flash when the user is already logged in.
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true
    try {
      const raw = localStorage.getItem("sb-ladebhmyywkcqtyazxxk-auth-token")
      return !raw
    } catch {}
    return true
  })

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const resolveAvatarUrl = async (pathOrUrl: string | null) => {
    if (!pathOrUrl) return ""
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("data:")) {
      return pathOrUrl
    }
    try {
      const { data, error } = await supabase.storage.from("avatars").createSignedUrl(pathOrUrl, 3600)
      if (error) {
        console.error("Error creating signed URL", error)
        return ""
      }
      return data?.signedUrl || ""
    } catch (err) {
      console.error("Error resolving avatar path", err)
      return ""
    }
  }

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          const { data: profileData } = await supabase
            .from("profiles")
            .select("first_name, last_name, avatar_url, role")
            .eq("id", user.id)
            .single()
          if (profileData) {
            if (profileData.avatar_url) {
              profileData.avatar_url = await resolveAvatarUrl(profileData.avatar_url)
            }
            setProfile(profileData)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
      } catch (err) {
        console.error("Error fetching user session", err)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        try {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("first_name, last_name, avatar_url, role")
            .eq("id", session.user.id)
            .single()
          if (profileData) {
            if (profileData.avatar_url) {
              profileData.avatar_url = await resolveAvatarUrl(profileData.avatar_url)
            }
            setProfile(profileData)
          }
        } catch (err) {
          console.error("Error fetching profile", err)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])


  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.push("/")
    router.refresh()
  }

  const getInitials = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || "U"
  }

  const getFullName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    }
    return user?.email?.split("@")[0] || "User"
  }


  // Outside click handler for mobile menu drawer
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('button[aria-label="Toggle menu"]')
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-bg-primary/95 border-b border-border-brand/25 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Crest Only */}
          <button
            onClick={() => {
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" })
              } else {
                router.push("/")
                setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
              }
            }}
            className="flex items-center gap-3 cursor-pointer"
            aria-label="Go to homepage top"
          >
            <div className={`relative transition-all duration-300 ${isScrolled ? "h-10 w-10" : "h-14 w-14"}`}>
              <Image 
                src="/GS_Legacy_Wealth_Watermark-removebg-preview.png" 
                alt="GS Legacy Wealth Crest" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-200 hover:text-accent-gold ${
                  isActive(link.href) 
                    ? "text-accent-gold font-semibold" 
                    : "text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button / User Profile Dropdown */}
          <div className="hidden lg:flex lg:items-center lg:gap-6">
            {loading ? (
              <div className="h-10 w-10 rounded-full border border-gold/15 bg-gold/5 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-gold/15 hover:border-gold/30 outline-none focus-visible:ring-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-gold/20 to-purple-500/20 text-gold text-xs font-bold font-serif">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-bg-secondary border border-gold/15 text-text-primary rounded-xl p-2 shadow-2xl" align="end">
                  <DropdownMenuLabel className="font-normal px-2 py-1.5">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold font-serif truncate text-foreground">{getFullName()}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {profile?.role && (
                        <span className="inline-flex items-center w-fit px-2 py-0.5 mt-1 rounded-full bg-gold/10 border border-gold/20 text-[9px] font-bold text-gold uppercase tracking-wider">
                          {profile.role}
                        </span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gold/10" />
                  {profile?.role === "admin" ? (
                    <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer rounded-lg">
                      <Link href="/admin" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                        <LayoutDashboard size={14} />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  ) : profile?.role === "client" ? (
                    <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer rounded-lg">
                      <Link href="/client" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                        <LayoutDashboard size={14} />
                        Client Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer rounded-lg">
                      <Link href="/dashboard" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                        <LayoutDashboard size={14} />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer rounded-lg">
                    <Link href="/profile" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                      <User size={14} />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-gold/10 focus:text-gold cursor-pointer rounded-lg">
                    <Link href="/" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                      <Globe size={14} />
                      Go to Website
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-gold/10" />
                  <DropdownMenuItem onClick={handleSignOut} className="focus:bg-red-500/10 focus:text-red-400 cursor-pointer text-red-500 rounded-lg">
                    <div className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                      <LogOut size={14} />
                      Log Out
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-text-secondary hover:text-accent-gold transition-colors duration-200"
                >
                  Login
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="px-6 py-2"
                >
                  <Link href="/book">Book a Strategy Call</Link>
                </Button>
              </>
            )}
          </div>


          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-foreground p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-20 bg-bg-secondary z-50 lg:hidden overflow-y-auto flex flex-col"
            style={{
              height: "calc(100vh - 5rem)",
            }}
          >
            <div className="flex-1 px-6 py-8 space-y-6 flex flex-col justify-start">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 hover:text-accent-gold ${
                    isActive(link.href) ? "text-accent-gold font-semibold" : "text-text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {loading ? (
                <div className="h-10 w-24 bg-gold/5 border border-gold/15 rounded-lg animate-pulse" />
              ) : user ? (
                <>
                  <div className="py-2 border-b border-border-brand/10">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10 border border-gold/15">
                        <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-gold/20 to-purple-500/20 text-gold font-bold font-serif">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-foreground font-serif truncate">{getFullName()}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  {profile?.role === "admin" ? (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 hover:text-accent-gold text-text-secondary"
                    >
                      Admin Panel
                    </Link>
                  ) : profile?.role === "client" ? (
                    <Link
                      href="/client"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 hover:text-accent-gold text-text-secondary"
                    >
                      Client Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 hover:text-accent-gold text-text-secondary"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 hover:text-accent-gold text-text-secondary"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 hover:text-accent-gold text-text-secondary"
                  >
                    Go to Website
                  </Link>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="block w-full text-left text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 text-red-500 hover:text-red-400"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl py-2 border-b border-border-brand/10 transition-colors duration-200 hover:text-accent-gold text-text-secondary"
                >
                  Login
                </Link>
              )}

              <div className="pt-6">
                <Button
                  asChild
                  variant="outline"
                  className="w-full py-6 text-lg"
                >
                  <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                    Book a Strategy Call
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center pt-8 border-t border-white/5">
                <SocialMediaLinks />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
