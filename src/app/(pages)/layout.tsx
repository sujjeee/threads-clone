import SiteHeader from "@/components/layouts/site-header"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default async function PagesLayout({ children }: AuthLayoutProps) {

    const user = await currentUser()

    const dbUser = await db.user.findUnique({
        where: {
            id: user?.id
        },
        select: {
            verified: true
        }
    })

    if (!dbUser) redirect('/account?origin=/')


    return (
        <>
            <SiteHeader />
            <main>
                {children}
            </main>
        </>
    )
}
