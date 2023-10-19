import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ChevronRight, Github } from 'lucide-react'
import { Icons } from '../icons'

export default function LoginForm() {
    return (
        <div className='max-w-[370px] mx-auto py-16 w-full z-50 text-center'>
            <p className='text-accent-foreground font-bold'>Log in with your Instagram account</p>
            <form className='w-full flex flex-col py-4 gap-1.5'>
                <Input
                    className='h-14 rounded-xl bg-[#1e1e1e] placeholder:text-[#4b4b4b]'
                    placeholder='Username, phone or email'
                    type='email' />
                <Input
                    className='h-14 rounded-xl bg-[#1e1e1e] placeholder:text-[#4b4b4b]'
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
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs items-center">
                        <span className="bg-[#101010] px-3 text-muted-foreground text-base">
                            or
                        </span>
                    </div>
                </div>
                <Card className='bg-transparent flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none'>
                    <Icons.googleColor className='h-4 w-4 mr-2' />
                    <p>
                        Continue with Google
                    </p>
                </Card>
            </div>
        </div>
    )
}
