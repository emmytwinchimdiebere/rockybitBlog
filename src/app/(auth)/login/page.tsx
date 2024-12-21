import LoginForm from '@/components/LoginForm'
import bird from "../../../assets/bird.webp"
import Image from 'next/image'
export default function LoginPage({searchParams}:any) {

  return (
    <div className="min-h-screen flex">
    
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          <LoginForm />
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-[#240442] via-[#4a0463] to-purple-900 text-white">
        <div className="text-center space-y-4">
          <Image src ={bird} quality={100} alt='bird' />
        </div>
      </div>
    </div>
  )
}

