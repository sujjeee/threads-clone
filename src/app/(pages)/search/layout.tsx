import type { Metadata } from "next"

interface PagesLayoutProps {
    children: React.ReactNode
}

export const metadata: Metadata = {
    metadataBase: new URL('https://threads.codebustar.com'),
    title: "Search",
}

export default function SearchLayout({ children }: PagesLayoutProps) {
    return (
        <>
            {children}
        </>
    )
}