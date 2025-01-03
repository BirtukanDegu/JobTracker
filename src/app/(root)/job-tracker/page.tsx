"use client"

import { useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useDispatch, useSelector } from "react-redux"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { JobBoard } from "@/components/job-board"
import { JobDrawer } from "@/components/job-drawer"
import { AddColumnDialog } from "@/components/add-column-dialog"
import {
  setColumns,
  setJobs,
  toggleAddJobDialog,
  toggleAddColumnDialog,
} from "@/redux/features/jobs/jobsSlice"
import type { RootState } from "@/redux/store"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/context/themeContext"

export default function Dashboard() {
  const dispatch = useDispatch()
  const { showAddJobDialog, showAddColumnDialog } = useSelector((state: RootState) => state.jobs)
  const { theme } = useTheme();

  useEffect(() => {
    dispatch(
      setColumns([
        { id: "wishlist", title: "Wishlist", count: 2 },
        { id: "applied", title: "Applied", count: 1 },
        { id: "interview", title: "Interview", count: 0 },
        { id: "offer", title: "Offer", count: 0 },
        { id: "rejected", title: "Rejected", count: 0 },
      ]),
    )

    dispatch(
      setJobs([
        {
          id: "job1",
          columnId: "wishlist",
          company: "Acme Inc",
          position: "Frontend Developer",
          location: "Remote",
          salary: "$90,000",
          link: "https://example.com/job1",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 24).toISOString(),
          notes: "Interesting position with good benefits",
          todos: [
            { id: "todo1", text: "Update resume", completed: true },
            { id: "todo2", text: "Prepare for interview", completed: false },
          ],
        },
        {
          id: "job2",
          columnId: "wishlist",
          company: "Tech Solutions",
          position: "UX Designer",
          location: "New York, NY",
          salary: "$85,000",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 24).toISOString(),
          notes: "Need to update portfolio before applying",
          todos: [],
        },
        {
          id: "job3",
          columnId: "applied",
          company: "Global Systems",
          position: "Full Stack Developer",
          location: "San Francisco, CA",
          salary: "$120,000",
          link: "https://example.com/job3",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 24).toISOString(),
          notes: "Applied through company website",
          todos: [{ id: "todo3", text: "Follow up after 1 week", completed: false }],
        },
      ]),
    )
  }, [dispatch])

  return (
    <main className="flex flex-col">
      <div className="fixed w-full px-4 py-3 md:px-6 md:py-4 bg-background z-50 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link href="/">
              <Image
                src={theme === "dark" ? "/logo-white.svg" : "/logo.svg"}
                width={80}
                height={80}
                alt="logo"
                className="size-12 text-white"
              />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Job Tracker</h1>
              <p className="text-sm text-muted-foreground">
                Track and manage all your job applications in one place.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => dispatch(toggleAddColumnDialog())}>
              <Plus className="mr-2 size-4" />
              Add Column
            </Button>
            <Button size="sm" onClick={() => dispatch(toggleAddJobDialog())}>
              <Plus className="mr-2 size-4" />
              Add Job
            </Button>
            <Button variant="ghost" size="icon">
              <ThemeToggle />
              <span className="sr-only">Theme toggle</span>
            </Button>
          </div>

        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <JobBoard />
      </DndProvider>

      <JobDrawer open={showAddJobDialog} onOpenChange={() => dispatch(toggleAddJobDialog())} mode="add" />

      <AddColumnDialog open={showAddColumnDialog} onOpenChange={() => dispatch(toggleAddColumnDialog())} />
    </main>
  )
}
