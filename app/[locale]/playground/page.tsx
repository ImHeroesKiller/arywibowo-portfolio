'use client'

import React from 'react'

export default function Playground() {
  const openPlayground = () => {
    window.open('https://perchance.org/9qg8en23wi', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight">Playground</h1>
          <p className="mt-4 text-2xl text-white/70">Asisten AI yang Mengerti Konteks Anda Lebih Cerdas. Lebih Personal.</p>
          <p className="mt-3 text-white/50 max-w-lg mx-auto">
            Coba generator AI untuk membuat karakter, gambar, dan konten kreatif. 
            Klik tombol di bawah untuk membuka playground.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={openPlayground}
            className="group flex items-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-white/90 active:scale-[0.985] transition-all shadow-xl"
          >
            Buka Playground
            <span className="text-xl group-hover:translate-x-0.5 transition-transform">↗</span>
          </button>
        </div>

        <div className="mt-10 text-center text-sm text-white/50">
          Generator ini mendukung pembuatan gambar dan karakter AI secara cepat dan gratis.
        </div>

        <div className="mt-16 text-center">
          <a 
            href="https://perchance.org/9qg8en23wi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-white/60 hover:text-white underline underline-offset-4"
          >
            Buka langsung di tab baru
          </a>
        </div>
      </div>
    </div>
  )
}
