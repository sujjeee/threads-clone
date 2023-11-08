import React from 'react'
import { Icons } from '../icons'

export default function Reply() {
    return (
        <div className='flex items-center justify-center w-fit hover:bg-[#1E1E1E] rounded-full p-2  h-fit active:scale-95'>
            <Icons.reply className='w-5 h-5 ' />
        </div>
    )
}
