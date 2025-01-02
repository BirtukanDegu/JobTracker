import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Column, Job } from "@/types"

interface JobsState {
  columns: Column[]
  jobs: Job[]
  showAddJobDialog: boolean
  showAddColumnDialog: boolean
  selectedColumn: string | null
}

const initialState: JobsState = {
  columns: [],
  jobs: [],
  showAddJobDialog: false,
  showAddColumnDialog: false,
  selectedColumn: null,
}

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload
    },
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload
    },
    addColumn: (state, action: PayloadAction<Column>) => {
      state.columns.push(action.payload)
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload)

      // Update column count
      const column = state.columns.find((col) => col.id === action.payload.columnId)
      if (column) {
        column.count += 1
      }
    },
    moveJob: (state, action: PayloadAction<{ jobId: string; targetColumnId: string }>) => {
      const { jobId, targetColumnId } = action.payload
      const job = state.jobs.find((job) => job.id === jobId)

      if (job && job.columnId !== targetColumnId) {
        // Decrement count in source column
        const sourceColumn = state.columns.find((col) => col.id === job.columnId)
        if (sourceColumn) {
          sourceColumn.count -= 1
        }

        // Update job's column
        job.columnId = targetColumnId

        // Increment count in target column
        const targetColumn = state.columns.find((col) => col.id === targetColumnId)
        if (targetColumn) {
          targetColumn.count += 1
        }
      }
    },
    toggleAddJobDialog: (state) => {
      state.showAddJobDialog = !state.showAddJobDialog
    },
    toggleAddColumnDialog: (state) => {
      state.showAddColumnDialog = !state.showAddColumnDialog
    },
    setSelectedColumn: (state, action: PayloadAction<string>) => {
      state.selectedColumn = action.payload
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      const columnId = action.payload
      // Remove the column
      state.columns = state.columns.filter((col) => col.id !== columnId)
      // Remove all jobs in that column
      state.jobs = state.jobs.filter((job) => job.columnId !== columnId)
    },
    renameColumn: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const { id, title } = action.payload
      const column = state.columns.find((col) => col.id === id)
      if (column) {
        column.title = title
      }
    },
    reorderColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id)
      if (index !== -1) {
        // Update column counts if column changed
        const oldJob = state.jobs[index]
        if (oldJob.columnId !== action.payload.columnId) {
          const oldColumn = state.columns.find((col) => col.id === oldJob.columnId)
          const newColumn = state.columns.find((col) => col.id === action.payload.columnId)
          if (oldColumn) oldColumn.count -= 1
          if (newColumn) newColumn.count += 1
        }
        state.jobs[index] = action.payload
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      const jobId = action.payload
      const job = state.jobs.find((j) => j.id === jobId)
      if (job) {
        // Decrement column count
        const column = state.columns.find((col) => col.id === job.columnId)
        if (column) column.count -= 1
        // Remove job
        state.jobs = state.jobs.filter((j) => j.id !== jobId)
      }
    },
  },
})

export const {
  setColumns,
  setJobs,
  addColumn,
  addJob,
  moveJob,
  deleteColumn,
  renameColumn,
  reorderColumns,
  updateJob,
  deleteJob,
  toggleAddJobDialog,
  toggleAddColumnDialog,
  setSelectedColumn,
} = jobsSlice.actions

export default jobsSlice.reducer
