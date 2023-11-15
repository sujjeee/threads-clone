"use client"

import { api } from "@/trpc/react"
import { useParams } from "next/navigation"
import Loading from "@/app/(pages)/loading"
import NotFound from "@/app/not-found"
import UserProfile from "@/components/user/user-details"

interface PagesLayoutProps {
    children: React.ReactNode
}

export default function ProfileLayout({ children }: PagesLayoutProps) {

    const params = useParams()
    const profile = params.profile as string
    const username = decodeURIComponent(profile).substring(1)

    const { data, isLoading, isError } = api.user.Info.useQuery({ username })

    if (isLoading) return <Loading />
    if (isError) return <NotFound />

    return (
        <>
            <UserProfile {...data.userDetails} />
            {children}
        </>
    );
}
