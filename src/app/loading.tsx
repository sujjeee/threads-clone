import Image from 'next/image';
import React from 'react';

export default function RootLoading() {
    return (
        <div className="flex flex-col justify-between h-screen ">
            <div className="flex-grow flex items-center justify-center ">
                <Image
                    alt="Threads"
                    src='/logo.png'
                    width={100}
                    height={100}
                />
            </div>
            <div className='w-full  flex justify-center items-center mb-6'>
                <Image
                    alt="Meta"
                    src='/meta.png'
                    width={100}
                    height={100}
                />
            </div>
        </div>
    );
}