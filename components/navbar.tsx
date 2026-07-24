"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, LayoutDashboard, Globe } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { usePathname, useRouter } from "next/navigation"
import { SocialMediaLinks } from "@/components/social-media-links"
import { createClient } from "@/lib/supabase/client"
import { LiveTelemetryTicker } from "@/components/live-telemetry-ticker"
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
  { href: "/diagnostics", label: "Diagnostics" },
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
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
      document.body.classList.add("mobile-menu-open")
    } else {
      document.body.style.overflow = ""
      document.body.classList.remove("mobile-menu-open")
    }
    return () => {
      document.body.style.overflow = ""
      document.body.classList.remove("mobile-menu-open")
    }
  }, [isMobileMenuOpen])

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
        const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
        const storageKey = projectRef ? `sb-${projectRef}-auth-token` : null
        if (storageKey) {
          const raw = localStorage.getItem(storageKey)
          if (raw) {
            const parsed = JSON.parse(raw)
            if (parsed?.user) {
              setUser(parsed.user)
              setLoading(false)
            }
          }
        }
      } catch {}

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
    return user?.email?.[0]?.toUpperCase() || "MW"
  }

  const getFullName = () => {
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
    }
    if (user?.email) {
      return user.email.split("@")[0]
    }
    return "Mercian Wealth Admin"
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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Telemetry Ticker Strip */}
      <LiveTelemetryTicker />

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled ? "bg-bg-primary/95 border-b border-border-brand/25 backdrop-blur-md shadow-lg" : "bg-bg-primary/60 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Logo - Crest + Wordmark Combo */}
            <button
              suppressHydrationWarning
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" })
                } else {
                  router.push("/")
                  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
                }
              }}
              className="flex items-center gap-3 cursor-pointer group"
              aria-label="Mercian Wealth Homepage"
            >
              <div className={`relative transition-all duration-300 ${isScrolled ? "h-9 w-9" : "h-11 w-11"}`}>
                <BrandLogo
                  variant="logo"
                  alt="Mercian Wealth Crest"
                  fill
                  className="object-contain mix-blend-screen transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif font-bold text-base sm:text-xl tracking-wide text-foreground group-hover:text-accent-gold transition-colors duration-200">
                  <span className="text-accent-gold">Mercian</span> Wealth
                </span>
                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-accent-gold/70 -mt-1 hidden sm:block">
                  Autonomic Systems Lab
                </span>
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
                <div className="h-10 w-10 rounded-full border border-accent-gold/15 bg-accent-gold/5 animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-accent-gold/25 hover:border-accent-gold outline-none focus-visible:ring-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-accent-gold/20 to-accent-purple/30 text-accent-gold text-xs font-bold font-serif">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-bg-secondary border border-accent-gold/20 text-text-primary rounded-xl p-2 shadow-2xl" align="end">
                    <DropdownMenuLabel className="font-normal px-2 py-1.5">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold font-serif truncate text-foreground">{getFullName()}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || "info@mercianwealth.com"}</p>
                        {profile?.role && (
                          <span className="inline-flex items-center w-fit px-2 py-0.5 mt-1 rounded-full bg-accent-gold/10 border border-accent-gold/20 text-[9px] font-bold text-accent-gold uppercase tracking-wider">
                            {profile.role}
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-accent-gold/10" />
                    {profile?.role === "admin" ? (
                      <DropdownMenuItem asChild className="focus:bg-accent-gold/10 focus:text-accent-gold cursor-pointer rounded-lg">
                        <Link href="/admin" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                          <LayoutDashboard size={14} />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    ) : profile?.role === "client" ? (
                      <DropdownMenuItem asChild className="focus:bg-accent-gold/10 focus:text-accent-gold cursor-pointer rounded-lg">
                        <Link href="/client" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                          <LayoutDashboard size={14} />
                          Client Dashboard
                        </Link>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild className="focus:bg-accent-gold/10 focus:text-accent-gold cursor-pointer rounded-lg">
                        <Link href="/dashboard" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                          <LayoutDashboard size={14} />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild className="focus:bg-accent-gold/10 focus:text-accent-gold cursor-pointer rounded-lg">
                      <Link href="/profile" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                        <User size={14} />
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-accent-gold/10 focus:text-accent-gold cursor-pointer rounded-lg">
                      <Link href="/" className="flex w-full items-center gap-2 px-2 py-1.5 text-sm">
                        <Globe size={14} />
                        Go to Website
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-accent-gold/10" />
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
                    size="sm"
                    className="px-5 py-2 font-bold bg-accent-gold text-black hover:bg-amber-300 shadow-md"
                  >
                    <Link href="/book">Apply for Audit</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-foreground p-2"
              aria-label="Toggle menu"
              suppressHydrationWarning
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0D0716] z-50 lg:hidden overflow-y-auto flex flex-col justify-between shadow-2xl"
          >
            {/* Mobile Drawer Top Header Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-accent-gold/20 bg-[#090410] shrink-0">
              <BrandLogo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-accent-gold p-2 rounded-full bg-white/5 border border-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X size={22} className="text-accent-gold" />
              </button>
            </div>

            <div className="flex-1 px-6 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] space-y-5 flex flex-col justify-start">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-xl py-2 border-b border-white/10 transition-colors duration-200 hover:text-accent-gold ${
                    isActive(link.href) ? "text-accent-gold font-bold" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Login / Dashboard Mobile Access */}
              {user ? (
                <div className="py-3 border-b border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-accent-gold/20">
                      <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} className="object-cover" />
                      <AvatarFallback className="bg-gradient-to-br from-accent-gold/20 to-purple-500/20 text-accent-gold font-bold font-serif">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 text-left">
                      <span className="text-sm font-bold text-white font-serif truncate">{getFullName()}</span>
                      <span className="text-xs text-text-secondary truncate">{user?.email || "info@mercianwealth.com"}</span>
                    </div>
                  </div>

                  <Link
                    href={profile?.role === "admin" ? "/admin" : profile?.role === "client" ? "/client" : "/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-base font-bold text-accent-gold hover:underline py-1.5"
                  >
                    <LayoutDashboard size={18} />
                    <span>Access Dashboard</span>
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xl py-2 border-b border-white/10 text-white/80 hover:text-accent-gold transition-colors font-medium"
                >
                  Login / Portal Access
                </Link>
              )}

              <div className="pt-2">
                <Button
                  asChild
                  className="w-full py-6 text-base font-bold bg-accent-gold text-black hover:bg-amber-300"
                >
                  <Link href="/book" onClick={() => setIsMobileMenuOpen(false)}>
                    Apply for System Audit
                  </Link>
                </Button>
              </div>
              <div className="flex justify-center pt-6 pb-6 border-t border-white/10">
                <SocialMediaLinks />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
