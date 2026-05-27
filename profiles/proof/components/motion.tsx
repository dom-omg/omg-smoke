'use client'

import { motion, AnimatePresence, useMotionValue, useTransform, animate, type HTMLMotionProps } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { fadeIn, slideUp, stagger, chainReveal, buttonTap, cardHover, stampIn, modalIn } from '../lib/motion'

export function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      {children}
    </motion.div>
  )
}

export function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  )
}

export function Item({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={slideUp} className={className}>
      {children}
    </motion.div>
  )
}

export function Button({ children, className, onClick, ...props }: HTMLMotionProps<'button'> & { children: ReactNode }) {
  return (
    <motion.button whileTap={buttonTap} className={className} onClick={onClick} {...props}>
      {children}
    </motion.button>
  )
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div whileHover={cardHover} className={className}>
      {children}
    </motion.div>
  )
}

// Proof chain — each step reveals in sequence
export function ProofChain({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className={`proof-chain ${className ?? ''}`}>
      {children}
    </motion.div>
  )
}

export function ProofStep({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={chainReveal} className={className}>
      {children}
    </motion.div>
  )
}

// VERIFIED / REJECTED stamp
export function VerifiedStamp({ status }: { status: 'verified' | 'rejected' | 'pending' }) {
  const labels = { verified: 'VERIFIED', rejected: 'REJECTED', pending: 'PENDING' }
  const colors = {
    verified: 'text-[hsl(142_76%_28%)] border-[hsl(142_76%_36%/0.5)]',
    rejected: 'text-[hsl(0_72%_40%)] border-[hsl(0_72%_51%/0.5)]',
    pending: 'text-[hsl(215_16%_47%)] border-[hsl(215_16%_47%/0.5)]',
  }
  return (
    <motion.div
      variants={stampIn}
      initial="hidden"
      animate="visible"
      className={`inline-block border-2 rounded px-3 py-1 font-mono text-sm font-bold tracking-widest uppercase rotate-[-2deg] ${colors[status]}`}
    >
      {labels[status]}
    </motion.div>
  )
}

// Dialog/modal wrapper
export function Modal({ children, open, className }: { children: ReactNode; open: boolean; className?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={modalIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animated counter
export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const count = useMotionValue(0)
  const display = useTransform(count, (v) =>
    `${prefix}${Math.round(v).toLocaleString()}${suffix}`
  )
  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [count, value])
  return <motion.span>{display}</motion.span>
}
