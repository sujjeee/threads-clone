import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePost from '@/store/post';

interface PostPrivacyProps { }

const PostPrivacy: React.FC<PostPrivacyProps> = ({ }) => {

    const { postPrivacy, setPostPrivacy } = usePost();

    const privacyText = {
        ['ANYONE']: 'Anyone can reply',
        ['FOLLOWED']: 'Profiles you follow can reply',
        ['MENTIONED']: 'Profiles you mention can reply'
    }

    const privacyDisplayText = React.useMemo(() => {
        return privacyText[postPrivacy];
    }, [postPrivacy])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='text-[15px] text-[#777777] tracking-normal z-50 cursor-pointer select-none outline-none'>
                    {privacyDisplayText}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className='bg-[#181818] rounded-2xl w-[190px] mt-1'>
                <DropdownMenuItem
                    className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-2 cursor-pointer text-[15px]'
                    onClick={() => setPostPrivacy('ANYONE')}
                >
                    Anyone
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-[#393939] h-[1.2px] ' />
                <DropdownMenuItem
                    className='focus:bg-transparent px-4 tracking-normal  select-none font-semibold py-2 cursor-pointer text-[15px]'
                    onClick={() => setPostPrivacy('FOLLOWED')}
                >
                    Profiles you follow
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-[#393939] h-[1.2px]' />
                <DropdownMenuItem
                    className='focus:bg-transparent px-4 tracking-normal select-none font-semibold py-2 cursor-pointer text-[15px]'
                    onClick={() => setPostPrivacy('MENTIONED')}>
                    Mentioned only
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PostPrivacy