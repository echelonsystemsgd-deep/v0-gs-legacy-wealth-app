"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, LayoutDashboard, Globe, ChevronRight, ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { BrandLogo } from "@/components/brand-logo"
import { usePathname, useRouter } from "next/navigation"
import { SocialMediaLinks } from "@/components/social-media-links"
import { createClient } from "@/lib/supabase/client"
import { LiveTelemetryTicker } from "@/components/live-telemetry-ticker"
import { SITE_COPY } from "@/lib/site-copy"
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
  { href: "/#demo", label: "Interactive Demo" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/process", label: "Process" },
  { href: "/pricing", label: "Pricing" },
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
    if (href.startsWith("/#")) return false
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

  // Universal Hash-Scroll Handler (Accounts for dynamic client component hydration)
  const scrollToHashElement = useCallback((hashId: string) => {
    const cleanId = hashId.replace(/^#/, "")
    if (!cleanId) return

    let attempts = 0
    const tryScroll = () => {
      const el = document.getElementById(cleanId)
      if (el) {
        const headerOffset = 90
        const elementPosition = el.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        })
      } else if (attempts < 12) {
        attempts++
        setTimeout(tryScroll, 80)
      }
    }

    // Small delay to allow react rendering/routing cycle to settle
    setTimeout(tryScroll, 50)
  }, [])

  // Listen for hash changes and initial page loads with hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      scrollToHashElement(window.location.hash)
    }
  }, [pathname, scrollToHashElement])

  // Universal Click Handler for Desktop & Mobile Nav Links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false)

    // Case 1: Clicking Home when already on Home
    if (href === "/" && pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    // Case 2: In-Page or Cross-Page Anchor Link (e.g. /#demo)
    if (href.startsWith("/#") || href.startsWith("#")) {
      const hash = href.replace(/^\/?#/, "")
      if (pathname === "/") {
        e.preventDefault()
        scrollToHashElement(hash)
        window.history.pushState(null, "", `/#${hash}`)
      } else {
        // Navigating from another page to /#hash
        // Let Next.js Link navigate to /, then our pathname useEffect will scroll to the hash
      }
    }
  }

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
    try {
      await supabase.auth.signOut()
    } catch {}
    try {
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
      if (projectRef) {
        localStorage.removeItem(`sb-${projectRef}-auth-token`)
      }
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key)
        }
      })
    } catch {}
    setUser(null)
    setProfile(null)
    router.push("/")
    router.refresh()
  }

  // Logo click: smooth scroll to top on /, navigate home from other pages
  const handleLogoClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    setIsMobileMenuOpen(false)
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [pathname])

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
    return "Mercian Wealth Member"
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
      <LiveTelemetryTicker />
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#020E28]/95 backdrop-blur-md border-b border-[#DAA640]/20 shadow-2xl py-3"
            : "bg-[#020E28]/80 backdrop-blur-sm border-b border-[#DAA640]/10 py-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3 group shrink-0">
              <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl overflow-hidden border border-[#DAA640]/30 shadow-md">
                <BrandLogo variant="logo" alt="Mercian Wealth" fill className="object-cover transition-transform group-hover:scale-105 duration-300" priority />
              </div>
              <span className="font-sans text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>Mercian</span>
                <span className="text-[#DAA640]">Wealth</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg transition-all duration-200 ${
                      active
                        ? "text-[#DAA640] bg-[#DAA640]/10 font-bold"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* CTA Button / User Profile Dropdown */}
            <div className="hidden lg:flex lg:items-center lg:gap-3 xl:gap-5">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-[#DAA640]/30 hover:border-[#DAA640] outline-none focus-visible:ring-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} className="object-cover" />
                        <AvatarFallback className="bg-[#07153B] text-[#DAA640] text-xs font-bold font-mono">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-[#07153B] border border-[#DAA640]/25 text-white rounded-2xl p-2 shadow-2xl" align="end">
                    <DropdownMenuLabel className="font-normal px-2 py-1.5">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold truncate text-white">{getFullName()}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email || "partner@mercianwealth.com"}</p>
                        {profile?.role && (
                          <span className="inline-flex items-center w-fit px-2 py-0.5 mt-1 rounded-full bg-[#DAA640]/10 border border-[#DAA640]/20 text-[9px] font-bold text-[#DAA640] uppercase tracking-wider font-mono">
                            {profile.role}
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#DAA640]/15" />
                    
                    {/* Role-based dashboard links */}
                    {profile?.role === "admin" && (
                      <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#DAA640]/15 focus:text-white rounded-xl">
                        <Link href="/admin" className="flex items-center gap-2">
                          <LayoutDashboard size={14} className="text-[#DAA640]" />
                          <span>Admin Control Center</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {profile?.role === "client" && (
                      <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#DAA640]/15 focus:text-white rounded-xl">
                        <Link href="/client" className="flex items-center gap-2">
                          <LayoutDashboard size={14} className="text-[#DAA640]" />
                          <span>Client Portal</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#DAA640]/15 focus:text-white rounded-xl">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <Globe size={14} className="text-[#DAA640]" />
                        <span>Systems Dashboard</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-[#DAA640]/15" />
                    
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer rounded-xl"
                    >
                      <LogOut size={14} className="mr-2" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-slate-300 hover:text-white transition-colors px-2 py-1"
                  >
                    Client Login
                  </Link>

                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-[#B88528] text-[#020E28] hover:from-[#EBB755] hover:to-[#DAA640] font-bold text-xs shadow-[0_0_20px_rgba(218,166,64,0.25)] rounded-xl px-4 py-2 transition-all duration-300"
                  >
                    <Link href="/book">
                      <span>{SITE_COPY.navbar.ctaText}</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-[#DAA640] p-2 rounded-xl bg-white/5 border border-[#DAA640]/25 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={22} className="text-[#DAA640]" /> : <Menu size={22} className="text-[#DAA640]" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed inset-0 h-[100dvh] bg-[#020E28]/98 backdrop-blur-3xl z-[120] lg:hidden overflow-y-auto overflow-x-hidden flex flex-col justify-between min-w-0 max-w-full"
          >
            {/* Background Ambient Glow */}
            <div 
              className="absolute inset-0 pointer-events-none z-0 opacity-40 max-w-full"
              style={{
                background: "radial-gradient(circle at 50% 20%, rgba(218, 166, 64, 0.12) 0%, rgba(2, 14, 40, 0) 75%)"
              }}
            />

            {/* Mobile Drawer Top Header Bar */}
            <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#DAA640]/20 bg-[#020E28]/95 backdrop-blur-md shrink-0 min-w-0 max-w-full">
              <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2.5">
                <div className="relative h-8 w-8 shrink-0 rounded-lg overflow-hidden border border-[#DAA640]/30">
                  <BrandLogo
                    variant="logo"
                    alt="Mercian Wealth"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-sans text-base font-extrabold text-white flex items-center gap-1">
                  <span>Mercian</span>
                  <span className="text-[#DAA640]">Wealth</span>
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white hover:text-[#DAA640] p-2 rounded-full bg-white/5 border border-[#DAA640]/30 transition-all cursor-pointer shrink-0"
                aria-label="Close menu"
              >
                <X size={20} className="text-[#DAA640]" />
              </button>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex-1 px-4 sm:px-6 pt-6 pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] space-y-6 flex flex-col justify-between min-w-0 max-w-full">
              
              {/* Telemetry Status Pill */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#07153B] border border-[#DAA640]/25 font-mono text-[10px] sm:text-xs">
                <span className="flex items-center gap-2 text-[#DAA640] font-bold uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  LOCAL TERRITORY LOCKOUT
                </span>
                <span className="text-slate-400 uppercase tracking-widest font-medium">1 PER POSTCODE</span>
              </div>

              {/* Styled Navigation Links */}
              <div className="space-y-1.5 flex-1">
                {navLinks.map((link, idx) => {
                  const active = isActive(link.href)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group ${
                        active
                          ? "bg-[#DAA640]/15 border-[#DAA640]/40 text-[#DAA640] font-bold shadow-[0_0_15px_rgba(218,166,64,0.15)]"
                          : "bg-[#07153B]/50 border-slate-800 text-slate-200 hover:text-white hover:bg-[#07153B] hover:border-[#DAA640]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs ${active ? "text-[#DAA640]" : "text-slate-500"}`}>
                          0{idx + 1}.
                        </span>
                        <span className="font-sans text-base font-bold tracking-tight">{link.label}</span>
                      </div>
                      <ChevronRight size={16} className={`transition-transform duration-200 ${active ? "text-[#DAA640] translate-x-1" : "text-slate-500 group-hover:text-white group-hover:translate-x-1"}`} />
                    </Link>
                  )
                })}
              </div>

              {/* Login / Dashboard Access Box */}
              <div className="pt-2">
                {user ? (
                  <div className="p-4 rounded-xl border border-[#DAA640]/25 bg-[#07153B] space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-10 w-10 border border-[#DAA640]/30 shrink-0">
                          <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} className="object-cover" />
                          <AvatarFallback className="bg-[#020E28] text-[#DAA640] font-bold font-mono text-xs">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-xs font-bold text-white truncate">{getFullName()}</span>
                          <span className="text-[10px] text-slate-400 truncate">{user?.email || "partner@mercianwealth.com"}</span>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await handleSignOut()
                          setIsMobileMenuOpen(false)
                        }}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all text-xs flex items-center gap-1.5 shrink-0"
                        title="Sign Out"
                      >
                        <LogOut size={14} />
                      </button>
                    </div>

                    <Link
                      href={profile?.role === "admin" ? "/admin" : profile?.role === "client" ? "/client" : "/dashboard"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between w-full p-2.5 rounded-lg bg-[#DAA640]/10 border border-[#DAA640]/20 text-xs font-bold text-[#DAA640] hover:bg-[#DAA640]/20 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard size={14} />
                        <span>Access Dashboard Portal</span>
                      </div>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-[#07153B]/70 text-sm text-slate-200 hover:text-[#DAA640] hover:border-[#DAA640]/30 transition-all font-medium"
                  >
                    <span>Login / Client Portal Access</span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                )}
              </div>

              {/* Primary CTA Button */}
              <div>
                <Button
                  asChild
                  className="w-full py-6 text-sm font-bold bg-gradient-to-r from-[#DAA640] via-[#EBB755] to-[#B88528] text-[#020E28] hover:from-[#EBB755] hover:to-[#DAA640] shadow-[0_0_25px_rgba(218,166,64,0.25)] rounded-xl transition-all"
                >
                  <Link href="/book" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2">
                    <span>{SITE_COPY.navbar.ctaText}</span>
                    <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>

              {/* Footer Row */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                  © 2026 Mercian Wealth
                </span>
                <SocialMediaLinks />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
