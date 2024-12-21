"use client"

import { useState, useEffect, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle, Eye, EyeOff, Router } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { updatePassword } from '../actions/updatePassword'
import { useRouter } from 'next/navigation'

const passwordStrengthText = ['Weak', 'Fair', 'Good', 'Strong']
const passwordStrengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [resetInfo, setResetInfo] = useState(false)
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [info, setInfo] =  useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const strengthChecks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ]
    setPasswordStrength(strengthChecks.filter(Boolean).length)

    const newErrors = []
    if (password && password.length < 8) newErrors.push('Password must be at least 8 characters long')
    if (password && !/[A-Z]/.test(password)) newErrors.push('Password must contain an uppercase letter')
    if (password && !/[a-z]/.test(password)) newErrors.push('Password must contain a lowercase letter')
    if (password && !/[0-9]/.test(password)) newErrors.push('Password must contain a number')
    if (password && !/[^A-Za-z0-9]/.test(password)) newErrors.push('Password must contain a special character')
    if (confirmPassword && password !== confirmPassword) newErrors.push('Passwords do not match')
    setErrors(newErrors)
  }, [password, confirmPassword])

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const  message  =  await  updatePassword({password:password})
    if(message === "password reset sucessfull"){
      await new Promise(resolve => setTimeout(resolve, 2000))
      setInfo(message)
      setResetInfo(true)
      setIsLoading(false)
      setResetStatus(resetInfo ? "error" : "success")
      console.log(message)
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push("/success")
    }
    else{
      setIsLoading(false)
      setInfo(message)
    console.log(message)
    }
   
    console.log(message)

   
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f4]">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Reset Password</CardTitle>
            <CardDescription className="text-center text-gray-600 flex flex-col gap-2 ">
             <span>Enter your new password below to reset your account.</span> 
              <span className={`${info === "password reset sucessfull" ? "text-green-900 font-light text-[1rem]" : "text-red-800 font-light text-[1rem]"}`}>{info}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetStatus === 'idle' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Password strength:</span>
                      <span className={passwordStrength > 0 ? passwordStrengthColor[passwordStrength - 1] : ''}>
                        {passwordStrength > 0 ? passwordStrengthText[passwordStrength - 1] : 'None'}
                      </span>
                    </div>
                    <Progress value={(passwordStrength / 4) * 100} className="w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {errors.length > 0 && (
                  <ul className="text-sm text-red-500 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                  disabled={isLoading || errors.length > 0}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </motion.div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-4"
              >
                {resetStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <p className="text-xl font-semibold mb-2 text-gray-800">Password Reset Successful!</p>
                    <p className="text-gray-600">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <p className="text-xl font-semibold mb-2 text-gray-800">Password Reset Failed</p>
                    <p className="text-gray-600">
                      The password you entered does not meet the required criteria. Please try again.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <motion.a
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
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