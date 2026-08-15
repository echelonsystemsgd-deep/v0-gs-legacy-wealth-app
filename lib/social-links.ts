export interface SocialLink {
  name: string
  href: string
  iconName: 'Instagram' | 'Linkedin'
  ariaLabel: string
}

export const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/mercianwealth/",
    iconName: "Instagram",
    ariaLabel: "Follow Mercian Wealth on Instagram",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/gs-legacy-wealth/",
    iconName: "Linkedin",
    ariaLabel: "Connect with Mercian Wealth on LinkedIn",
  },
]
