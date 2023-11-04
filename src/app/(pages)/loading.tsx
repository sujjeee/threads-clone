import { Icons } from '@/components/icons'
import React from 'react'

export default function Loading() {
    return (
        <div className="h-[80vh] w-full justify-center items-center flex ">
            <Icons.loading className='h-11 w-11' />
        </div>
    )
}
