'use client'

import React, { useState } from 'react'

export default function Playground() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openGenerator = () => {
    window.open('https://perchance.org/9qg8en23wi', '_blank', 'noopener,noreferrer')
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight">Playground</h1>
          <p className="mt-4 text-2xl text-white/70">Asisten AI yang Mengerti Konteks Anda Lebih Cerdas. Lebih Personal.</p>
          <p className="mt-3 text-white/50 max-w-lg mx-auto">
            Coba generator AI untuk membuat karakter, gambar, dan konten kreatif.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 px-10 py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-white/90 active:scale-[0.985] transition-all shadow-xl"
          >
            Buka Playground
            <span className="text-xl group-hover:translate-x-0.5 transition-transform">↗</span>
          </button>
        </div>

        <div className="mt-10 text-center text-sm text-white/50">
          Generator ini mendukung pembuatan gambar dan karakter AI secara cepat dan gratis.
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#1a1a1a] rounded-3xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-white/60 hover:text-white text-xl"
            >
              ×
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-3">Buka Generator</h2>
              <p className="text-white/70 mb-6">
                Generator akan dibuka di tab baru agar kamu bisa menggunakan semua fiturnya dengan nyaman.
              </p>

              <button
                onClick={openGenerator}
                className="w-full py-3.5 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-white/90 transition-all"
              >
                Buka di Tab Baru
              </button>

              <p className="text-xs text-white/50 mt-4">
                Perchance AI Generator • Gratis &amp; Tanpa Login
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
