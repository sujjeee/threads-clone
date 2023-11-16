import type { Metadata } from "next"

interface PagesLayoutProps {
    children: React.ReactNode
}

export const metadata: Metadata = {
    metadataBase: new URL('https://threads.codebustar.com'),
    title: "Activity",
}

export default function ActivityLayout({ children }: PagesLayoutProps) {
    return (
        <>
            {children}
        </>
    )
}
