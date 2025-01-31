"use client"

import { ReactNode } from "react"

export default function IsNotIframe({children}: {children: ReactNode}) {
    const isIframe = typeof window !== 'undefined' && window.self !== window.top;
    return(
        !isIframe && children
    )
}