import { useEffect, useRef } from 'react'

interface HologramDisplayProps {
  speaking?: boolean
  thinking?: boolean
}

export default function HologramDisplay({ speaking, thinking }: HologramDisplayProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!ref.current) return
    ref.current.animate([
      { boxShadow: '0 0 20px rgba(0,255,246,0.3), inset 0 0 20px rgba(0,180,255,0.2)' },
      { boxShadow: '0 0 30px rgba(0,255,246,0.6), inset 0 0 30px rgba(0,180,255,0.4)' },
      { boxShadow: '0 0 20px rgba(0,255,246,0.3), inset 0 0 20px rgba(0,180,255,0.2)' },
    ], { duration: 2000, iterations: Infinity })
  }, [])

  return (
    <div ref={ref} className="relative h-56 rounded-xl border border-cyan-400/30 bg-gradient-to-b from-cyan-500/10 to-blue-500/5 overflow-hidden">
      <div className="absolute inset-0 opacity-30 mix-blend-screen" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(0,255,246,0.3), transparent 40%)' }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-24 h-24 rounded-full border-2 border-cyan-400/70 ${speaking ? 'animate-ping' : ''}`} />
      </div>
      <div className="absolute bottom-2 left-2 text-xs text-cyan-300">
        {speaking ? 'Speaking…' : thinking ? 'Thinking…' : 'Idle'}
      </div>
    </div>
  )
}