import React from 'react'

export type RepliesProps = {
    author: {
        id: string;
        username: string;
        image: string;
    }[];
};

const RepliesImageContainer: React.FC<RepliesProps> = ({ author }) => {
    return (
        <div>
            {author.length === 1 && (
                <div className="relative z-10 flex h-5 w-5 shrink-0 select-none items-center justify-center rounded-full bg-gray-100 text-sm font-bold uppercase text-gray-800 ring ring-white">
                    <img className="h-full w-full rounded-full object-cover object-center" src={author[0]?.image} alt={author[0]?.username} />
                </div>
            )}

            {author.length === 2 && (
                <div className="z-0 flex items-center -space-x-2">
                    {author.map((authorData) => (
                        <div
                            key={authorData.id}
                            className="relative z-0 flex h-5 w-5 shrink-0 select-none items-center justify-center rounded-full bg-gray-100 text-sm font-bold uppercase text-gray-800 ring ring-white"
                        >
                            <img
                                className="h-full w-full rounded-full object-cover object-center"
                                src={authorData.image}
                                alt={authorData.username}
                            />
                        </div>
                    ))}
                </div>
            )}

            {author.length === 3 && (
                <div className='absolute w-[45px] h-[46px] left-0 top-0'>
                    {author.map((authorData, index) => (
                        <img
                            key={authorData.id}
                            src={authorData.image}
                            alt={authorData.username}
                            className={`absolute w-${index === 0 ? '6' : '5'} h-${index === 0 ? '6' : '5'} left-${index === 0 ? '21px' : index === 1 ? '18px' : '0'} top-${index === 1 ? '7' : index === 2 ? '3' : '0'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RepliesImageContainer;




