import * as React from "react"

import { cn } from "@/lib/utils"

/* eslint-disable @typescript-eslint/no-empty-interface */

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const ResizeTextarea: React.FC<TextareaProps> = ({ className, ...props }) => {

    function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
        if (textArea == null) return;
        textArea.style.height = "0";
        textArea.style.height = `${textArea.scrollHeight}px`;
    }

    const textAreaRef = React.useRef<HTMLTextAreaElement>();
    const inputRef = React.useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaSize(textArea);
        textAreaRef.current = textArea;
    }, []);

    React.useLayoutEffect(() => {
        updateTextAreaSize(textAreaRef.current);
    }, [props.value]);

    return (
        <textarea
            style={{ height: 0 }}
            className={cn(
                "flex-grow resize-none overflow-hidden outline-none text-[15px] text-accent-foreground break-words placeholder:text-[#777777] w-full bg-transparent tracking-normal",
                className
            )}
            ref={inputRef}
            {...props}
        />
    )
}

ResizeTextarea.displayName = "ResizeTextarea"

export { ResizeTextarea }