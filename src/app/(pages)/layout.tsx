import SiteHeader from "@/components/layouts/site-header"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default async function PagesLayout({ children }: AuthLayoutProps) {
    return (
        <>
            <SiteHeader />
            <main>
                {children}
            </main>
        </>
    )
}
