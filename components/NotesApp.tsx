"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, Search, Share2, Mic, MicOff, Edit, Trash2 } from "lucide-react"
import type { Note } from "../types"
import FloatingActionButton from "./FloatingActionButton"
import NoteModal from "./NoteModal"

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }

    const initializeSpeechRecognition = () => {
      if ("webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.webkitSpeechRecognition
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          setTranscript((prevTranscript) => prevTranscript + finalTranscript)
          setInterimTranscript(interimTranscript)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          if (event.error === "network") {
            setIsRecording(false)
            setInterimTranscript("Network error occurred. Please check your connection and try again.")

            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.abort()
                initializeSpeechRecognition()
              }
            }, 2000)
          }
        }

        recognitionRef.current.onend = () => {
          if (isRecording) {
            try {
              recognitionRef.current.start()
            } catch (error) {
              console.error("Failed to restart recording:", error)
              setIsRecording(false)
            }
          }
        }
      }
    }

    initializeSpeechRecognition()

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [isRecording])

  const handleSaveNote = (noteData: Omit<Note, "id" | "date" | "status">) => {
    const newNote: Note = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      status: "Just Now",
      ...noteData,
    }

    const updatedNotes = [newNote, ...notes]
    setNotes(updatedNotes)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not supported")
      return
    }

    try {
      if (isRecording) {
        recognitionRef.current.stop()
        setIsRecording(false)
        if (transcript && !transcript.includes("Network error occurred")) {
          setIsModalOpen(true)
          setEditingNote({
            id: Date.now(),
            title: "Transcribed Note",
            content: transcript,
            date: new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }),
            status: "Just Now",
            type: "text",
            description: transcript,
          })
        }
        setTranscript("")
        setInterimTranscript("")
      } else {
        recognitionRef.current.start()
        setIsRecording(true)
        setTranscript("")
        setInterimTranscript("")
      }
    } catch (error) {
      console.error("Failed to toggle recording:", error)
      setIsRecording(false)
      setInterimTranscript("Failed to start recording. Please refresh the page and try again.")
    }
  }

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  const editNote = (id: number, updatedNote: Partial<Note>) => {
    const updatedNotes = notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note))
    setNotes(updatedNotes)
    localStorage.setItem("notes", JSON.stringify(updatedNotes))
  }

  const handleShare = async (note: Note) => {
    try {
      await navigator.share({
        title: note.title,
        text: `${note.title}\nDate: ${note.date}\nTime: ${new Date().toLocaleTimeString()}\nLocation: ${note.location || "N/A"}\n\n${note.description || ""}\n\n${note.additionalNotes || ""}`,
      })
    } catch (error) {
      console.log("Sharing failed:", error)
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.additionalNotes?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="max-w-md mx-auto p-6">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-1">Hello,</h1>
          <h2 className="text-4xl font-bold">My Notes</h2>
        </div>
        <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          placeholder="Search Here"
          className="w-full bg-zinc-900 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="mb-8">
        <button
          onClick={toggleRecording}
          className={`w-full py-3 rounded-lg transition-colors ${
            isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          } text-white flex items-center justify-center`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Start Recording
            </>
          )}
        </button>
        {isRecording && (
          <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Real-time Transcription:</h3>
            <p className={`${interimTranscript.includes("error") ? "text-red-400" : "text-zinc-300"}`}>
              {transcript}
              <span className="text-zinc-500">{interimTranscript}</span>
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-zinc-900 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-zinc-400">{note.date}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsModalOpen(true)
                    setEditingNote(note)
                  }}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleShare(note)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
            {note.location && <p className="text-zinc-400 text-sm mb-2">Location: {note.location}</p>}
            {note.description && <p className="text-zinc-400 mb-2">{note.description}</p>}
            {note.additionalNotes && <p className="text-zinc-500 text-sm">{note.additionalNotes}</p>}
          </div>
        ))}
      </div>

      <FloatingActionButton
        onClick={() => {
          setEditingNote(null)
          setIsModalOpen(true)
        }}
      />

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingNote(null)
        }}
        onSave={(noteData) => {
          if (editingNote) {
            editNote(editingNote.id, noteData)
          } else {
            handleSaveNote(noteData)
          }
          setIsModalOpen(false)
          setEditingNote(null)
        }}
        initialNote={editingNote}
      />
    </div>
  )
}

