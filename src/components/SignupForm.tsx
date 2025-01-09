'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'
import AuthButton from './AuthButton'
import SignUp from './actions/SIgnUp'
import { useRouter } from 'next/navigation'
import LoginWithGithub from './actions/LoginWithGithub'
import { LoginWithGoogle } from './actions/LoginWithGoogle'

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
})

type SignupFormValues = z.infer<typeof signupSchema>

const passwordRequirements = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[A-Z]/, label: 'At least one uppercase letter' },
  { regex: /[a-z]/, label: 'At least one lowercase letter' },
  { regex: /[0-9]/, label: 'At least one number' },
  { regex: /[^A-Za-z0-9]/, label: 'At least one special character' },
]

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })
const [isloading, setIsLoading] = useState(false);
const  [loader,  setLoader] =  useState(false)
const  [googleLoader, setGoogleLoader] = useState(false)
const router =  useRouter();
const  [message, setMessage] = useState("")
//set user informations  in database
  

const onSubmit = async  (data: SignupFormValues) => {
    setIsLoading(!isloading)
    // Handle signup logic here

   try{
    const  createuser  =  await  SignUp(data)
    console.log(createuser)
    if(createuser !== "ok"){
      router.push("/ErrorPage")
      
    }

    router.push(`/confirmEmail?email=${data?.email}`)

    
   }
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   catch(error:any){
        console.log(error)
   }
    
  }

  useEffect(() => {
    const strength = passwordRequirements.filter(req => req.regex.test(password)).length
    setPasswordStrength((strength / passwordRequirements.length) * 100)
  }, [password])

  
  const  aunthenticateWithGitHub = async ()=>{
    setLoader(true)
    try {
      const  response  = await  LoginWithGithub()
      if(response !== "unsuccessful"){
        await  new Promise((resolve)=>setTimeout(resolve,  2000));
        setLoader(false)
        setMessage("Authenticating with Github....")
        router.push(response)
      }
      else{
        await  new Promise((resolve)=>setTimeout(resolve,  2000));
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
    try {
      const  response  = await  LoginWithGoogle()
      
      if(response !== "unsuccessful"){
        await  new Promise((resolve)=>setTimeout(resolve,  2000));
        setGoogleLoader(false)
        setMessage("Authenticating with Google....")
        router.push(response!)
      }
      else{
        await  new Promise((resolve)=>setTimeout(resolve,  2000));
        setGoogleLoader(false)
        setMessage(response)
      }
    } catch (error:any) {
      console.log(error);
      throw new Error(error!)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <Button onClick={aunthenticateWithGoogle} variant="outline" className="transition active:scale-105 w-full flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoader ? <div  className='border-2  border-black rounded-full h-4 w-4  animate-spin transition'></div>:<span>Sign up with Google</span>}
          </Button>
          <Button onClick={aunthenticateWithGitHub} variant="outline" className="w-full flex items-center justify-center transition active:scale-105 space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          {loader ? <div  className='border-2  border-black rounded-full h-4 w-4  animate-spin transition'></div>:<span>Sign up with GitHub</span>}
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
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
                onChange={(e) => setPassword(e.target.value)}
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
          <div className="space-y-2">
            <Label>Password Strength</Label>
            <Progress value={passwordStrength} className="w-full" />
          </div>
          <div className="space-y-2">
            <Label>Password Requirements</Label>
            <ul className="space-y-1">
              {passwordRequirements.map((req, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {req.regex.test(password) ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={req.regex.test(password) ? 'text-green-500' : 'text-red-500'}>
                    {req.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        <AuthButton isloading  = {isloading}  >Signup</AuthButton>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

