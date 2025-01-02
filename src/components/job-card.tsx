"use client"

import { useDrag } from "react-dnd"
import { MoreHorizontal } from "lucide-react"
import { useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Job } from "@/types"
import { JobDrawer } from "@/components/job-drawer"
import { useDispatch } from "react-redux"
import { deleteJob } from "@/redux/features/jobs/jobsSlice"

interface JobCardProps {
  job: Job
}

// Simple date formatting function to replace date-fns
function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "today"
  if (diffInDays === 1) return "1 day ago"
  if (diffInDays < 30) return `${diffInDays} days ago`

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths === 1) return "1 month ago"
  return `${diffInMonths} months ago`
}

export function JobCard({ job }: JobCardProps) {
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState<"view" | "edit">("view")  

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "job",
    item: { id: job.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const attachRef = (el: HTMLDivElement | null) => {
    ref.current = el
    drag(el)
  }  

  const handleDeleteJob = () => {
    if (job) {
      dispatch(deleteJob(job.id))
    }
  }

  return (
    <>
      <Card ref={attachRef} className={`cursor-grab ${isDragging ? "opacity-50" : ""}`}>
        <CardHeader className="p-3 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{job.position}</h4>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Job actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setDrawerMode("edit")
                    setShowDrawer(true)
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive" onClick={handleDeleteJob}>Delete Job</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <p className="text-xs text-muted-foreground">{job.location}</p>
        </CardContent>
        <CardFooter className="p-3 pt-0">
          <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
            {formatDistanceToNow(new Date(job.createdAt))}
          </div>
        </CardFooter>
      </Card>
      <JobDrawer open={showDrawer} onOpenChange={setShowDrawer} job={job} mode={drawerMode} />
    </>
  )
}
