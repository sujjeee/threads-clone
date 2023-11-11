import React from 'react'
import { Icons } from '@/components/icons'

export default function QuoteButton() {
    return (
        <div className='flex items-center justify-between w-full'>
            Quote
            <Icons.quote className='w-5 h-5 ' />
        </div>
    )
}
