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
            <Link href={'/'} className='hover:bg-[#181818] py-5 px-8 rounded-xl'>
                <Icons.home
                    className={cn(
                        "h-6 w-6",
                        path === '/'
                            ? "text-forground"
                            : "text-[#B8B8B8]",
                    )}
                    fill={fillIcon("/")}
                />
            </Link>
            <Link href={'/search'} className='hover:bg-[#181818] py-5 px-8 rounded-xl'>
                <Icons.search
                    className={cn(
                        "h-6 w-6",
                        path === '/search'
                            ? "text-forground"
                            : "text-[#B8B8B8]",
                    )}
                />
            </Link>
            <Link href={'/create'} className='hover:bg-[#181818] py-5 px-8 rounded-xl'>
                <Icons.create
                    className={cn(
                        "h-6 w-6",
                        path === '/create'
                            ? "text-forground"
                            : "text-[#B8B8B8]",
                    )}
                />
            </Link>
            <Link href={'/like'} className='hover:bg-[#181818] py-5 px-8 rounded-xl'>
                <Icons.like
                    className={cn(
                        "h-6 w-6",
                        path === '/like'
                            ? "text-forground"
                            : "text-[#B8B8B8]",
                    )}
                    fill={fillIcon("/like")}
                />
            </Link>
            <Link href={'/profile'} className='hover:bg-[#181818] py-5 px-8 rounded-xl'>
                <Icons.profile
                    className={cn(
                        "h-6 w-6",
                        path === '/profile'
                            ? "text-forground"
                            : "text-[#B8B8B8]",
                    )}
                    fill={fillIcon("/profile")}
                />
            </Link>
        </div>
    )
}