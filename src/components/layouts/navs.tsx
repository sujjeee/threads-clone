import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '../icons'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import CreateThread from '../threads/create-thread'

export default function Navs() {
    const path = usePathname()
    const { theme, setTheme } = useTheme()

    function fillIcon(pathname: string) {
        return path === pathname ? 'white' : theme === "light" ? "white" : "#0F0F0F"
    }
    return (
        <>
            <Link href={'/'} className='hover:bg-[#1C1C1C]/80 py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90'>
                <Icons.home
                    className={cn(
                        "h-[26px] w-[26px]  text-lg",
                        path === '/'
                            ? "text-forground"
                            : "text-[#4D4D4D]",
                    )}
                    fill={fillIcon("/")}
                />
            </Link>
            <Link href={'/search'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90'>
                <Icons.search
                    className={cn(
                        "h-6 w-6 text-lg",
                        path === '/search'
                            ? "text-forground"
                            : "text-[#4D4D4D]",
                    )}
                />
            </Link>
            <CreateThread variant='create' />
            <Link href={'/activity'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90'>
                <Icons.like
                    className={cn(
                        "h-6 w-6",
                        path === '/activity'
                            ? "text-forground"
                            : "text-[#4D4D4D]",
                    )}
                    fill={fillIcon("/activity")}
                />
            </Link>
            <Link href={'/@surajguptacollege'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100 active:scale-90'>
                <Icons.profile
                    className={cn(
                        "h-6 w-6",
                        path === '/profile'
                            ? "text-forground"
                            : "text-[#4D4D4D]",
                    )}
                    fill={fillIcon("/profile")}
                />
            </Link>
        </>
    )
}