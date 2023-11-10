"use client"

import React from 'react'
import {
    AlertDialog,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDelete,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { api } from '@/trpc/react';
import { toast } from 'sonner';

interface AreYouSureProps {
    id: string
}

const AreYouSure: React.FC<AreYouSureProps> = ({ id }) => {

    const trpcUtils = api.useUtils();

    const { mutate: deletePost } = api.post.deletePost.useMutation({
        onSuccess: async () => {
            await trpcUtils.post.getInfinitePost.invalidate()
        },
        onError: () => {
            toast.error("PostCallbackError: Something went wrong!")
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger className='focus:bg-transparent px-4 tracking-normal select-none font-bold py-3 cursor-pointer text-[15px] text-red-700 focus:text-red-700 active:bg-primary-foreground   rounded-none w-full text-start'>
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent className='max-w-[280px] w-full rounded-2xl overflow-hidden border-border bg-background p-0 gap-0'>
                <div className='w-full flex justify-center items-center py-5 text-[16px] border-b font-bold border-border'>
                    Are you sure?
                </div>
                <div className='flex justify-center items-center'>
                    <AlertDialogClose className=' w-full flex justify-center items-center py-4 border-r border-border font-semibold mt-0 focus:bg-transparent px-4 tracking-normal select-none cursor-pointer text-[15px] active:bg-primary-foreground  rounded-none'>
                        Cancel
                    </AlertDialogClose>
                    <AlertDialogDelete
                        onClick={() => deletePost({ id })}
                        className='w-full flex justify-center text-red-600 items-center py-4 border-border font-semibold mt-0 focus:bg-transparent px-4 tracking-normal select-none cursor-pointer text-[15px]  active:bg-primary-foreground   rounded-none'>
                        Delete
                    </AlertDialogDelete>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default AreYouSure