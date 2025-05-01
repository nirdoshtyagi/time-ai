export default function Home() {
  // Use a client-side redirect to avoid build-time errors
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.location.href = "/login"`,
      }}
    />
  )
}
