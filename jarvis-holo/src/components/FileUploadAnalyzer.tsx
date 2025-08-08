import { useState } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export default function FileUploadAnalyzer() {
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function analyzeContent(text: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      })
      const data = await res.json()
      setSummary(data.summary || 'No summary produced.')
    } finally { setLoading(false) }
  }

  async function handleFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'csv') {
      const text = await file.text()
      const parsed = Papa.parse<string[]>(text)
      const formatted = parsed.data.map((row: string[]) => row.join(',')).join('\n')
      await analyzeContent(formatted)
    } else if (ext === 'xlsx' || ext === 'xls') {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf)
      const ws = wb.Sheets[wb.SheetNames[0]]
      const csv = XLSX.utils.sheet_to_csv(ws)
      await analyzeContent(csv)
    } else {
      const text = await file.text()
      await analyzeContent(text)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".csv,.xlsx,.xls,.txt"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f) }}
        className="block text-sm"
      />
      <div className="text-sm text-gray-300 whitespace-pre-wrap min-h-24 p-3 bg-black/30 rounded border border-white/10">
        {loading ? 'Analyzing…' : (summary || 'Upload a file to analyze.')}
      </div>
    </div>
  )
}