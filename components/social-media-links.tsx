"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram, Linkedin, LucideIcon } from "lucide-react"
import { socialLinks } from "@/lib/social-links"

const iconMap: Record<string, LucideIcon> = {
  Instagram,
  Linkedin,
}

interface SocialMediaLinksProps {
  className?: string
  iconSize?: number
}

export function SocialMediaLinks({ className = "", iconSize = 18 }: SocialMediaLinksProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      {socialLinks.map((social) => {
        const IconComponent = iconMap[social.iconName]
        if (!IconComponent) return null

        return (
          <motion.div
            key={social.name}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-colors duration-300 shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              aria-label={social.ariaLabel}
            >
              <IconComponent size={iconSize} />
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
