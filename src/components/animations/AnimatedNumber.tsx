'use client'

import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'

export function AnimatedNumber({ value }: { value: number }) {
  const shouldReduceMotion = useReducedMotion()
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 })
  const display = useTransform(spring, (current) => Math.round(current).toString())

  useEffect(() => {
    if (shouldReduceMotion) {
      spring.set(value)
    } else {
      spring.set(value)
    }
  }, [spring, value, shouldReduceMotion])

  return <motion.span>{display}</motion.span>
}
