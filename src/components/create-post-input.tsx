"use client"

import React from 'react'
import useFileStore from '@/store/fileStore';
import { X } from 'lucide-react'
import Username from '@/components/user/user-username';
import { ResizeTextarea } from '@/components/ui/resize-textarea'
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/user/user-avatar';
import { useUser } from '@clerk/nextjs';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import type { ParentPostInfo } from '@/types';
import PostQuoteCard from '@/components/cards/post-quote-card';
import PostImageCard from '@/components/cards/post-image-card';
import {
    useDropzone,
    type Accept,
} from "react-dropzone";

interface CreatePostInputProps {
    isOpen: boolean
    replyThreadInfo?: ParentPostInfo | null
    onTextareaChange: (textValue: string) => void;
    quoteInfo?: Pick<ParentPostInfo, 'id' | 'text' | 'author'> & { createdAt?: Date } | null
}

const CreatePostInput: React.FC<CreatePostInputProps> = ({
    isOpen,
    replyThreadInfo,
    onTextareaChange,
    quoteInfo
}) => {
    const { user } = useUser()
    const { setSelectedFile } = useFileStore();

    const [inputValue, setInputValue] = React.useState('')

    const handleResizeTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue)
        onTextareaChange(newValue);
    };

    const [previewURL, setPreviewURL] = React.useState<string | undefined>(undefined)

    const maxSize = 4 * 1024 * 1024;

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        const acceptedFile = acceptedFiles[0];

        if (!acceptedFile) {
            alert('Selected image is too large!');
            return;
        }

        const previewURL = URL.createObjectURL(acceptedFile)
        setPreviewURL(previewURL)

        setSelectedFile(acceptedFiles);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxSize]);

    const accept: Accept = {
        "image/*": [],
    }

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept,
        maxSize,
    })

    const scrollDownRef = React.useRef<HTMLDivElement | null>(null)

    React.useEffect(() => {
        scrollDownRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        })
    }, [isOpen])

    return (
        <div className={cn('flex space-x-3', {
            'mt-1': !replyThreadInfo
        })}>

            <div className='relative flex flex-col items-center'>

                {replyThreadInfo
                    ? <UserAvatar
                        image={replyThreadInfo.author.image}
                        username={replyThreadInfo.author.username}
                        fullname={replyThreadInfo.author.fullname} />
                    : <UserAvatar
                        image={user?.imageUrl}
                        username={user?.username ?? ''}
                        fullname={user?.fullName} />
                }

                {replyThreadInfo?.text
                    && <div className="h-full w-0.5 bg-[#D8D8D8] dark:bg-[#313639] rounded-full mt-1.5 my-1" />
                }

            </div>

            <div className='flex flex-col w-full gap-1.5 pb-4'>

                {replyThreadInfo ? (
                    <div className='flex'>
                        <Username author={replyThreadInfo?.author} />

                        {/* TODO: This is temp solution to maintain layout */}
                        <div className='w-3 h-3 invisible'>
                            <Icons.verified className='w-3 h-3' />
                        </div>
                    </div>
                ) : (
                    <span className="text-[15px] font-medium leading-none tracking-normal">
                        {user?.username}
                    </span>
                )}

                {replyThreadInfo ? (
                    <>
                        <div className='flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full tracking-normal whitespace-pre-line'>
                            <div dangerouslySetInnerHTML={{
                                __html: replyThreadInfo.text.slice(1, -1).replace(/\\n/g, '\n')
                            }} />
                        </div>
                        {replyThreadInfo?.images && replyThreadInfo?.images?.length > 0 &&
                            <PostImageCard image={replyThreadInfo.images[0]} />
                        }
                    </>
                ) : (
                    <>
                        <ResizeTextarea
                            name='text'
                            value={inputValue}
                            onChange={handleResizeTextareaChange}
                            placeholder="Start a thread..."
                            maxLength={200}
                        />
                        {previewURL && (
                            <div className='relative overflow-hidden rounded-[12px] border border-border w-fit'>

                                <img
                                    src={previewURL}
                                    alt=""
                                    className='object-contain max-h-[520px] max-w-full rounded-[12px]' />
                                {/* TODO: Do this check on server side !*/}
                                {/* {!isSafeImage &&
                                    <div className='absolute top-0 left-0 w-full h-full backdrop-blur-xl flex justify-center items-center'>
                                        <EyeOff className='h-8 w-8 text-[#3b3b3b]' />
                                    </div>
                                } */}
                                <Button
                                    onClick={() => {
                                        // setIsSafeImage(true)
                                        setSelectedFile([])
                                        setPreviewURL('')
                                    }}
                                    variant={"ghost"}
                                    className="h-6 w-6 p-1 absolute top-2 right-2 z-50 rounded-full transform active:scale-75 transition-transform cursor-pointer bg-background " >
                                    <X />
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {!replyThreadInfo?.text &&
                    <div {...getRootProps()}
                        ref={scrollDownRef}
                        className='space-y-2 mt-1 select-none w-fit'>
                        <div className='text-[#777777] flex gap-1 select-none items-center text-[15px]'>
                            <input {...getInputProps()} />
                            <Icons.image className='h-5 w-5 select-none transform active:scale-75 transition-transform cursor-pointer' />
                        </div>
                    </div>
                }

                {quoteInfo &&
                    <PostQuoteCard {...quoteInfo} createdAt={quoteInfo.createdAt} />
                }
            </div>
        </div>
    )
}

export default CreatePostInput