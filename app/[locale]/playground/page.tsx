'use client'

import React from 'react'

export default function Playground() {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight">Playground</h1>
          <p className="mt-4 text-2xl text-white/70">Asisten AI yang Mengerti Konteks Anda Lebih Cerdas. Lebih Personal.</p>
          <p className="mt-2 text-white/50 max-w-md mx-auto">Try the AI tools and generators. A playground for creativity and productivity.</p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 p-2">
          <iframe
            src="https://perchance.org/9qg8en23wi"
            width="100%"
            height="650px"
            frameBorder="0"
            scrolling="no"
            style={{ borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
            className="w-full"
          />
        </div>

        <div className="mt-8 text-center text-sm text-white/60">
          This is a demo playground. For the full experience, visit the generator directly or explore more tools on IDA.
        </div>
      </div>
    </div>
  )
}
