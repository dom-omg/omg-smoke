import type { Variants } from 'framer-motion'

// INTEL profile: fast, crisp, zero bounce — military precision

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15, ease: 'easeOut' } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
}

export const slideIn: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.15, ease: 'easeOut' } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
}

export const buttonTap = { scale: 0.95, transition: { duration: 0.08 } }

export const cardHover = {
  borderColor: 'hsl(160 84% 46% / 0.5)',
  boxShadow: '0 0 12px hsl(160 84% 46% / 0.15)',
  transition: { duration: 0.12 },
}

// Pulse animation for live indicators
export const pulse: Variants = {
  hidden: { opacity: 1, scale: 1 },
  visible: {
    opacity: [1, 0.4, 1],
    scale: [1, 1.2, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
  },
}

// Counter for stats (use with useMotionValue + useTransform)
export const counterTransition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
