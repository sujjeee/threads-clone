"use client"

import type { TriggerProps } from "@/types";
import CreateWithInput from "@/components/create-with-input";
import CreateButton from "@/components/buttons/create-button";
import ReplyButton from "@/components/buttons/reply-button";
import QuoteButton from "@/components/buttons/quote-button";

const Trigger: React.FC<TriggerProps> = ({ variant }) => {
    switch (variant) {
        case 'home':
            return <CreateWithInput />
        case 'create':
            return <CreateButton />
        case 'reply':
            return <ReplyButton />
        case 'quote':
            return <QuoteButton />
        default:
            return null;
    }
}

export default Trigger