declare interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: (event: SpeechRecognitionEvent) => void
  onend: () => void
  onerror: (event: any) => void
}

declare interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

declare interface SpeechRecognitionResultList {
  length: number
  [index: number]: SpeechRecognitionResult
}

declare interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  [index: number]: SpeechRecognitionAlternative
}

declare interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare var webkitSpeechRecognition: { new(): SpeechRecognition }

declare var SpeechRecognition: { new(): SpeechRecognition }