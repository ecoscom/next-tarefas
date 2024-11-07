import { HTMLProps } from "react";

export function Textarea({...rest}: HTMLProps<HTMLTextAreaElement>) {
    return (
        <textarea className="w-full resize-none h-40 rounded-lg outline-none p-2" {...rest}></textarea>
    )
}