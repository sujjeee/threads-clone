import LoginForm from '@/components/forms/login-form'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function LoginPage() {
    const user = await currentUser()
    if (user) redirect('/')
    return (
        <div className='z-50 w-full'>
            <LoginForm />
        </div>
    )
}