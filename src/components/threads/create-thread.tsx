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
import { AuthorInfoProps } from '@/types'
import { UserResource } from '@clerk/types'
import { Separator } from '../ui/separator'
import Username from './username'
import {
    useDropzone,
    type Accept,
    type FileRejection,
} from "react-dropzone";

import { useUploadThing } from '@/lib/uploadthing'
import { X } from 'lucide-react'

interface CreateThreadProps {
    showIcon: boolean
    replyThreadInfo?: {
        id: string
        text: string
        author: AuthorInfoProps
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

    const backupText = React.useRef('')



    const { mutate: createThread, isLoading } = api.post.createPost.useMutation({
        onMutate: async ({ text }) => {
            backupText.current = text
            setThreadData({
                ...threadData,
                text: '',
            });

            await trpcUtils.post.getInfinitePost.cancel()

            const previousPostData = trpcUtils.post.getInfinitePost.getInfiniteData()

            trpcUtils.post.getInfinitePost.setInfiniteData(
                {},
                (old) => {
                    if (!old) {
                        return {
                            pages: [],
                            pageParams: []
                        }
                    }
                    let newPages = [...old.pages]

                    let latestPage = newPages[0]!

                    latestPage.threads = [
                        {
                            id: crypto.randomUUID(),
                            createdAt: new Date(),
                            text: text,
                            author: {
                                id: crypto.randomUUID(),
                                username: user?.username!,
                                createdAt: user?.createdAt!,
                                fullname: user?.fullName!,
                                image: user?.imageUrl!,
                                isAdmin: false,
                                link: '',
                                bio: '',
                                followers: [{
                                    id: crypto.randomUUID(),
                                    image: ''
                                }]
                            },
                            parentThreadId: null,
                            count: {
                                likeCount: 0,
                                replyCount: 0
                            },
                            likes: [],
                            replies: []
                        },
                        ...latestPage.threads
                    ]

                    newPages[0] = latestPage

                    return {
                        ...old,
                        pages: newPages
                    }
                }
            )
            return {
                previousPostData: previousPostData?.pages.flatMap((page) => page.threads) ?? []
            }
        },
        onError: (_, __, context) => {
            toast.error("PostCallbackError: Something went wrong!")
        },
        onSettled: async () => {
            await trpcUtils.post.getInfinitePost.invalidate()
        },
        retry: false,
    });

    const { mutate: replytoThread, isLoading: isReplying } = api.post.replyToPost.useMutation({
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
                        <div className='flex items-center justify-center hover:bg-[#1E1E1E] rounded-full p-2 w-fit h-fit active:scale-95'>
                            <Icons.reply className='w-5 h-5 ' />
                        </div>
                    )
                ) : (
                    <div className='flex flex-col w-full'>
                        <div
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
                                className='rounded-full px-4 font-semibold text-[15px]'>
                                Post
                            </Button>
                        </div>
                        <Separator className='bg-[#333333]' />
                    </div>)}
            </DialogTrigger>
            <DialogContent className='border-none bg-transparent sm:max-w-[668px] max-w-lg w-full shadow-none select-none'>
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
        author: AuthorInfoProps
    }
    user: UserResource
    onTextareaChange: (textValue: string) => void;
}) {

    const handleResizeTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        onTextareaChange(newValue);
    };

    const [files, setFiles] = React.useState<File | undefined>(undefined)
    const [previewURL, setPreviewURL] = React.useState<string | undefined>(undefined)

    const { startUpload } = useUploadThing("postMedia")

    const maxSize = 4 * 1024 * 1024;

    const onDrop = React.useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            const acceptedFile = acceptedFiles[0];
            if (!acceptedFile) {
                alert('Please select a single file to upload.');
                return;
            }
            // @ts-ignore
            setFileData(acceptedFile)

            const fileWithPreview = Object.assign(acceptedFile, {
                preview: URL.createObjectURL(acceptedFile),
            });
            setFiles(fileWithPreview);

            const previewURL = URL.createObjectURL(acceptedFile)
            setPreviewURL(previewURL)

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ errors }) => {
                    if (errors[0]?.code === "file-too-large") {
                        toast.error(`File is too large. Max size is 1 MB`);
                        return;
                    }
                    errors[0]?.message && toast.error(errors[0].message);
                });
            }
        },
        [maxSize, setFiles]
    );
    const accept: Accept = {
        "image/*": [],
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
    })

    // console.log("is replyThreadInfo?", replyThreadInfo)
    return (
        <div className={cn('flex space-x-3',
            {
                'mt-1': !replyThreadInfo
            })}>
            <div className='relative flex flex-col items-center'>
                {replyThreadInfo
                    ?
                    <Avatar className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full '>
                        <AvatarImage src={replyThreadInfo.author.image} alt={replyThreadInfo.author.username} className='object-cover' />
                        <AvatarFallback>{replyThreadInfo.author.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    : <Avatar className='h-9 w-9 outline outline-1 outline-[#333333] rounded-full  '>
                        <AvatarImage src={user?.imageUrl} className='object-cover' />
                        <AvatarFallback>JK</AvatarFallback>
                    </Avatar>
                }
                {replyThreadInfo?.text && <div className="h-full w-0.5 bg-[#333638] rounded-full mt-1.5 my-1" />}
            </div>
            <div className='flex flex-col w-full gap-1.5 pb-4'>
                {replyThreadInfo ? (
                    <div className='flex'>
                        <Username author={replyThreadInfo?.author} />
                        {/* TODO: This is temp solution */}
                        <div className='w-3 h-3 invisible'>
                            <Icons.verified className='w-3 h-3' />
                        </div>
                    </div>
                ) : (
                    <p className="text-[15px] font-medium leading-none tracking-normal">{user.username}</p>
                )}
                {replyThreadInfo ? (
                    <>
                        <p className='flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full tracking-normal'>
                            {replyThreadInfo.text}
                        </p>
                        {previewURL && (
                            <div className='relative overflow-hidden rounded-[12px] border border-[#393939] w-fit'>
                                <img src={previewURL} alt="" className='object-contain max-h-[520px] max-w-full  rounded-[12px]' />
                                <Button
                                    onClick={() => setPreviewURL('')}
                                    variant={"ghost"}
                                    className="h-6 w-6 p-1 absolute top-2 right-2 z-50 rounded-full bg-black/80 transform active:scale-75 transition-transform cursor-pointer" >
                                    <X />
                                </Button>
                            </div>
                        )}
                    </>
                ) : <ResizeTextarea
                    name='text'
                    onChange={handleResizeTextareaChange}
                    placeholder="Start a thread..."
                />
                }

                {!replyThreadInfo?.text &&
                    <div {...getRootProps()} className='space-y-2 mt-1'>
                        <div className='text-[#777777] flex gap-1  items-center text-[15px]'>
                            <input {...getInputProps()} />
                            <Icons.image className='h-5 w-5   transform active:scale-75 transition-transform cursor-pointer' />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
