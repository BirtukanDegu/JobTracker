"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { File, X, Download, CloudUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { JobFile } from "@/types"
import { generateId } from "@/lib/generateId"

interface FileUploadProps {
  files: JobFile[]
  onFilesChange: (files: JobFile[]) => void
  disabled?: boolean
}


function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function FileUpload({ files, onFilesChange, disabled = false }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const newFiles: JobFile[] = []

      Array.from(fileList).forEach((file) => {
        const url = URL.createObjectURL(file)

        const jobFile: JobFile = {
          id: generateId(),
          name: file.name,
          size: file.size,
          type: file.type,
          url,
          uploadedAt: new Date().toISOString(),
        }

        newFiles.push(jobFile)
      })

      onFilesChange([...files, ...newFiles])
    },
    [files, onFilesChange],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragOver(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (disabled) return

      const droppedFiles = e.dataTransfer.files
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles)
      }
    },
    [disabled, handleFiles],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [handleFiles],
  )

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  const removeFile = useCallback(
    (fileId: string) => {
      const fileToRemove = files.find((f) => f.id === fileId)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url)
      }
      onFilesChange(files.filter((f) => f.id !== fileId))
    },
    [files, onFilesChange],
  )

  const downloadFile = useCallback((file: JobFile) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : disabled
              ? "border-muted-foreground/25 cursor-not-allowed opacity-50"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
          disabled={disabled}
        />
        <CloudUpload className={`h-6 w-6 mx-auto mb-2 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
        <p className={`text-sm ${isDragOver ? "text-primary" : "text-muted-foreground"}`}>
          {isDragOver ? "Drop files here" : "Drag & drop files here, or click to select files"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => downloadFile(file)}
                  title="Download file"
                >
                  <Download className="h-3 w-3" />
                </Button>
                {!disabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(file.id)}
                    title="Remove file"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
