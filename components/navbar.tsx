'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  // Simple active link logic (you can expand this)
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0a0a]/95 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-xl">
          Ary Wibowo
        </Link>

        <div className="flex items-center gap-x-8 text-sm">
          <Link 
            href="/about" 
            className={`${isActive('/about') ? 'text-white' : 'text-slate-400 hover:text-white'} transition-colors`}
          >
            About
          </Link>
          <Link 
            href="/services" 
            className={`${isActive('/services') ? 'text-white' : 'text-slate-400 hover:text-white'} transition-colors`}
          >
            Services
          </Link>
          <Link 
            href="/projects" 
            className={`${isActive('/projects') ? 'text-white' : 'text-slate-400 hover:text-white'} transition-colors`}
          >
            Projects
          </Link>
          <Link 
            href="/playground" 
            className={`${isActive('/playground') ? 'text-white' : 'text-slate-400 hover:text-white'} transition-colors`}
          >
            Playground
          </Link>
          <Link 
            href="/contact" 
            className="px-4 py-2 bg-white text-black rounded-2xl text-xs font-medium hover:bg-white/90 transition-all"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
