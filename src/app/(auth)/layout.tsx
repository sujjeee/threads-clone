
import Banner from "@/components/banner"
import SiteFooter from "@/components/layouts/site-footer"
import { Card } from "@/components/ui/card"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {

    return (
        <>
            <div className="bg-[#101010] h-screen">
                <Banner />
                <div className="absolute z-50  -translate-x-2/4 -translate-y-[40%] left-2/4 top-2/4 w-full px-4 sm:px-0">
                    {children}
                </div>
                <SiteFooter />
            </div>
            <div className="fixed right-10 bottom-10 flex flex-col justify-center items-center gap-5 z-50">
                <p className="text-muted-foreground text-xs tracking-wide">Scan to get the app</p>
                <Card className='cursor-pointer border-[none] z-50 rounded-2xl p-2.5 bg-[#181818] transform active:scale-95 transition-transform select-none' >
                    <object data="threads.svg" width="150" height="150" />
                </Card>
            </div>
        </>
    )
}
