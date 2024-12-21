"use client";
import React, { useEffect, useState } from "react";
import { SignOut } from "./actions/SignOut";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { CheckIcon, LogOut } from "lucide-react";
import Link from "next/link";
import Alert from '@mui/material/Alert';
export const Logout = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<boolean>(false);
  const [click ,setClick] =  useState(false) 

  const checkUser = async () => {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!error && user) {
      setUser(true);
      console.log(user);
      return user || null;
    }
    return error?.message;
  };

  useEffect(() => {
    checkUser();
  }, []);

   const signOut = async () => {
    setIsLoading(true);
    try {
      const response = await SignOut();
      if (response === "ok") {
        setUser(false); // Reset the user state to false after signing out
        setClick(false)
       return <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        SignedOut 
      </Alert>
      } else {
        <Alert severity="error">error signing Out..</Alert>
      }
    } catch (error: any) {
      console.error(error);
      setMessage("Error occurred during sign-out.");
    } finally {
      setIsLoading(false); // Stop loading regardless of success/failure
    }
  };

  return (
    <div className="w-full">
      {user ?(
        <Button onClick ={signOut} variant="ghost" className=" w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
        <LogOut className="mr-2 h-4 w-4" />
       <span onClick={()=>setClick(true)} className="flex flex-row  gap-2" > LogOut {click && <div className="border-2 border-black w-4 h-4  rounded-full animate-spin transition"></div>}</span>
      </Button>
      ) :(  <Button variant="ghost" className=" w-full justify-start  hover:bg-white/10 dark:hover:bg-red-950">
        <LogOut className="mr-2 h-4 w-4" />
      <Link className="text-green-900 no-underline hover:text-black flex flex-row  gap-2 " href="/login">Login</Link>
      </Button>)}
    </div>
  );
};

export default Logout;
