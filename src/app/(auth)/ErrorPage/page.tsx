'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  const [error, setError] = useState<string | null>()
  const [errorCode, setErrorCode] = useState<string | null>()
  const [errorDescription, setErrorDescription] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
console.log(searchParams.get("error"))
  useEffect(() => {
    setError(searchParams.get('error'))
    setErrorCode(searchParams.get('error_code'))
    setErrorDescription(searchParams.get('error_description'))
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[white] via-gray-200 to-gray-300 text-black px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <AlertCircle size={80} className="text-black mx-auto" />
          </motion.div>
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mt-4"
          >
            {errorCode ? `Error ${errorCode}` : 'An Error Occurred'}
          </motion.h1>
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mt-2"
          >
            {error && <span className="font-semibold">{error}</span>}
            {errorDescription && (
              <span className="block mt-2 text-lg ">{errorDescription.replace(/\+/g, ' ')}</span>
            )}
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white opacity-10 blur-xl rounded-full"></div>
          <div className="relative z-10 w-full h-64 rounded-lg shadow-xl overflow-hidden">
            <ErrorAnimation />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center space-y-4"
        >
          <p className="text-lg">Let&apos;s get you back on track:</p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline" className="bg-white text-[#4a0463] hover:bg-gray-200">
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent text-black border-whit hover:bg-white hover:text-[#4a0463]">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function ErrorAnimation() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full bg-transparent"
    >
      <motion.circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="red"
        strokeWidth="10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M60 60 L140 140 M140 60 L60 140"
        stroke="red"
        strokeWidth="10"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
    </motion.svg>
  )
}