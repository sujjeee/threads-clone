
import Banner from "@/components/banner"

interface AuthLayoutProps {
    children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {

    return (
        <div>
            <Banner />
            <main>
                <div className="absolute z-50  -translate-x-2/4 -translate-y-[40%] left-2/4 top-2/4 w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
