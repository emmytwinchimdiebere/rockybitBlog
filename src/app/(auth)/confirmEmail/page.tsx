'use client'

import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { VerificationMail } from '@/components/actions/ResendVerification'
import { useState } from 'react'



export default function ConfirmEmail() {
const  searchParams =  useSearchParams();
const email  =  searchParams.get("email");
const  [response , setResponse] =  useState<string>("")
const  [loading,  setLoading] = useState(false)
const  resendEmailVerification = async () => {
  try {
    const  message  =  await  VerificationMail({email:email!});
    setLoading(!loading)
      if(message === "successful"){
        await new Promise(resolve => setTimeout(resolve, 20000))
        setLoading(false)
        setResponse("Email Verification  link  has  been  resent")
      }
      else{
        await new Promise(resolve => setTimeout(resolve, 20000))
        setResponse(message!)
        setLoading(false)
      }
  } catch (error) {
      console.log(error)
      setLoading(false)
      
  }
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <Mail className="h-12 w-12 text-gray-600" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-3xl font-extrabold text-gray-900"
          >
            Check your email
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-sm text-gray-600 flex flex-col  gap-2"
          >
           <span> We&apos;ve sent a confirmation link to your email address. Please click the link to activate your account.</span>
           <span className={`${response  === "Email Verification  link  has  been  resent" ? "text-green-800 font-light" :"font-light text-red-900"}`}>{response}</span>

          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm space-y-4">
            <Button 
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => window.location.href = 'https://mail.google.com'}
            >
              Open Gmail
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-center text-gray-500 flex flex-col items-center  gap-2">
          <span>Didn&apos;t receive the email? Check your spam folder or </span>  <button onClick={resendEmailVerification} className="font-medium text-indigo-600 hover:cursor-pointer hover:text-indigo-500">{loading ? <div className='rounded-full border-2 border-solid h-4 w-4 animate-spin transition  border-indigo-500'></div>: "resend the confirmation email"}</button>.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
