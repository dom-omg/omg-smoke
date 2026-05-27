'use client'

import { motion, useMotionValue, useTransform, animate, type HTMLMotionProps } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { fadeIn, slideUp, stagger, buttonTap, cardHover, pulse } from '../lib/motion'

// Animated page wrapper
export function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      {children}
    </motion.div>
  )
}

// Staggered list container
export function List({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  )
}

// List item — use inside <List>
export function Item({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={slideUp} className={className}>
      {children}
    </motion.div>
  )
}

// Button with press feedback
export function Button({
  children,
  className,
  onClick,
  ...props
}: HTMLMotionProps<'button'> & { children: ReactNode }) {
  return (
    <motion.button
      whileTap={buttonTap}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// Card with glow hover
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div whileHover={cardHover} className={className}>
      {children}
    </motion.div>
  )
}

// Live status dot
export function LiveDot({ className }: { className?: string }) {
  return (
    <motion.span
      variants={pulse}
      initial="hidden"
      animate="visible"
      className={`inline-block w-2 h-2 rounded-full bg-[hsl(160_84%_46%)] ${className ?? ''}`}
    />
  )
}

// Animated stat counter
export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v).toLocaleString()}${suffix}`)

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [count, value])

  return <motion.span className="mono">{rounded}</motion.span>
}
