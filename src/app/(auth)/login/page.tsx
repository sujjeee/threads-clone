"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OAuthLogin from '@/components/auth/oauth-login'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function LoginForm() {
    const { user } = useUser()
    if (user) redirect('/')
    return (
        <div className='max-w-[370px] mx-auto py-16 w-full z-50 text-center'>
            <p className='text-accent-foreground font-bold select-none'>Log in with your Instagram account</p>
            <form className='w-full flex flex-col py-4 gap-1.5'>
                <Input
                    className='h-14 rounded-xl bg-[#1e1e1e] placeholder:text-[#626262] font-semibold text-[14px] tracking-normal border-[#333333] outline-none '
                    placeholder='Username, phone or email'
                    type='email' />
                <Input
                    className='h-14 rounded-xl bg-[#1e1e1e] placeholder:text-[#626262] font-semibold text-[14px] tracking-normal'
                    placeholder='Password'
                    type='password' />
                <Button className='h-14 rounded-xl py-3 my-1 font text-base font-semibold'>
                    Log in
                </Button>
            </form>
            <div className='text-center text-muted-foreground'>
                Forget password?
            </div>
            <div className='mt-6 space-y-5 '>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#333333]" />
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
