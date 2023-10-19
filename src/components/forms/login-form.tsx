import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ChevronRight, Github } from 'lucide-react'

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
            <div className='mt-6 space-y-4 '>
                <p className='text-muted-foreground'>or</p>
                <Card className='bg-transparent flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none'>
                    <Github className='h-5 w-5 mr-2' />
                    <p>
                        Continue with Google
                    </p>
                </Card>
            </div>
        </div>
    )
}
