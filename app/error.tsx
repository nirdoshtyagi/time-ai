"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">We apologize for the inconvenience.</p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
