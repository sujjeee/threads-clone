"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import { ChevronRight } from 'lucide-react'
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/use-debounce'
import { api } from '@/trpc/react'
import { usePathname, useRouter } from 'next/navigation'
import Username from '@/components/threads/username'

export default function SearchContainer() {
    const router = useRouter()
    const path = usePathname()
    const [searchValue, setSearchValue] = React.useState('')
    const debouncedSearch = useDebounce(searchValue, 2000)

    React.useEffect(() => {
        console.log("debouncedSearch?", debouncedSearch)
    }, [debouncedSearch])

    return (
        <div className={cn('absolute rounded-2xl  border border-[#333333] bg-black max-w-xl w-full mb-3 transition-transform duration-300 z-50', {
            'scale-105': searchValue !== '',
            'scale-100': searchValue === '',
        })}>
            <div className='relative w-full flex  px-3 py-2  ring-offset-background placeholder:text-muted-foreground pl-14 h-[60px]' >
                <Icons.search className="h-4 w-4 text-[#4D4D4D] absolute left-6 -translate-y-2/4 top-2/4 " />
                <input
                    value={searchValue}
                    className="resize-none text-base bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                    placeholder="Search"
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            {searchValue !== '' &&
                <div className='flex-1 max-h-[60vh] border-t border-[#333333] overflow-y-auto no-scrollbar'>
                    <div className='flex items-center w-full '>
                        <div className='mx-[30px]'>
                            <Icons.search className='h-4 w-4  text-[#4D4D4D]' />
                        </div>
                        <div
                            onClick={() => {
                                router.push(`${path}?q=${searchValue}`)
                                setSearchValue('')
                            }}
                            className='flex justify-between items-center w-full py-5 mr-6 cursor-pointer'>
                            <div className='text-base font-semibold tracking-normal '>
                                Search for <span>"{searchValue}"</span>
                            </div>
                            <ChevronRight className='h-5 w-5  ' />
                        </div>
                    </div>
                    <DisplaySearchedResults
                        debouncedSearch={debouncedSearch}
                    />
                </div>
            }
        </div>
    )
}



interface DisplaySearchedResultsProps {
    debouncedSearch: string
}

const DisplaySearchedResults: React.FC<DisplaySearchedResultsProps> = ({ debouncedSearch }) => {

    const { data, isLoading } = api.search.allUsers.useQuery({ debouncedSearch })

    if (isLoading) {
        return (
            <div className="h-[100px] w-full justify-center items-center flex ">
                <Icons.loading className='h-11 w-11' />
            </div>
        )
    }

    if (data?.length === 0) return

    return (
        <>
            {data?.map((user) => (
                <div className='flex items-center w-full '>
                    <button className='mx-5 '>
                        <div className='h-9 w-9 outline outline-1  outline-[#333333] rounded-full'>
                            <Avatar className="rounded-full w-full h-full">
                                <AvatarImage src={user.image ?? ""} alt={user.fullname ?? ''} />
                                <AvatarFallback>OG</AvatarFallback>
                            </Avatar>
                        </div>
                    </button>
                    <div className='flex justify-between items-center w-full border-t border-[#393939] py-4 mr-6'>
                        <div className='flex flex-col  '>
                            <Username author={user} />
                            <span className='text-[14px] mt-1 text-[#777777]'>
                                {user.fullname}
                            </span>
                        </div>
                        <Button
                            className='px-6  rounded-xl focus:bg-transparent hover:bg-transparent'
                            variant={'outline'}>
                            Follow
                        </Button>
                    </div>
                </div>
            ))}
        </>

    )
}
