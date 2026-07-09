'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0a0a0a] py-12 text-sm">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-10">
        
        {/* Brand */}
        <div>
          <div className="font-semibold tracking-tight text-lg">Ary Wibowo</div>
          <p className="text-xs text-slate-500 mt-1">Profesional Consultant</p>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <div className="font-medium text-xs tracking-widest text-slate-400 mb-3">NAVIGATION</div>
          <Link href="/" className="block hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="block hover:text-white transition-colors">About</Link>
          <Link href="/services" className="block hover:text-white transition-colors">Services</Link>
          <Link href="/projects" className="block hover:text-white transition-colors">Projects</Link>
          <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
        </div>

        {/* Tools & Playground */}
        <div className="space-y-2">
          <div className="font-medium text-xs tracking-widest text-slate-400 mb-3">TOOLS &amp; PLAYGROUND</div>
          <Link href="/playground" className="block hover:text-white transition-colors">AI Playground</Link>
          <a href="/decision-ai-dashboard.html" className="block hover:text-white transition-colors">Decision AI Dashboard</a>
          <Link href="/services" className="block hover:text-white transition-colors">Services</Link>
        </div>

        {/* Connect */}
        <div>
          <div className="font-medium text-xs tracking-widest text-slate-400 mb-3">CONNECT</div>
          <a href="mailto:aku@arywibowo.co.id" className="block hover:text-white transition-colors">aku@arywibowo.co.id</a>
          <a href="https://github.com/ImHeroesKiller" target="_blank" className="block hover:text-white transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/boworesearch" target="_blank" className="block hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Ary Wibowo. All rights reserved.
      </div>
    </footer>
  )
}
