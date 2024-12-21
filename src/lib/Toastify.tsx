'use client'

import React from 'react'
import { ToastContainer, toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

// Extend the ToastOptions type to include our custom properties
export interface CustomToastOptions extends ToastOptions {
  title?: string
}

// Custom toast component
export const CustomToast = ({ title, message, type }: { title: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />
  }

  //Custom notification function



  return (
    <div className="flex items-start space-x-3 p-1">
      {icons[type]}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  )
}
