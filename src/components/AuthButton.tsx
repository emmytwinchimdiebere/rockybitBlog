import React from 'react'
import { Button } from './ui/button'

interface Props{
    children:React.ReactNode,
    isloading:boolean,
    className?:string
}

const AuthButton = ({children, isloading, className}:Props) => {



  return (
    <Button type="submit" className={className ?? "flex  flex-row gap-10 w-full bg-gradient-to-r from-[#240442] via-[#4a0463] to-purple-600 text-white"}>
   {children}
   {isloading ? <span className="border-t-2 border-black border-solid rounded-full w-5 h-5 animate-spin"></span> : " "}
  </Button>
  )
}

export default AuthButton