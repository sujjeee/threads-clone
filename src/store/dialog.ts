import type { ParentPostInfo } from '@/types';
import { create } from 'zustand';

interface ToggleState {
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
    replyPostInfo: ParentPostInfo | null;
    setReplyPostInfo: (reply: ParentPostInfo | null) => void;
    quoteInfo: Pick<ParentPostInfo, 'id' | 'text' | 'author'> & { createdAt?: Date } | null
    setQuoteInfo: (quote: Pick<ParentPostInfo, 'id' | 'text' | 'author'> & { createdAt?: Date } | null) => void,
}

const useDialog = create<ToggleState>((set) => ({
    openDialog: false,
    setOpenDialog: (open) => set({ openDialog: open }),
    replyPostInfo: null,
    setReplyPostInfo: (reply) => set({ replyPostInfo: reply }),
    quoteInfo: null,
    setQuoteInfo: (quote) => set({ quoteInfo: quote })
}));

export default useDialog;