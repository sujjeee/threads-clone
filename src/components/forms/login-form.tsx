"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { catchClerkError, cn } from "@/lib/utils"
import { authSchema } from "@/lib/validations/auth"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form"
import { Icons } from '@/components/icons'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const router = useRouter()
    type Inputs = z.infer<typeof authSchema>

    const { isLoaded, signIn, setActive } = useSignIn()
    const [isPending, startTransition] = React.useTransition()

    // react-hook-form
    const form = useForm<Inputs>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })


    function onSubmit(data: Inputs) {
        if (!isLoaded) return

        startTransition(async () => {
            try {
                const result = await signIn.create({
                    identifier: data.identifier,
                    password: data.password,
                })

                if (result.status === "complete") {
                    await setActive({ session: result.createdSessionId })
                    router.push(`${window.location.origin}/`)
                } else {
                    toast.error("Sorry, something went wrong. Please try again, or refresh the page.")
                }
            } catch (err) {
                catchClerkError(err)
            }
        })
    }

    return (
        <div>
            <span className='text-white font-bold select-none'>Log in with your Instagram account</span>

            <Form {...form}>
                <form
                    className="w-full flex flex-col py-4 gap-1.5 text-start"
                    onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
                >

                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field, formState }) => {
                            const error = formState.errors.identifier
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            autoFocus
                                            className={cn('h-14 rounded-xl bg-[#1e1e1e] text-[15px] placeholder:text-[#777777] font-medium tracking-normal outline-none ring-0  focus-visible:ring-offset-0 min-h-min border-none focus-visible:ring-1 focus-visible:ring-[#393939] dark:focus-visible:ring-[#393939] px-4 text-white', {
                                                "focus-visible:ring-red-700 placeholder:text-red-700 dark:focus-visible:ring-red-700": error
                                            })}
                                            placeholder={error ? error.message : 'Username, phone or email'}
                                            type='text'
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, formState }) => {
                            const error = formState.errors.password
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className={cn('h-14 rounded-xl bg-[#1e1e1e]  text-[15px] placeholder:text-[#777777] font-medium  tracking-normal outline-none ring-0  focus-visible:ring-offset-0 min-h-min border-none focus-visible:ring-1 focus-visible:ring-[#393939] px-4 dark:focus-visible:ring-[#393939] text-white', {
                                                "focus-visible:ring-red-700 placeholder:text-red-700 dark:focus-visible:ring-red-700": error
                                            })}
                                            placeholder={error ? error.message : "Password"}
                                            type='password'
                                            {...field} />
                                    </FormControl>
                                </FormItem>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        disabled={isPending}
                        className='h-14 rounded-xl my-1 font text-base font-semibold bg-white hover:bg-white text-black'>

                        {isPending ? (
                            <Icons.loading
                                className="h-10 w-10"
                                aria-hidden="true"
                            />
                        ) : (
                            'Log in'
                        )}
                        <span className="sr-only">Sign in</span>
                    </Button>
                </form>
            </Form>
        </div>
    )
}
