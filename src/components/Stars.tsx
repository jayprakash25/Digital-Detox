'use client'

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"

export default function Component() {



  return (
    <div className="absolute top-1/4 inset-0 z-0  mx-40 overflow-hidden">
        <>
          {[...Array(100)].map((_, i) => {
            const randomSize = Math.random() * 3 + 1
            const randomX = Math.random() * 100 // percentage
            const randomDelay = Math.random() * 2 // seconds

            return (
              <motion.div
                key={i}
                className="absolute bg-gray-400 rounded-full"
                initial={{
                  x: `${randomX}vw`,
                  y: '100vh',
                  opacity: 0,
                }}
                animate={{
                  y: '-10vh',
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  // delay: randomDelay,
                  duration: Math.random() * 30 + 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  width: `${randomSize}px`,
                  height: `${randomSize}px`,
                }}
              />
            )
          })}
        </>
    </div>
  )
}