"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ResetPassword from '../actions/resetPassword'

const  formSchema  =  z.object({
    email:z.string().email({message:"please put a valid email address"})
})
export default function ForgotPassword() {

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const  [message, setMessage] = useState<string>("")
  const {register,  handleSubmit,  formState:{errors}} =  useForm({
    defaultValues:{
        email:""
    },
    resolver:zodResolver(formSchema)
  })

  const onSubmit = async (values:z.infer<typeof formSchema>) => {

   
    setIsLoading(true)

    
    const  reset  = await ResetPassword(values)

    if (reset === "success") {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false)
      setIsSubmitted(true)
      setMessage(reset)
    }
    else{
      setIsLoading(false)
      setIsSubmitted(false)
      setMessage(reset!)
    }

   
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-white  to-[#f5f4f4]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we&apos;ll send you a link to reset your password.
              <span className={`${message ==="success" ? " text-green-900 font-light " : "text-sm  text-red-700 font-light"}`}>{message}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...register("email")}
                      aria-invalid={errors ? true : false}
                    
                    />
                    {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <svg
                  className="w-16 h-16 mx-auto text-green-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-xl font-semibold mb-2">Email Sent!</p>
                <p className="text-gray-600">
                  Check your inbox for instructions to reset your password.
                </p>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <motion.a
              href="/login"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Login
            </motion.a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}