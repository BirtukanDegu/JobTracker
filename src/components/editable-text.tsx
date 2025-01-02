"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface EditableTextProps {
  value: string
  onSave: (value: string) => void
  className?: string
}

export function EditableText({ value, onSave, className = "" }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    if (text.trim() !== "" && text !== value) {
      onSave(text.trim())
    } else {
      setText(value)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (text.trim() !== "" && text !== value) {
        onSave(text.trim())
      } else {
        setText(value)
      }
      setIsEditing(false)
    } else if (e.key === "Escape") {
      setText(value)
      setIsEditing(false)
    }
  }

  return isEditing ? (
    <Input
      ref={inputRef}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`h-auto border-0 px-0 focus-visible:ring-1 focus-visible:ring-ring min-w-[100px] ${className}`}
    />
  ) : (
    <span
      onDoubleClick={handleDoubleClick}
      className={`cursor-pointer hover:bg-muted/50 rounded px-1 py-0.5 -mx-1 -my-0.5 ${className}`}
      title="Double-click to edit"
    >
      {value}
    </span>
  )
}
