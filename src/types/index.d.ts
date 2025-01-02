export interface Column {
  id: string
  title: string
  count: number
}

export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface JobFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

export interface Job {
  id: string
  columnId: string
  company: string
  position: string
  location?: string
  salary?: string
  link?: string
  createdAt: string
  notes?: string
  todos?: TodoItem[]
  files?: JobFile[]
}



