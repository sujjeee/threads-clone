"use client"

import { TriggerProps } from "@/types";
import HomeCreate from "@/components/clickables/home-create";
import CreateButton from "@/components/buttons/create-button";
import Reply from "@/components/buttons/reply-button";
import Quote from "@/components/buttons/quote-button";

const Trigger: React.FC<TriggerProps> = ({ variant }) => {
    switch (variant) {
        case 'home':
            return <HomeCreate />
        case 'create':
            return <CreateButton />
        case 'reply':
            return <Reply />
        case 'quote':
            return <Quote />
        default:
            return null;
    }
}

export default Trigger