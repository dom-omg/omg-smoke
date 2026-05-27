'use client'

import { motion, AnimatePresence, useMotionValue, useTransform, animate, type HTMLMotionProps } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'
import { fadeIn, slideUp, stagger, buttonTap, cardHover, panelSlide, flashUpdate } from '../lib/motion'

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

// Side panel with slide-in/out
export function Panel({ children, open, className }: { children: ReactNode; open: boolean; className?: string }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={panelSlide}
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

// Row that flashes when value changes (live data tables)
export function LiveRow({ children, className, updateKey }: { children: ReactNode; className?: string; updateKey: string | number }) {
  return (
    <motion.tr
      key={updateKey}
      variants={flashUpdate}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.tr>
  )
}

// KPI stat counter
export function Counter({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number
}) {
  const count = useMotionValue(0)
  const display = useTransform(count, (v) =>
    `${prefix}${v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`
  )

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.8, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [count, value])

  return <motion.span>{display}</motion.span>
}
