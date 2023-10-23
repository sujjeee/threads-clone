import AccountSetupForm from '@/components/auth/account-setup-form'
import { currentUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
    const user = await currentUser()
    if (!user) redirect('/login')
    return (
        <div className='mx-auto flex flex-col gap-6 justify-center w-full max-w-lg items-center h-[95vh]'>

            <AccountSetupForm />
        </div>
    )
}
