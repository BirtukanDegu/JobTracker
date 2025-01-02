import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"
import "./globals.css"
import CustomProvider from "@/context/provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track and manage all your job applications in one place.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <CustomProvider>
          {children}
        </CustomProvider>
      </body>
    </html>
  )
}
