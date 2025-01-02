"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux"
import { Trash2, ExternalLink, MapPin, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/file-upload"
import { addJob, updateJob, deleteJob } from "@/redux/features/jobs/jobsSlice"
import type { RootState } from "@/redux/store"
import type { Job, TodoItem, JobFile } from "@/types"
import { generateId } from "@/lib/generateId"

const formSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  salary: z.string().optional(),
  link: z.string().optional(),
  columnId: z.string().min(1, "Status is required"),
  notes: z.string().optional(),
})

interface JobDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job?: Job | null
  mode: "add" | "edit" | "view"
}

export function JobDrawer({ open, onOpenChange, job, mode }: JobDrawerProps) {
  const dispatch = useDispatch()
  const { columns, selectedColumn } = useSelector((state: RootState) => state.jobs)
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [files, setFiles] = useState<JobFile[]>([])
  const [newTodo, setNewTodo] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      position: "",
      location: "",
      salary: "",
      link: "",
      columnId: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (job && (mode === "edit" || mode === "view")) {
        form.reset({
          company: job.company,
          position: job.position,
          location: job.location || "",
          salary: job.salary || "",
          link: job.link || "",
          columnId: job.columnId,
          notes: job.notes || "",
        })
        setTodos(job.todos || [])
        setFiles(job.files || [])
      } else if (mode === "add") {
        form.reset({
          company: "",
          position: "",
          location: "",
          salary: "",
          link: "",
          columnId: selectedColumn || columns[0]?.id || "",
          notes: "",
        })
        setTodos([])
        setFiles([])
      }
      setNewTodo("")
    }
  }, [job, open, mode, form, selectedColumn, columns])

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.url.startsWith("blob:")) {
          URL.revokeObjectURL(file.url)
        }
      })
    }
  }, [files])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (mode === "add") {
      dispatch(
        addJob({
          id: generateId(),
          ...values,
          createdAt: new Date().toISOString(),
          todos,
          files,
        }),
      )
    } else if (mode === "edit" && job) {
      dispatch(
        updateJob({
          ...job,
          ...values,
          todos,
          files,
        }),
      )
    }
    onOpenChange(false)
  }

  const handleDeleteJob = () => {
    if (job) {
      files.forEach((file) => {
        if (file.url.startsWith("blob:")) {
          URL.revokeObjectURL(file.url)
        }
      })
      dispatch(deleteJob(job.id))
      onOpenChange(false)
    }
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: TodoItem = {
        id: generateId(),
        text: newTodo.trim(),
        completed: false,
      }
      setTodos([...todos, newTodoItem])
      setNewTodo("")
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTodo()
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <DrawerTitle className="sr-only">
              {mode === "add" ? "Add Job" : mode === "edit" ? "Edit Job" : "Job Details"}
            </DrawerTitle>
            <div className="flex items-center gap-2">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="columnId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mode === "view"}>
                      <SelectTrigger className="w-32 h-8 text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {columns.map((column) => (
                          <SelectItem key={column.id} value={column.id}>
                            {column.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Form>
              {(mode === "edit" || mode === "view") && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDeleteJob}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Company"
                          className="text-2xl font-semibold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent shadow-none"
                          readOnly={mode === "view"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Job title"
                          className="text-lg border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent shadow-none"
                          readOnly={mode === "view"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <Input
                              placeholder="Salary"
                              className="border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent shadow-none"
                              readOnly={mode === "view"}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <Input
                              placeholder="Location"
                              className="border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent shadow-none"
                              readOnly={mode === "view"}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <Input
                              placeholder="Link"
                              className="border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent shadow-none"
                              readOnly={mode === "view"}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Notes</h3>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Add note"
                            className="min-h-[80px] resize-none border-0 p-0 focus-visible:ring-0 placeholder:text-muted-foreground bg-transparent shadow-none"
                            readOnly={mode === "view"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">To-Dos</h3>
                  <div className="space-y-3">
                    {todos.map((todo) => (
                      <div key={todo.id} className="flex items-center gap-3">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="h-4 w-4"
                          disabled={mode === "view"}
                        />
                        <span
                          className={`flex-1 text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}
                        >
                          {todo.text}
                        </span>
                        {mode !== "view" && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {mode !== "view" && (
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 border-2 border-muted-foreground/30 rounded-sm"></div>
                        <Input
                          placeholder="Type to add todo"
                          value={newTodo}
                          onChange={(e) => setNewTodo(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground text-sm bg-transparent shadow-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Files</h3>
                  <FileUpload files={files} onFilesChange={setFiles} disabled={mode === "view"} />
                </div>

                {mode !== "view" && (
                  <Button type="submit" className="w-full">
                    {mode === "add" ? "Add Job" : "Save Changes"}
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
