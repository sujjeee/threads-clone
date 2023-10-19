import React from 'react'

export default function Banner() {
    return (
        <header className="max-w-screen-md  md:max-w-screen-2xl lg:max-w-[1800px] mx-auto">
            <nav className='flex w-full justify-between items-center z-50'>
                <img
                    src="/bg.webp"
                    alt="bg"
                    className='w-full object-cover h-[500px] '
                />
            </nav>
        </header>
    )
}

