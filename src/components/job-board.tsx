"use client"

import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { moveJob, reorderColumns } from "@/redux/features/jobs/jobsSlice"
import { JobColumn } from "@/components/job-column"

export function JobBoard() {
  const dispatch = useDispatch()
  const { columns, jobs } = useSelector((state: RootState) => state.jobs)

  const handleMoveJob = useCallback(
    (jobId: string, targetColumnId: string) => {
      dispatch(moveJob({ jobId, targetColumnId }))
    },
    [dispatch],
  )

  const handleMoveColumn = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newColumns = [...columns]
      const draggedColumn = newColumns[dragIndex]
      newColumns.splice(dragIndex, 1)
      newColumns.splice(hoverIndex, 0, draggedColumn)
      dispatch(reorderColumns(newColumns))
    },
    [columns, dispatch],
  )

  return (
    <div className="flex gap-4 p-4 md:p-6 mt-44 md:mt-24 overflow-x-auto overflow-y-hidden scrollbar">
      {columns.map((column, index) => {
        const columnJobs = jobs.filter((job) => job.columnId === column.id)

        return (
          <JobColumn
            key={column.id}
            column={column}
            jobs={columnJobs}
            index={index}
            onMoveJob={handleMoveJob}
            onMoveColumn={handleMoveColumn}
          />
        )
      })}
    </div>
  )
}
