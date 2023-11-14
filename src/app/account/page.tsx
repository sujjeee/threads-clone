import { generateUsername } from '@/app/_actions/generate-username'
import AccountSetupForm from '@/components/auth/account-setup-form'
import { getUserEmail } from '@/lib/utils'
import { db } from '@/server/db'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function AccountPage() {

    const user = await currentUser()

    if (!user) redirect('/login')

    const email = getUserEmail(user)

    const isVerified = await db.user.findUnique({
        where: {
            email,
            verified: true
        },
    })

    if (isVerified) redirect('/')

    const username = await generateUsername(user) ?? '';

    return (
        <div className='mx-auto flex flex-col gap-6 justify-center w-full max-w-lg items-center h-[95vh]'>
            <AccountSetupForm username={username} />
        </div>
    )
}