import React from 'react'
import { Icons } from '@/components/icons'
import useDialog from '@/store/dialog'
import type { ParentPostInfo } from '@/types'

interface ReplyButtonProps {
    replyThreadInfo: ParentPostInfo
}

const ReplyButton: React.FC<ReplyButtonProps> = ({ replyThreadInfo }) => {
    const { setOpenDialog, setReplyPostInfo } = useDialog()
    return (
        <div
            className='flex items-center justify-center w-fit hover:bg-primary rounded-full p-2  h-fit active:scale-95'
            onClick={() => {
                setOpenDialog(true)
                setReplyPostInfo(replyThreadInfo)
            }}
        >
            <Icons.reply className='w-5 h-5 ' />
        </div>
    )
}

export default ReplyButton
