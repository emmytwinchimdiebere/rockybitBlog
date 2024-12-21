"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Success() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-3xl p-8 space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="mx-auto text-green-500 w-20 h-20" />
          </motion.div>
          <h1 className="lg:text-2xl text-[1.1rem] font-bold text-gray-800">Success!</h1>
          <p className="text-[1.2rem] font-light  text-gray-600">Your action has been completed successfully.</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="relative"
        >
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-step-illustration_52683-106767.jpg?uid=R176417142&semt=ais_hybrid"
            alt="Success Illustration"
            className="w-full lg:h-[500px] h-auto rounded-lg shadow-lg"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-lg text-gray-700 mb-6">
            Congratulations on your achievement! You've taken a significant step forward.
          </p>
          <Link
            href={"/"}
            
            className="bg-gradient-to-r from-blue-500 to-blue-600 py-3 px-6 rounded-full  text-white no-underline transition"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}