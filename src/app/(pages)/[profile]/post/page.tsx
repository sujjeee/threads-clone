import { redirect } from 'next/navigation'
import React from 'react'

interface pageProps {
    params: {
        profile: string
    }
}

const page: React.FC<pageProps> = ({ params }) => {
    const decodedProfile = decodeURIComponent(params.profile);
    if (decodedProfile) {
        redirect(`/${decodedProfile}`)
    }
    return <div>params page</div>
}

export default page