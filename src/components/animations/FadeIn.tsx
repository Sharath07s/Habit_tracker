'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

export function StaggerContainer({ children, className = '' }: { children: ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0.02 : 0.06,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.2 : 0.4,
            ease: [0.25, 0.1, 0.25, 1],
            delay
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
