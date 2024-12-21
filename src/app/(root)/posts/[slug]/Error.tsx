'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}

