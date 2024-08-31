'use client'

import React, { useEffect, useRef } from 'react'
import { LogIn, Target, Youtube } from 'lucide-react'

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const cards = cardsRef.current

    if (!container || cards.some(card => !card)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sticky-active')
          } else {
            entry.target.classList.remove('sticky-active')
          }
        })
      },
      { threshold: 0.5 }
    )

    cards.forEach((card) => {
      if (card) observer.observe(card)
    })

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const containerTop = containerRect.top
      const containerHeight = containerRect.height

      cards.forEach((card, index) => {
        if (card) {
          const cardRect = card.getBoundingClientRect()
          const cardTop = cardRect.top - containerTop
          const progress = Math.max(0, Math.min(1, cardTop / (containerHeight - cardRect.height)))
          
          card.style.transform = `translateY(${progress * -50}px)`
          card.style.opacity = `${1 - progress * 0}`
          card.style.zIndex = `${index + 1}` // Higher index cards will be on top
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cards.forEach((card) => {
        if (card) observer.unobserve(card)
      })
    }
  }, [])

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    // Update the ref array at the specified index
    cardsRef.current[index] = el;
  };

  return (
    <div className="container mx-auto mt-24 px-4">
      <h2 
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12"
        style={{
          background: "linear-gradient(to right, #fff 60%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0.6) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent", // For fallback
        }}
      >
        How It Works
      </h2>
      <div ref={containerRef} className="relative max-w-6xl mx-auto" style={{ height: '150vh' }}>
        {[
          { icon: LogIn, title: '1. Sign In', description: 'Create an account or sign in securely to get started with your personalized experience.' },
          { icon: Target, title: '2. Choose Interests', description: 'Select your topics of interest to help us understand your preferences and tailor your feed.' },
          { icon: Youtube, title: '3. Enjoy Curated Feed', description: 'Get a focused, distraction-free YouTube experience with content that matters to you.' }
        ].map((step, index) => (
          <div
            key={index}
            ref={setRef(index)}
            className="sticky top-1/4 bg-zinc-900 rounded-3xl p-8 shadow-lg flex flex-col items-center text-center mb-8 transition-all duration-300"
          >
            <step.icon className="w-16 h-16 mb-6 text-cyan-400" />
            <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
            <p className="text-zinc-400">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <span className="h-px w-20 bg-gradient-to-r from-cyan-400/0 via-cyan-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </div>
    </div>
  )
}