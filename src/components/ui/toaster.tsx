"use client"

import { Toaster as RadToaster } from "sonner"

export function Toaster() {
  return (
    <RadToaster
      className="w-max flex max-h-10 max-w-sm items-center justify-center rounded-x px-2"
      position="bottom-center"
      toastOptions={{
        style: {
          maxHeight: "50px",
          height: "fit-content",
          width: "max-content",
          fontWeight: 600,
          fontSize: 15
        },
      }}
    />
  )
}