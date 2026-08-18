'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: shouldReduceMotion ? 0.15 : 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  )
}
