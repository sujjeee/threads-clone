"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from "lucide-react"
import { useTheme } from 'next-themes'

export default function ThemeToggle() {

    const { theme, setTheme } = useTheme()

    return (
        <Button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className='rounded-full'
            variant="outline"
            size="icon">
            <Sun
                className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
            <Moon
                className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
