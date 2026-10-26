"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Copy, CheckCircle2, Lock, Shield } from "lucide-react"

interface VisionCardProps {
  showDetails: boolean
}

export function VisionCard({ showDetails }: VisionCardProps) {
  const [copied, setCopied] = useState(false)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [showSecurityAnimation, setShowSecurityAnimation] = useState(false)

  // For 3D card effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Transform mouse movement to rotation values
  const rotateXOutput = useTransform(y, [-100, 100], [10, -10])
  const rotateYOutput = useTransform(x, [-100, 100], [-10, 10])

  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    x.set(mouseX)
    y.set(mouseY)
    setRotateX(rotateXOutput.get())
    setRotateY(rotateYOutput.get())
  }

  // Reset rotation when mouse leaves
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setRotateX(0)
    setRotateY(0)
    setIsHovering(false)
  }

  // Show security animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setShowSecurityAnimation(true)
      setTimeout(() => {
        setShowSecurityAnimation(false)
      }, 3000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative mx-auto max-w-md">
      <motion.div
        className="relative h-[220px] w-full cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] p-5 shadow-xl"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
          perspective: 1000,
        }}
        whileHover={{ scale: 1.02 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card background effects */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-transparent opacity-50"></div>

          {/* Animated gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#00B897]/10 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              ease: "linear",
            }}
          ></motion.div>

          {/* Card pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Card content */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6L8 14L16 22L24 14L16 6Z" fill="#00B897" />
              </svg>
              <span className="text-lg font-semibold">Vision Card</span>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="white"
                  strokeWidth="2"
                />
                <path d="M12 7V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            {/* Card number */}
            <div>
              <div className="text-xs text-[#8C8C8C]">Card Number</div>
              <div className="mt-1 flex items-center gap-2">
                {showDetails ? (
                  <span className="font-mono text-lg tracking-wider">5412 7534 8721 3496</span>
                ) : (
                  <span className="font-mono text-lg tracking-wider">•••• •••• •••• 3496</span>
                )}
                <button
                  className="rounded-full p-1 text-[#8C8C8C] hover:bg-white/10 hover:text-white"
                  onClick={handleCopy}
                >
                  {copied ? <CheckCircle2 size={16} className="text-[#00B897]" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Card details */}
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs text-[#8C8C8C]">Expiry</div>
                <div className="mt-1 font-mono">{showDetails ? "05/28" : "••/••"}</div>
              </div>
              <div>
                <div className="text-xs text-[#8C8C8C]">CVV</div>
                <div className="mt-1 font-mono">{showDetails ? "123" : "•••"}</div>
              </div>
              <div>
                <div className="text-xs text-[#8C8C8C]">Type</div>
                <div className="mt-1">Virtual</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security animation */}
        <AnimatedSecurityRing show={showSecurityAnimation} />

        {/* Card shine effect */}
        {isHovering && (
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white to-transparent opacity-5"
            style={{
              transform: `translateX(${rotateY * 10}px) translateY(${rotateX * 10}px)`,
            }}
          ></div>
        )}
      </motion.div>

      {/* Card status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute -right-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#1A1A1A] bg-[#0D0D0D] shadow-lg"
      >
        <div className="h-3 w-3 rounded-full bg-[#00B897]"></div>
      </motion.div>

      {/* Card actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#1A1A1A] bg-[#0D0D0D] px-4 py-2 shadow-lg"
      >
        <Lock size={14} className="text-[#8C8C8C]" />
        <span className="text-sm">Cartão seguro</span>
      </motion.div>
    </div>
  )
}

function AnimatedSecurityRing({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative h-32 w-32 rounded-full border-2 border-[#00B897]/30"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="absolute inset-0 rounded-full border-2 border-[#00B897]/20"
          ></motion.div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="absolute inset-0 rounded-full border-2 border-[#00B897]/10"
          ></motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00B897]/20 backdrop-blur-sm"
            >
              <Shield size={20} className="text-[#00B897]" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
