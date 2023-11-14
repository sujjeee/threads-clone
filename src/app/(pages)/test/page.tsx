import StarOnGithub from '@/components/star-on-github'
import React from 'react'

export default function page() {
    return (
        <div className='flex w-full bg-gray-400 h-screen'>

            <div className='fixed bottom-20 left-40 '>
                <StarOnGithub />
            </div>
        </div>
    )
}
