import { PostPrivacy } from '@prisma/client';

import { create } from 'zustand';

interface PostState {
    postPrivacy: PostPrivacy;
    setPostPrivacy: (privacy: PostPrivacy) => void;
}

const usePost = create<PostState>(set => ({
    postPrivacy: PostPrivacy.ANYONE,
    setPostPrivacy: (privacy) => set({ postPrivacy: privacy })
}));

export default usePost;