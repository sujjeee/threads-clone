"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ResizeTextarea } from '@/components/ui/resize-textarea'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import { AuthorProps } from '@/types'
import { UserResource } from '@clerk/types'


interface CreateThreadProps {
    showIcon: boolean
    replyThreadInfo?: {
        id: string
        text: string
        author: AuthorProps
    }
}

const CreateThread: React.FC<CreateThreadProps> = ({ showIcon, replyThreadInfo }) => {

    const path = usePathname()
    const router = useRouter()
    const { user } = useUser()

    const [isOpen, setIsOpen] = React.useState(false)

    const [threadData, setThreadData] = React.useState({
        privacy: "Anyone can reply",
        text: "",
        images: []
    })



    const trpcUtils = api.useContext();

    const { mutate: createThread, isLoading } = api.post.createThread.useMutation({
        onSuccess: (newPost) => {
            setIsOpen(false)

            trpcUtils.post.infiniteFeed.setInfiniteData({}, (oldData) => {
                if (oldData == null || oldData.pages[0] == null) return;

                const newCachePost = {
                    ...newPost,
                    likeCount: 0,
                    likedByMe: false,
                    user: {
                        id: user?.id,
                        username: user?.username || 'sujjeeex',
                        image: user?.imageUrl || null,
                    },
                };

                return {
                    ...oldData,
                    pages: [
                        {
                            ...oldData.pages[0],
                            Posts: [newCachePost, ...oldData.pages[0].threads],
                        },
                        ...oldData.pages.slice(1),
                    ],
                };
            });
        },
        onError: (err) => {
            toast.error("PostCallbackError: Something went wrong!")
            if (err.data?.code === 'UNAUTHORIZED') {
                router.push('/login')
            }
        },
        retry: false,
    });

    const { mutate: replytoThread, isLoading: isReplying } = api.post.replyToThread.useMutation({
        onError: (err) => {
            toast.error("PostCallbackError: Something went wrong!")
            if (err.data?.code === 'UNAUTHORIZED') {
                router.push('/login')
            }
        },
        retry: false,
    });

    async function handleCreateThread() {
        if (replyThreadInfo) {
            replytoThread({
                text: threadData.text,
                threadId: replyThreadInfo.id,
            });
        } else {
            createThread({
                text: threadData.text,
            });
        }
    }

    const handleFieldChange = (textValue: string) => {
        setThreadData({
            ...threadData,
            text: textValue,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {showIcon ? (
                    !replyThreadInfo?.text ? (
                        <div
                            onClick={() => {
                                setIsOpen(true)
                            }}
                            className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
                            <Icons.create
                                className={cn(
                                    "h-6 w-6",
                                    path === '/create'
                                        ? "text-forground"
                                        : "text-[#4D4D4D]",
                                )}
                            />
                        </div>
                    ) : (
                        <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit'>
                            <Icons.reply className='w-5 h-5 ' />
                        </div>
                    )
                ) : <div
                    onClick={() => {
                        setIsOpen(true)
                    }}
                    className='flex w-full my-4 '>
                    <div className='w-full flex'>
                        <div>
                            <img
                                src={user?.imageUrl}
                                width={36}
                                height={36}
                                alt="Account Avatar"
                                className="rounded-full mr-4"
                            />
                        </div>
                        <input
                            className=" mini-scrollbar resize-none bg-transparent w-full placeholder:text-[#777777] outline-none placeholder:text-[15px]"
                            placeholder="Start a thread..."
                        />
                    </div>
                    <Button
                        disabled={threadData.text === '' || isLoading}
                        size={'sm'}
                        className='rounded-full px-4 font-semibold text-[15px]'> Post</Button>
                </div>
                }
            </DialogTrigger>
            <DialogContent className='border-none bg-transparent sm:max-w-[680px] max-w-lg w-full shadow-none select-none'>
                <h1 className='w-full text-center font-bold mb-2'>New thread</h1>
                <Card className="ring-offset-0 border-none ring-1 ring-[#393939] bg-[#181818] rounded-2xl ">
                    <div className='overflow-y-auto no-scrollbar p-6 max-h-[70vh] '>
                        {
                            replyThreadInfo &&
                            <InsideCard user={user!} onTextareaChange={handleFieldChange} replyThreadInfo={replyThreadInfo} />
                        }

                        <InsideCard user={user!} onTextareaChange={handleFieldChange} />
                    </div>
                    <div className='flex justify-between items-center w-full p-6'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className='text-[15px] text-[#777777] tracking-normal z-50 cursor-pointer select-none'>{threadData.privacy}</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className='bg-[#181818] rounded-2xl w-[190px] mt-1'>
                                <DropdownMenuItem
                                    className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-2 cursor-pointer text-[15px]'
                                    onClick={() => {
                                        setThreadData({
                                            ...threadData,
                                            privacy: "Anyone can reply",
                                        });
                                    }}
                                >
                                    Anyone
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] ' />
                                <DropdownMenuItem
                                    className='focus:bg-transparent px-4 tracking-normal  select-none font-semibold py-2 cursor-pointer text-[15px]'
                                    onClick={() => {
                                        setThreadData({
                                            ...threadData,
                                            privacy: "Profiles you follow can reply",
                                        });
                                    }}
                                >
                                    Profiles you follow
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='bg-[#393939] h-[1.2px]' />
                                <DropdownMenuItem
                                    className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-2 cursor-pointer text-[15px]'
                                    onClick={() => {
                                        setThreadData({
                                            ...threadData,
                                            privacy: "Profiles you mention can reply",
                                        });
                                    }}>
                                    Mentioned only
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            size={'sm'}
                            onClick={handleCreateThread}
                            disabled={threadData.text === '' || isLoading || isReplying}
                            className='rounded-full px-4 font-semibold'
                        >
                            {isLoading || isReplying && (
                                <Icons.spinner
                                    className="mr-2 h-4 w-4 animate-spin"
                                    aria-hidden="true"
                                />
                            )}
                            Post
                            <span className="sr-only">Post</span>
                        </Button>
                    </div>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default CreateThread




export function InsideCard({ user, onTextareaChange, replyThreadInfo }: {
    replyThreadInfo?: {
        id: string
        text: string
        author: AuthorProps
    }
    user: UserResource
    onTextareaChange: (textValue: string) => void;
}) {

    const handleResizeTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        onTextareaChange(newValue);
    };

    // console.log("is replyThreadInfo?", replyThreadInfo)
    return (
        <div className={cn('flex space-x-3',
            {
                'mt-1': !replyThreadInfo
            })}>
            <div className='relative flex flex-col items-center'>
                <Avatar className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full '>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                {replyThreadInfo?.text && <div className="h-full w-0.5 bg-muted rounded-full mt-1.5" />}
            </div>
            <div className='flex flex-col gap-1.5 w-full pb-4'>
                <p className="text-[15px] font-medium leading-none tracking-normal">sujjeee</p>
                {replyThreadInfo ? <p className='flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full tracking-normal'>
                    {replyThreadInfo.text}
                </p>
                    : <ResizeTextarea
                        name='text'
                        onChange={handleResizeTextareaChange}
                        placeholder="Start a thread..."
                    />
                }

                {!replyThreadInfo?.text &&
                    <div className='space-y-2 mt-1'>
                        <div className='text-[#777777] flex gap-1  items-center text-[15px]'>
                            <Icons.image className='h-5 w-5   transform active:scale-75 transition-transform cursor-pointer' />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
