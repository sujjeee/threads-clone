"use client"

import { TriggerProps } from "@/types";
import HomeCreate from "@/components/clickables/home-create";
import Create from "@/components/buttons/create";
import Reply from "@/components/buttons/reply";
import Quote from "@/components/buttons/quote";

const Trigger: React.FC<TriggerProps> = ({ variant }) => {
    switch (variant) {
        case 'home':
            return <HomeCreate />
        case 'create':
            return <Create />
        case 'reply':
            return <Reply />
        case 'quote':
            return <Quote />
        default:
            return null;
    }
}

export default Trigger