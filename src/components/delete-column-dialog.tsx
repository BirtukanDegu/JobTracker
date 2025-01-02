"use client"

import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { deleteColumn } from "@/redux/features/jobs/jobsSlice"
import type { Column } from "@/types"

interface DeleteColumnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: Column | null
}

export function DeleteColumnDialog({ open, onOpenChange, column }: DeleteColumnDialogProps) {
  const dispatch = useDispatch()

  const handleDelete = () => {
    if (column) {
      dispatch(deleteColumn(column.id))
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete this list and all containing cards?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. All jobs in this column will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
