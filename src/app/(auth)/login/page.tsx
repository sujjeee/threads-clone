import OAuthLogin from '@/components/auth/oauth-login'
import LoginForm from '@/components/forms/login-form'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function LoginPage() {
    const user = await currentUser()
    if (user) redirect('/')

    return (
        <div className='max-w-[370px] mx-auto py-16 w-full z-50 text-center'>
            <LoginForm />
            <div className='text-center text-[#777777] text-[15px]'>
                Forget password?
            </div>
            <div className='mt-6 space-y-5 '>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#393939]" />
                    </div>
                    <div className="relative flex justify-center text-xs items-center">
                        <span className="bg-[#101010] px-3 text-muted-foreground text-base">
                            or
                        </span>
                    </div>
                </div>
                <OAuthLogin />
            </div>
        </div>
    )
}