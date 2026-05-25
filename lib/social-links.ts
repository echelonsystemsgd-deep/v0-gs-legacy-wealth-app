export interface SocialLink {
  name: string
  href: string
  iconName: 'Instagram' | 'Linkedin'
  ariaLabel: string
}

export const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://instagram.com/gslegacywealth",
    iconName: "Instagram",
    ariaLabel: "Follow GS Legacy Wealth on Instagram",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/gs-legacy-wealth",
    iconName: "Linkedin",
    ariaLabel: "Connect with GS Legacy Wealth on LinkedIn",
  },
]
