"use client"

import React from 'react'
import {
    useSignIn
} from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Icons } from '@/components/icons'
import { catchClerkError } from '@/lib/utils'

const OAuthLogin: React.FC = ({ }) => {
    const [isLoading, setIsLoading] = React.useState<boolean | null>(null)
    const { signIn, isLoaded: signInLoaded } = useSignIn()

    async function oauthSignIn() {
        if (!signInLoaded) return null
        try {
            setIsLoading(true)
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/",
            })
        } catch (error) {
            setIsLoading(false)
            catchClerkError(error)
        }
    }
    return (
        <Button
            aria-label={`Continue with Google`}
            variant="outline"
            className="bg-transparent flex justify-center items-center py-5 px-3 rounded-xl transform active:scale-95 transition-transform cursor-pointer select-none h-16 w-full text-base hover:bg-transparent border-[#333333] text-white hover:text-white"
            onClick={() => void oauthSignIn()}
            disabled={isLoading !== null}
        >
            {isLoading ? (
                <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                />
            ) : (
                <Icons.googleColor className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Continue with Google
        </Button>
    )
}

export default OAuthLogin