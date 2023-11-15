import Image from 'next/image';
import React from 'react';

export default function RootLoading() {
    const LogoImage = '/logo.png';
    const MetaImage = '/meta.png';

    return (
        <div className="flex flex-col justify-between h-screen ">
            <div className="flex-grow flex items-center justify-center ">
                <Image
                    alt="Threads"
                    src={LogoImage}
                    width={100}
                    height={100}
                    priority
                />
            </div>
            <div className='w-full  flex justify-center items-center mb-6'>
                <Image
                    priority
                    alt="Meta"
                    src={MetaImage}
                    width={90}
                    height={90}
                    className='w-auto'
                />
            </div>
        </div>
    );
}