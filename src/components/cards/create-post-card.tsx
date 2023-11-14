"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { useUploadThing } from '@/lib/uploadthing'
import useFileStore from '@/store/fileStore'
import usePost from '@/store/post'
import Trigger from '@/components/trigger'
import PostPrivacyMenu from '@/components/menus/post-privacy-menu'
import CreatePostInput from '@/components/create-post-input'
import Link from 'next/link'
import { Check } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    ParentPostInfo,
    PostCardProps,
    TriggerVariant
} from '@/types'

interface CreatePostCardProps {
    variant: TriggerVariant;
    replyThreadInfo?: ParentPostInfo;
    quoteInfo?: Pick<PostCardProps, 'id' | 'text' | 'author'>
}

const CreatePostCard: React.FC<CreatePostCardProps> = ({ variant, replyThreadInfo, quoteInfo }) => {
    const router = useRouter()
    const path = usePathname()
    const { postPrivacy } = usePost();

    const { selectedFile, setSelectedFile, isSelectedImageSafe } = useFileStore();

    const [isOpen, setIsOpen] = React.useState(false)

    const { startUpload } = useUploadThing("postMedia")

    const [threadData, setThreadData] = React.useState({
        privacy: postPrivacy,
        text: "",
    })

    React.useEffect(() => {
        setThreadData((prevThreadData) => ({
            ...prevThreadData,
            privacy: postPrivacy,
        }));
    }, [postPrivacy]);

    const trpcUtils = api.useUtils();

    const backupText = React.useRef('')

    const { isLoading, mutateAsync: createThread } = api.post.createPost.useMutation({
        onMutate: async ({ text }) => {
            backupText.current = text

            setThreadData({
                ...threadData,
                text: '',
            });

            // TODO: Add new optimistic update, old one is not working

        },
        onError: (_, __, context) => {
            toast.error("PostCallbackError: Something went wrong!")
        },
        onSettled: async () => {
            await trpcUtils.post.getInfinitePost.invalidate()
        },
        retry: false,
    });

    const { isLoading: isReplying, mutateAsync: replyToPost } = api.post.replyToPost.useMutation({
        onError: (err) => {
            toast.error("PostCallbackError: Something went wrong!")
            if (err.data?.code === 'UNAUTHORIZED') {
                router.push('/login')
            }
        },
        onSettled: async () => {
            if (path === '/') {
                await trpcUtils.post.getInfinitePost.invalidate()
            }
            await trpcUtils.invalidate()
        },
        retry: false,
    });


    async function handleMutation() {
        const imgRes = await startUpload(selectedFile)

        const promise = replyThreadInfo
            ? replyToPost({
                text: JSON.stringify(threadData.text, null, 2),
                postId: replyThreadInfo.id,
                imageUrl: imgRes ? imgRes[0]?.url : undefined,
                privacy: threadData.privacy,
            })
            : createThread({
                text: JSON.stringify(threadData.text, null, 2),
                imageUrl: imgRes ? imgRes[0]?.url : undefined,
                privacy: threadData.privacy,
                quoteId: quoteInfo?.id,
            });

        return promise
    }

    async function handleCreateThread() {

        setIsOpen(false)

        const promise = handleMutation()

        toast.promise(promise, {
            loading: (
                <div className='w-[270px] justify-start items-center flex p-0 gap-1.5'>
                    <div>
                        <Icons.loading className='w-8 h-8 ' />
                    </div>
                    Posting...
                </div>
            ),
            success: (data) => {
                return (
                    <div className='w-[270px] justify-between items-center flex p-0 '>
                        <div className='flex justify-center items-center gap-1.5'>
                            <Check className='w-5 h-5 ' />
                            Posted
                        </div>
                        <Link
                            href={`/${data.createPost.author.username}/post/${data.createPost.id}`}
                            className='hover:text-blue-900'>
                            View
                        </Link>
                    </div>
                )
            },
            error: 'Error',
        });
    }

    const handleFieldChange = (textValue: string) => {
        setThreadData({
            ...threadData,
            text: textValue,
        });
    };

    const createVarient = variant !== 'reply'

    React.useEffect(() => {
        if (!isOpen) {
            setThreadData({
                privacy: postPrivacy,
                text: '',
            });
            setSelectedFile([])
            console.log("reseted the daya")
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className={cn({
                "w-full": createVarient
            })}>
                <Trigger variant={variant} />
            </DialogTrigger>
            <DialogContent className='border-none bg-transparent sm:max-w-[668px] max-w-lg w-full shadow-none select-none outline-none'>
                <h1 className='w-full text-center font-bold mb-2 text-white'>
                    {createVarient
                        ? <>New thread</>
                        : <>Reply</>
                    }
                </h1>
                <Card className="ring-offset-0 border-none ring-1 ring-[#393939] bg-background shadow-2xl dark:bg-[#181818] rounded-2xl ">
                    <div className='overflow-y-auto no-scrollbar p-6 max-h-[70vh] '>
                        {replyThreadInfo &&
                            <CreatePostInput
                                isOpen={isOpen}
                                onTextareaChange={handleFieldChange}
                                replyThreadInfo={replyThreadInfo}
                            />
                        }
                        <CreatePostInput
                            isOpen={isOpen}
                            onTextareaChange={handleFieldChange}
                            quoteInfo={quoteInfo}
                        />
                    </div>
                    <div className=' flex justify-between items-center w-full p-6'>
                        <PostPrivacyMenu />
                        <Button
                            size={'sm'}
                            onClick={handleCreateThread}
                            disabled={!isSelectedImageSafe || threadData.text === '' || isLoading || isReplying}
                            className='rounded-full px-4 font-semibold bg-foreground hover:bg-foreground select-none text-white dark:text-black'
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

export default CreatePostCard
