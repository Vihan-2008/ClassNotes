"use client"

import { useState, useEffect } from "react"
import AudioRecorder from "./AudioRecorder"
import NotesList from "./NotesList"
import type { Note } from "../types"

export default function ClassroomNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  const addNote = (text: string) => {
    const newNote: Note = { id: Date.now(), text }
    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  return (
    <div>
      <AudioRecorder onTranscriptionReady={addNote} />
      <NotesList notes={notes} onDelete={deleteNote} />
    </div>
  )
}

