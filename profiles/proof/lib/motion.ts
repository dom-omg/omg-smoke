import type { Variants } from 'framer-motion'

// PROOF profile: slower, deliberate, dignified — like a legal document revealing itself

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const buttonTap = { scale: 0.98, transition: { duration: 0.12 } }

export const cardHover = {
  y: -2,
  boxShadow: '0 8px 24px hsl(222 47% 22% / 0.08), 0 2px 8px hsl(222 47% 22% / 0.04)',
  transition: { duration: 0.2, ease: 'easeOut' },
}

// Proof verification reveal — step-by-step chain
export const chainReveal: Variants = {
  hidden: { opacity: 0, x: -4 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

// VERIFIED stamp animation
export const stampIn: Variants = {
  hidden: { opacity: 0, scale: 1.1, rotate: -2 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}

// Modal/dialog entrance
export const modalIn: Variants = {
  hidden: { opacity: 0, scale: 0.97, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15, ease: 'easeIn' } },
}

export const counterTransition = { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
