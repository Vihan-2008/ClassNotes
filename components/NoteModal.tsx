"use client"

import { useState, useEffect } from "react"
import { X, Bold, Italic, Underline, Strikethrough, List, AlignLeft, Type } from "lucide-react"
import type { Note } from "../types"
import type React from "react" // Added import for React

interface NoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: Omit<Note, "id" | "date" | "status">) => void
  initialNote?: Note | null
}

export default function NoteModal({ isOpen, onClose, onSave, initialNote }: NoteModalProps) {
  const [title, setTitle] = useState(initialNote?.title || "")
  const [content, setContent] = useState(initialNote?.content || "")
  const [location, setLocation] = useState(initialNote?.location || "")
  const [description, setDescription] = useState(initialNote?.description || "")
  const [notes, setNotes] = useState(initialNote?.additionalNotes || "")
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title)
      setContent(initialNote.content)
      setLocation(initialNote.location || "")
      setDescription(initialNote.description || "")
      setNotes(initialNote.additionalNotes || "")
    } else {
      setTitle("")
      setContent("")
      setLocation("")
      setDescription("")
      setNotes("")
    }
  }, [initialNote])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      content,
      location,
      description,
      additionalNotes: notes,
      type: "text",
    })
    setTitle("")
    setContent("")
    setLocation("")
    setDescription("")
    setNotes("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold">{initialNote ? "Edit Note" : "New Note"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-xl font-semibold"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Time</label>
                <input
                  type="text"
                  className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  defaultValue={currentTime}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Location</label>
              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Description</label>
              <textarea
                placeholder="Add a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1">Notes</label>
              <textarea
                placeholder="Additional notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[100px]"
              />
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4 mt-4">
            <div className="flex items-center gap-2 mb-4 p-2 bg-zinc-800 rounded-lg">
              <button type="button" className="p-2 hover:bg-zinc-700 rounded transition-colors">
                <Bold className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-zinc-700 rounded transition-colors">
                <Italic className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-zinc-700 rounded transition-colors">
                <Underline className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-zinc-700 rounded transition-colors">
                <Strikethrough className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-zinc-700 mx-2" />
              <button type="button" className="p-2 hover:bg-zinc-700 rounded transition-colors">
                <List className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-zinc-700 rounded transition-colors">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 hover:bg-zinc-700 rounded transition-colors">
                <Type className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

