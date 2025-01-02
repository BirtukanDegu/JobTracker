"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Zap,
  Star,
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 opacity-20"
          style={{
            background: "radial-gradient(circle, #ff6b35 0%, transparent 70%)",
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
        <motion.div
          className="absolute w-64 h-64 opacity-10"
          style={{
            background: "radial-gradient(circle, #4ecdc4 0%, transparent 70%)",
            left: mousePosition.x * 0.5 - 128,
            top: mousePosition.y * 0.5 - 128,
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-50 border-b border-gray-800/50 backdrop-blur-sm"
      >
        <Link href="/" className="flex items-center justify-center gap-3 p-6 mx-auto">
          <Image src="/logo-white.svg" width={80} height={80} alt="logo" className="size-12 text-white" />
        </Link>
      </motion.header>

      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h1
              className="text-8xl lg:text-9xl font-black tracking-tighter mb-8"
              style={{
                background: "linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #4ecdc4  50%, #44a08d 75%, #ff6b35 100%)",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              JOB
              <br />
              TRACKING
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 bg-gray-900/50 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">Used by 10K+ professionals</span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light"
            >
              The most sophisticated job application tracking platform designed for modern professionals.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-20"
          >
            <Link href="/job-tracker">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 text-lg px-12 py-6 rounded-full font-semibold shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105"
              >
                Try Now
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400"
            >
              <Zap className="w-4 h-4 text-orange-400" />
              <span>Connect and track for free</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
