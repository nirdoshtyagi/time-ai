import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h2 className="text-4xl font-bold">404</h2>
      <h3 className="text-2xl font-semibold">Page Not Found</h3>
      <p className="text-muted-foreground">The page you are looking for doesn't exist or has been moved.</p>
      <Button asChild>
        <Link href="/">Go Home</Link>
      </Button>
    </div>
  )
}
