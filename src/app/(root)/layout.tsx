import type React from "react"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden">
      {children}
    </div>
  )
}
