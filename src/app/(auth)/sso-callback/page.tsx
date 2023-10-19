import { type HandleOAuthCallbackParams } from "@clerk/types"
import SSOCallback from "@/components/auth/sso-callback"

export interface SSOCallbackPageProps {
    searchParams: HandleOAuthCallbackParams
}

export default function SSOCallbackPage({
    searchParams,
}: SSOCallbackPageProps) {
    return (
        <div className="h-[90vh] flex justify-center items-center">
            <SSOCallback searchParams={searchParams} />
        </div>
    )
}