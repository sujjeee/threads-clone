import React from 'react'
import { Icons } from '@/components/icons'

export default function StarOnGithub() {
    return (
        <a href='https://github.com/sujjeee/threads-clone' target='_blank'>
            <div className='hidden xl:flex min-w-[8rem]  border border-border bg-transparent p-1 rounded-full text-[14px] py-4 px-6 text-muted-foreground shadow-lg font-medium tracking-wide hover:scale-105 active:scale-95 cursor-pointer select-none transform transition-all duration-150 ease-out'>
                <span className='flex justify-center items-center'>
                    <Icons.gitHub className='mr-2 w-4 h-4' />
                    Star on Github
                </span>
            </div>
        </a>
    )
}
