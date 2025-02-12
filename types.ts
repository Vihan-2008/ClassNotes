export interface Note {
  id: number
  date: string
  title: string
  content: string
  status: string
  type: "text" | "checklist"
  location?: string
  description?: string
  additionalNotes?: string
  items?: ChecklistItem[]
}

export interface ChecklistItem {
  id: number
  text: string
  checked: boolean
}

declare global {
  interface Window {
    webkitSpeechRecognition: any
  }
}

