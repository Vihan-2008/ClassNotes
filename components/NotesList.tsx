import type { Note } from "../types"

interface NotesListProps {
  notes: Note[]
  onDelete: (id: number) => void
}

export default function NotesList({ notes, onDelete }: NotesListProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet. Start recording to create notes!</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
              <span>{note.text}</span>
              <button
                onClick={() => onDelete(note.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

