'use client'
import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value }: { value: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 800
    const stepTime = Math.abs(Math.floor(duration / (end || 1))) || 50
    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start >= end) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return <span>{count}</span>
}
