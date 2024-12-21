'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import Link from 'next/link'
import AuthButton from './AuthButton'
import SignIn from './actions/SignIn'
import { useRouter, useSearchParams} from 'next/navigation'
import LoginWithGithub from './actions/LoginWithGithub'
import { AnyARecord } from 'dns'
import { LoginWithGoogle } from './actions/LoginWithGoogle'
import LinearBuffer from './Loader'



const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] =  useState("")
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })
  const  [loading, setIsLoading] =  useState(false);
  const  [loader,  setLoader] =  useState(false)
  const  [googleLoader, setGoogleLoader] = useState(false)
  const  [click, setClick] =  useState(false)
  const router =  useRouter();
  const  searchParams = useSearchParams();
  const  redirectTo =  searchParams?.get("redirectTo")

  const  aunthenticateWithGitHub = async ()=>{
    setLoader(true)
    setClick(true)
    try {
      const  response  = await  LoginWithGithub()
      if(response !== "unsuccessful"){
        await  new Promise((resolve)=>setTimeout(resolve,  20000));
        setLoader(false)
        setMessage("Authenticating with Github....")
        setClick(false)
        router.push(response)
      }
      else{
        await  new Promise((resolve)=>setTimeout(resolve,  20000));
        setLoader(false)
        setMessage(response)
      }
    } catch (error:any) {
      console.log(error);
      throw new Error(error!)
    }
  }

  const  aunthenticateWithGoogle = async ()=>{
    setGoogleLoader(true)
    setClick(true)
    try {
      const  response  = await  LoginWithGoogle()
      
      if(response !== "unsuccessful"){
        await  new Promise((resolve)=>setTimeout(resolve,  20000));
        setGoogleLoader(false)
        setClick(false)
        setMessage("Authenticating with Google....")
       
        router.push(response!)
      }
      else{
        await  new Promise((resolve)=>setTimeout(resolve,  20000));
        setGoogleLoader(false)
        setMessage(response)
      }
    } catch (error:any) {
      console.log(error);
      throw new Error(error!)
    }
  }
  

  const onSubmit =async (data: LoginFormValues) => {
    setIsLoading(!loading)
    // Handle login logic here
    const  message  =  await  SignIn(data)

      console.log(message)
    if(message === "successful"){
      setIsLoading(loading)
      setMessage(message)
     {redirectTo ?  router?.push(`${redirectTo}`) : router.push("/")}
    }
     else{
      setMessage(message)
      setIsLoading(loading);
     }

    
  

 
  }

  return ( 
    <Card className="w-full">
 
      <CardHeader>
        {click && <LinearBuffer />}
        <CardTitle className="text-xl font-bold">Sign in</CardTitle>

        <span className='text-green-600'>{message}</span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <Button onClick={aunthenticateWithGoogle} variant="outline" className="w-full flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoader ? <div className="border-2  w-4 h-4 rounded-full border-black transition animate-spin"></div> :  <span>Sign in with Google</span>}
          </Button>
          <Button onClick={aunthenticateWithGitHub} variant="outline" className="w-full flex items-center justify-center space-x-2 active:scale-105 transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
           {loader? <div className="border-2  w-4 h-4 rounded-full border-black transition animate-spin"></div> :  <span>Sign in with GitHub</span>}
          </Button>
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register('password')}
                aria-invalid={errors.password ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        <AuthButton isloading={loading} className='w-full hover:bg-gradient-to-r transition hover:text-black hover:from-zinc-400 hover:to-gray-100 bg-gradient-to-r from-[#240442] via-[#4a0463] to-purple-600 text-white' >SignIn</AuthButton>
        </form>
        <div className="mt-4 text-center">
          <Link href="/signup" className="text-sm text-blue-600 hover:underline">
            Create an account
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        
        <Link href="/forgot-password" className="text-sm text-gray-600 hover:underline">
          Lost password ?
        </Link>
     
      </CardFooter>
    </Card>
  )
}
