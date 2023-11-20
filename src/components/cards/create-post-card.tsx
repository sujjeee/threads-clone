"use client"

import React from 'react'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePathname, useRouter } from 'next/navigation'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { generateReactHelpers } from "@uploadthing/react/hooks"
import useFileStore from '@/store/fileStore'
import usePost from '@/store/post'
import PostPrivacyMenu from '@/components/menus/post-privacy-menu'
import CreatePostInput from '@/components/create-post-input'
import Link from 'next/link'
import { Check } from 'lucide-react'
import NSFWFilter from 'nsfw-filter';
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from '@/components/ui/dialog'
import useDialog from '@/store/dialog'
import CreateButton from '@/components/buttons/create-button'

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

const CreatePostCard: React.FC = ({ }) => {
    const router = useRouter()
    const path = usePathname()

    const {
        openDialog,
        setOpenDialog,
        replyPostInfo,
        setReplyPostInfo,
        quoteInfo,
        setQuoteInfo,
    } = useDialog()


    const {
        selectedFile,
        setSelectedFile,
        isSelectedImageSafe
    } = useFileStore();

    const { postPrivacy } = usePost();

    const { startUpload } = useUploadThing("postImage")

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

    const { isLoading, mutateAsync: createThread } = api.post.createPost.useMutation({
        onMutate: ({ }) => {
            setThreadData({
                ...threadData,
                text: '',
            });
            // TODO: Add new optimistic update, old one is not working
        },
        onError: () => {
            toast.error("PostingError: Something went wrong!")
        },
        onSettled: async () => {
            await trpcUtils.post.getInfinitePost.invalidate()
        },
        retry: false,
    });

    const { isLoading: isReplying, mutateAsync: replyToPost } = api.post.replyToPost.useMutation({
        onError: (err) => {
            toast.error("ReplyingError: Something went wrong!")
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
        const checkUploadedImage = selectedFile[0]

        if (checkUploadedImage) {
            const isSafe = await NSFWFilter.isSafe(checkUploadedImage);

            console.log("is safe image this ", isSafe)
            if (!isSafe) {
                toast.error("Your post is not work-safe. Please revise it.")
                return
            }
        }

        const imgRes = await startUpload(selectedFile)

        const promise = replyPostInfo
            ? replyToPost({
                text: JSON.stringify(threadData.text, null, 2),
                postId: replyPostInfo.id,
                imageUrl: imgRes ? imgRes[0]?.url : undefined,
                privacy: threadData.privacy,
                postAuthor: replyPostInfo.author.id
            })
            : createThread({
                text: JSON.stringify(threadData.text, null, 2),
                imageUrl: imgRes ? imgRes[0]?.url : undefined,
                privacy: threadData.privacy,
                quoteId: quoteInfo?.id,
                postAuthor: quoteInfo?.author.id
            });

        return promise
    }

    function handleCreateThread() {
        setOpenDialog(false)
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
                            href={`/${data?.createPost.author.username}/post/${data?.createPost.id}`}
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

    React.useEffect(() => {
        if (!openDialog) {
            setThreadData({
                privacy: postPrivacy,
                text: '',
            });
            setSelectedFile([])
            setReplyPostInfo(null)
            setQuoteInfo(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openDialog]);

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>
                <CreateButton />
            </DialogTrigger>
            <DialogContent className='border-none bg-transparent sm:max-w-[668px] max-w-lg w-full shadow-none select-none outline-none'>
                <h1 className='w-full text-center font-bold mb-2 text-white'>
                    {replyPostInfo
                        ? <>Reply</>
                        : <>New thread</>
                    }
                </h1>
                <Card className="ring-offset-0 border-none ring-1 ring-[#393939] bg-background shadow-2xl dark:bg-[#181818] rounded-2xl ">
                    <div className='overflow-y-auto no-scrollbar p-6 max-h-[70vh] '>
                        {replyPostInfo &&
                            <CreatePostInput
                                isOpen={openDialog}
                                onTextareaChange={handleFieldChange}
                                replyThreadInfo={replyPostInfo}
                            />
                        }
                        <CreatePostInput
                            isOpen={openDialog}
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
