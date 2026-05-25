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
    href: "https://linkedin.com/company/gslegacywealth",
    iconName: "Linkedin",
    ariaLabel: "Connect with GS Legacy Wealth on LinkedIn",
  },
]
