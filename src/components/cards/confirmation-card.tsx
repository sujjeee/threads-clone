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
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Check } from 'lucide-react';

interface ConfirmationCardProps {
    id: string
}

const ConfirmationCard: React.FC<ConfirmationCardProps> = ({ id }) => {
    const path = usePathname()

    const trpcUtils = api.useUtils();

    const { mutateAsync: deletePost } = api.post.deletePost.useMutation({
        onError: () => {
            toast.error("DeleteError: Something went wrong!")
        },
        onSettled: async () => {
            if (path === '/') {
                await trpcUtils.post.getInfinitePost.invalidate()
            }
            await trpcUtils.invalidate()
        },
    });

    function handleDeletePost() {

        const promise = deletePost({ id })

        toast.promise(promise, {
            loading: (
                <div className='w-[270px] justify-start items-center flex p-0 gap-1.5'>
                    <div>
                        <Icons.loading className='w-8 h-8 ' />
                    </div>
                    Deleting...
                </div>
            ),
            success: () => {
                return (
                    <div className='w-[270px] justify-between items-center flex p-0 '>
                        <div className='flex justify-center items-center gap-1.5'>
                            <Check className='w-5 h-5 ' />
                            Deleted
                        </div>
                    </div>
                )
            },
            error: 'Error',
        });
    }


    return (
        <AlertDialog>
            <AlertDialogTrigger className='focus:bg-transparent px-4 tracking-normal select-none font-bold py-3 cursor-pointer text-[15px] text-red-700 focus:text-red-700 active:bg-primary-foreground   rounded-none w-full text-start'>
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent className='max-w-[280px] w-full rounded-2xl overflow-hidden border-border bg-background shadow-xl dark:bg-[#181818] p-0 gap-0'>
                <div className='w-full flex justify-center items-center py-5 text-[16px] border-b font-bold border-border'>
                    Are you sure?
                </div>
                <div className='flex justify-center items-center'>
                    <AlertDialogClose className=' w-full flex justify-center items-center py-4 border-r border-border font-semibold mt-0 focus:bg-transparent px-4 tracking-normal select-none cursor-pointer text-[15px] active:bg-primary-foreground  rounded-none'>
                        Cancel
                    </AlertDialogClose>
                    <AlertDialogDelete
                        onClick={handleDeletePost}
                        className='w-full flex justify-center text-red-600 items-center py-4 border-border font-semibold mt-0 focus:bg-transparent px-4 tracking-normal select-none cursor-pointer text-[15px]  active:bg-primary-foreground   rounded-none'>
                        Delete
                    </AlertDialogDelete>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default ConfirmationCard