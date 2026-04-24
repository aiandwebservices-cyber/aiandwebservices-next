'use client'
import { useState, useEffect, useRef } from 'react'

export function CountUp({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const ran = useRef(false)
  useEffect(() => {
    ran.current = false
    setN(0)
  }, [end])
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || ran.current) return
      ran.current = true
      let t = 0
      const id = setInterval(() => {
        t += 16
        const p = Math.min(t / 1400, 1)
        setN(Math.round((1 - Math.pow(1 - p, 3)) * end))
        if (p >= 1) clearInterval(id)
      }, 16)
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}
