import { CustomToastOptions } from "./Toastify"
import React from 'react'
import { ToastContainer, toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { CustomToast } from "./Toastify"



export const CustomToastContainer = () => (
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    toastClassName="rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden"
  />
)


export const notify = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', options?: CustomToastOptions) => {
    toast(<CustomToast title={title} message={message} type={type} />, {
      ...options,
      className: `${options?.className || ''} bg-white dark:bg-gray-800 shadow-lg rounded-lg`,
      progressClassName: 'bg-gradient-to-r from-green-500 to-blue-500',
    })
  }