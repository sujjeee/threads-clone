import React from 'react'
import { Icons } from '@/components/icons'
import type { PostCardProps } from '@/types'
import useDialog from '@/store/dialog'

interface QuoteButtonProps {
    quoteInfo: Pick<PostCardProps, 'id' | 'text' | 'author'> & { createdAt?: Date }
}

const QuoteButton: React.FC<QuoteButtonProps> = ({ quoteInfo }) => {
    const { setOpenDialog, setQuoteInfo } = useDialog()
    return (
        <div
            className='flex items-center justify-between w-full'
            onClick={() => {
                setOpenDialog(true)
                setQuoteInfo(quoteInfo)
            }}
        >
            Quote
            <Icons.quote className='w-5 h-5 ' />
        </div>
    )
}

export default QuoteButton