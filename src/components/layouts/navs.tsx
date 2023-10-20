import React from 'react'
import Link from 'next/link'
import useWindow from '@/hooks/use-window'
import { usePathname } from 'next/navigation'
import { Icons } from '../icons'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

export default function Navs() {
    const path = usePathname()
    const { theme, setTheme } = useTheme()

    function fillIcon(pathname: string) {
        return path === pathname ? 'white' : theme === "light" ? "white" : "#0F0F0F"
    }
    return (
        <div className='flex justify-center items-center gap-2'>
            <Link href={'/'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
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
            <Link href={'/search'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
                <Icons.search
                    className={cn(
                        "h-6 w-6 text-lg",
                        path === '/search'
                            ? "text-forground"
                            : "text-[#4D4D4D]",
                    )}
                />
            </Link>
            <Link href={'/create'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
                <Icons.create
                    className={cn(
                        "h-6 w-6",
                        path === '/create'
                            ? "text-forground"
                            : "text-[#4D4D4D]",
                    )}
                />
            </Link>
            <Link href={'/like'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
                <Icons.like
                    className={cn(
                        "h-6 w-6",
                        path === '/like'
                            ? "text-forground"
                            : "text-[#4D4D4D]",
                    )}
                    fill={fillIcon("/like")}
                />
            </Link>
            <Link href={'/profile'} className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
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
        </div>
    )
}