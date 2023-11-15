"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import {
    deleteFakeUsers,
    createFakePost,
    createFakeUsers,
    createFakeNotifications
} from '@/app/_actions/seed';
import { toast } from 'sonner';
import { Icons } from '@/components/icons';

export default function page() {

    const [isLoading, setIsLoading] = React.useState<string | null>(null);

    async function handleUser() {
        try {
            setIsLoading('user');
            const res = await createFakeUsers();
            if (res) {
                toast.error("Created fake users.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(null);
        }
    }

    async function handlePost() {
        try {
            setIsLoading('post');
            const res = await createFakePost();
            if (res) {
                toast.error("Created fake posts.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(null);
        }
    }

    async function handleDeleteUsers() {
        try {
            setIsLoading('delete');
            const res = await deleteFakeUsers();
            if (res) {
                toast.error("Deleted fake users.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(null);
        }
    }

    async function handleNotification() {
        try {
            setIsLoading('notification');
            const res = await createFakeNotifications();
            if (res) {
                toast.error("Created fake notification.");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsLoading(null);
        }
    }

    return (
        <div className="h-screen items-center justify-center flex">
            <div className='max-w-sm flex  gap-3 w-full flex-col'>
                <Button
                    onClick={handleUser}
                    disabled={isLoading !== null}
                    className='w-full rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black'
                >
                    {isLoading === 'user' && (
                        <Icons.spinner
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Add 100 Users
                </Button>

                <Button
                    onClick={handlePost}
                    disabled={isLoading !== null}
                    className='w-full rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black'
                >
                    {isLoading === 'post' && (
                        <Icons.spinner
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Add Threads
                </Button>

                <Button
                    onClick={handleDeleteUsers}
                    disabled={isLoading !== null}
                    className='w-full rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black'
                >
                    {isLoading === 'delete' && (
                        <Icons.spinner
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Delete Users
                </Button>

                <Button
                    onClick={handleNotification}
                    disabled={isLoading !== null}
                    className='w-full rounded-xl bg-foreground hover:bg-foreground select-none text-white dark:text-black'
                >
                    {isLoading === 'notification' && (
                        <Icons.spinner
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Add Notifications
                </Button>
            </div>
        </div>
    )
}
