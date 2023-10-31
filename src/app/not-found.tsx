"use client"

import SiteFooter from '@/components/layouts/site-footer'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
    return (
        <>
            <div className="flex flex-col justify-between h-screen ">
                <div className="flex-grow flex px-4 flex-col gap-4 items-center justify-center ">
                    <h4 className="scroll-m-20 text-[16px] font-bold tracking-normal">
                        Sorry, this page isn't available
                    </h4>
                    <p className="text-[15px] text-[#777777] max-w-[350px] w-full text-center">The link you followed may be broken, or the page may have been removed.</p>
                    <Button asChild
                        className='rounded-xl px-4'
                        variant={'outline'}
                        size={'sm'}>
                        <Link href={'/'}>
                            Back
                        </Link>
                    </Button>
                </div>
            </div>
            {/* <SiteFooter /> */}
        </>
    )
}
