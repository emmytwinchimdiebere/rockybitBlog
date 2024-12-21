"use client"
import { createClient } from '@/utils/supabase/client'
import { redirect, usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Private = () => {
    const  pathname  = usePathname();
    const  [user , setUser] =  useState<object | null >({})
    const  router =  useRouter()

    const  checkUserAuth = async ()=>{
        const  supabase  = await  createClient()
        const  {error,  data:{user}} = await  supabase.auth.getUser();

        if(error &&  !user){
            return router.push(`/login?redirectTo=${pathname}`)
        }
        setUser(user)
    }
    useEffect(()=>{
    checkUserAuth()
    },[])
  
    console.log(user)
  return (
    <div>Private:{pathname}</div>
  )
}

export default Private