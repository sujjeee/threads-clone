"use client"

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Card } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from './icons'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    useDropzone,
    type Accept,
    type FileRejection,
} from "react-dropzone";
import { toast } from 'sonner'

export default function NewThreadModal({ showIcon }: { showIcon: boolean }) {

    const [files, setFiles] = React.useState<File | undefined>(undefined)

    const [FileData, setFileData] = React.useState()

    const [previewURL, setPreviewURL] = React.useState<string | undefined>(undefined)

    const path = usePathname()
    function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
        if (textArea == null) return;
        textArea.style.height = "0";
        textArea.style.height = `${textArea.scrollHeight}px`;
    }

    const [inputValue, setInputValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>();
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea;
    }, []);

    useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current);
    }, [inputValue]);


    const maxSize = 10 * 1024 * 1024;

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

    const highlightMentions = (e: any) => {
        const inputValue = e.target.value;

        // const formattedText = inputValue.split(/(@\w+|@\w+)/).map((part: any, index: any) => {
        //     if (part.startsWith('@')) {
        //         return <span key={index} className="font-semibold text-blue-500">{part}</span>;
        //     } else {
        //         return <span key={index}>{part}</span>;
        //     }
        // });

        // console.log("formattedText", formattedText)
        setInputValue(inputValue);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                {showIcon ?
                    <div className='hover:bg-[#181818] py-5 px-8 rounded-lg transform transition-all duration-150 ease-out hover:scale-100'>
                        <Icons.create
                            className={cn(
                                "h-6 w-6",
                                path === '/create'
                                    ? "text-forground"
                                    : "text-[#4D4D4D]",
                            )}
                        />
                    </div>
                    : <div className='flex w-full my-4 '>
                        <div className='w-full flex'>
                            <div>
                                <img
                                    src='https://avatar.vercel.sh/1'
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
                        <Button size={'sm'} className='rounded-full px-4 font-semibold text-[15px]'> Post</Button>
                    </div>}
            </DialogTrigger>
            <DialogContent className='border-none bg-transparent  sm:max-w-screen-sm max-w-lg w-full shadow-none'>
                <h1 className='w-full text-center font-medium'>New Thread</h1>
                <Card className=" w-full p-0 rounded-2xl border bg-[#181818] ">
                    <div className='overflow-y-auto no-scrollbar p-6  pb-4 max-h-[70vh] '>
                        <div className="flex space-x-3">
                            <Avatar className='h-9 w-9'>
                                <AvatarImage src="https://avatar.vercel.sh/5" />
                                <AvatarFallback>JL</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col gap-1.5 w-full'>
                                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                                <textarea
                                    ref={inputRef}
                                    style={{ height: 0 }}
                                    value={inputValue}
                                    onChange={highlightMentions}
                                    className="flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words bg- w-full bg-transparent"
                                    placeholder="What's happening?"
                                />
                                {files && (
                                    <div className='my-3 overflow-hidden rounded-xl w-fit'>
                                        <img src={previewURL} alt="" className='object-contain max-h-[500px] max-w-full border' />
                                    </div>
                                )}
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <Icons.image className='h-5 w-5 mt-2 text-[#777777]  transform active:scale-75 transition-transform cursor-pointer' />
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between items-center w-full p-5'>
                        <p className='text-sm text-[#777777] tracking-normal z-50 px-2'>Anyone can reply</p>
                        <Button size={'sm'} className='rounded-full px-4 font-semibold'> Post</Button>
                    </div>
                    <DialogFooter>
                    </DialogFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
// 