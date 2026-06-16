import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-accent-purple text-text-primary border border-accent-gold rounded-none hover:bg-[#5B21B6] hover:shadow-[0_0_15px_rgba(201,162,39,0.35)] font-bold tracking-wider uppercase transition-all duration-300',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-none',
        outline:
          'bg-transparent border border-accent-gold text-text-primary hover:bg-accent-gold hover:text-bg-primary rounded-none font-bold tracking-wider uppercase transition-all duration-300',
        secondary:
          'bg-bg-tertiary text-text-secondary border border-border-brand/40 hover:bg-bg-secondary hover:text-text-primary rounded-none transition-all duration-300',
        ghost:
          'hover:bg-bg-secondary hover:text-accent-gold dark:hover:bg-bg-secondary/50 rounded-none transition-all duration-300',
        link: 'text-accent-gold underline-offset-4 hover:underline rounded-none',
      },
      size: {
        default: 'h-10 px-5 py-2.5 has-[>svg]:px-3.5',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5 text-xs',
        lg: 'h-14 px-8 py-4 has-[>svg]:px-6 text-sm',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
