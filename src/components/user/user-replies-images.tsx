import React from 'react'

export type UserRepliesImagesProps = {
    author: {
        id: string;
        username: string;
        image: string | null;
    }[];
};

const UserRepliesImages: React.FC<UserRepliesImagesProps> = ({ author }) => {
    return (
        <div>
            {author?.length === 1 && (
                <div className="relative z-0 flex h-4 w-4 shrink-0 select-none items-center justify-center rounded-full ring-1 ring-border">

                    <img className="h-full w-full rounded-full object-cover object-center" src={author[0]?.image ?? ''} alt={author[0]?.username} />
                </div>
            )}

            {author?.length === 2 && (
                <div className="z-0 flex items-center -space-x-2">
                    {author.map((authorData, index) => (
                        <div
                            key={index}
                            className="relative z-0 flex h-4 w-4 shrink-0 select-none items-center justify-center rounded-full ring-1 ring-border"
                        >

                            <img
                                className="h-full w-full rounded-full object-cover object-center"
                                src={authorData.image ?? ''}
                                alt={authorData.username}
                            />
                        </div>
                    ))}
                </div>
            )}

            {author?.length >= 3 && (
                <div className='relative w-[48px] h-9 left-0 top-2 '>

                    <img
                        src={author[0]?.image ?? ''}
                        alt={author[1]?.username}
                        className='absolute w-[16px] h-[16px] left-[25px] top-0 rounded-full ring-1 ring-border' />

                    <img
                        src={author[1]?.image ?? ''}
                        alt={author[1]?.username}
                        className=' absolute w-[12px] h-[12px] left-[18px] top-4 rounded-full  ring-1 ring-border' />

                    <img
                        src={author[2]?.image ?? ''}
                        alt={author[2]?.username}
                        className='absolute w-[14px] h-[14px] left-2 top-0.5 rounded-full ring-1 ring-border' />
                </div>
            )}
        </div>
    );
};

export default UserRepliesImages;




