import type { Variants } from 'framer-motion'

// OPS profile: medium speed, status-driven, purposeful

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}

export const buttonTap = { scale: 0.97, transition: { duration: 0.1 } }

export const cardHover = {
  y: -1,
  boxShadow: '0 4px 20px hsl(222 47% 5% / 0.8)',
  borderColor: 'hsl(217 91% 60% / 0.4)',
  transition: { duration: 0.15 },
}

// Status update flash (highlight row when data changes)
export const flashUpdate: Variants = {
  hidden: { backgroundColor: 'hsl(217 91% 60% / 0)' },
  visible: {
    backgroundColor: ['hsl(217 91% 60% / 0.15)', 'hsl(217 91% 60% / 0)'],
    transition: { duration: 1.5, ease: 'easeOut' },
  },
}

// Panel slide-in (sidebars, drawers)
export const panelSlide: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
}

export const counterTransition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
