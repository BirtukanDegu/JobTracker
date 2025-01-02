"use client"

import { useDrag, useDrop } from "react-dnd"
import { MoreHorizontal, Plus } from "lucide-react"
import { useDispatch } from "react-redux"
import { useState, useRef } from "react"

import { Button } from "@/components/ui/button"
import { JobCard } from "@/components/job-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toggleAddJobDialog, setSelectedColumn, renameColumn } from "@/redux/features/jobs/jobsSlice"
import type { Column, Job } from "@/types"
import { DeleteColumnDialog } from "@/components/delete-column-dialog"
import { EditableText } from "@/components/editable-text"

interface JobColumnProps {
  column: Column
  jobs: Job[]
  index: number
  onMoveJob: (jobId: string, targetColumnId: string) => void
  onMoveColumn: (dragIndex: number, hoverIndex: number) => void
}

export function JobColumn({ column, jobs, index, onMoveJob, onMoveColumn }: JobColumnProps) {
  const dispatch = useDispatch()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Drag and drop for jobs
  const [{ isOverJob }, dropJob] = useDrop(() => ({
    accept: "job",
    drop: (item: { id: string }) => {
      onMoveJob(item.id, column.id)
    },
    collect: (monitor) => ({
      isOverJob: !!monitor.isOver(),
    }),
  }))

  // Drag and drop for column reordering
  const [{ isDragging }, dragColumn] = useDrag({
    type: "column",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropColumn] = useDrop({
    accept: "column",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        onMoveColumn(item.index, index)
        item.index = index
      }
    },
  })

  // Combine refs for drag and drop
  dragColumn(dropColumn(ref))
  dropJob(ref)

  const handleAddJob = () => {
    dispatch(setSelectedColumn(column.id))
    dispatch(toggleAddJobDialog())
  }

  const handleRenameColumn = (newTitle: string) => {
    dispatch(renameColumn({ id: column.id, title: newTitle }))
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col rounded-lg border bg-card min-w-[280px] ${
        isOverJob ? "border-primary/50 bg-muted/50" : ""
      } ${isDragging ? "opacity-50 cursor-grab" : ""}`}
    >
      <div className="flex items-center justify-between border-b p-3 cursor-grab">
        <div className="flex items-center gap-2">
          <EditableText value={column.title} onSave={handleRenameColumn} className="font-medium text-sm" />
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {column.count}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Column actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-destructive" onClick={() => setShowDeleteDialog(true)}>
              Delete Column
            </DropdownMenuItem>          
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Button
          variant="outline"
          className="flex w-full items-center justify-center gap-1 border-dashed text-muted-foreground"
          onClick={handleAddJob}
        >
          <Plus className="h-4 w-4" />
          Add card
        </Button>
        <div className="flex flex-col gap-2 pt-2 overflow-y-auto max-h-[55vh] scrollbar">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
      <DeleteColumnDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} column={column} />
    </div>
  )
}
