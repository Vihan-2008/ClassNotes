"use client"

import { useState, useEffect, useRef } from "react"

interface AudioRecorderProps {
  onTranscriptionReady: (text: string) => void
}

export default function AudioRecorder({ onTranscriptionReady }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

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

        setTranscript(finalTranscript || interimTranscript)
      }
    } else {
      console.error("Speech recognition not supported")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsRecording(false)
      if (transcript) {
        onTranscriptionReady(transcript)
      }
      setTranscript("")
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start()
      }
      setIsRecording(true)
    }
  }

  return (
    <div className="mb-4">
      <button
        onClick={toggleRecording}
        className={`px-4 py-2 rounded ${
          isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      {isRecording && <p className="mt-2">Recording... {transcript && `Transcript: ${transcript}`}</p>}
    </div>
  )
}

