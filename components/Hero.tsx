'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#111] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-12">
          
          {/* Caption Kiri */}
          <div className="flex-1 space-y-6 text-left">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
                Ary Wibowo
              </h1>
              <p className="mt-2 text-2xl font-medium text-[#3b82f6]">
                Profesional Consultant
              </p>
            </div>

            <p className="max-w-[520px] text-lg text-white/80 md:text-xl">
              Mendampingi bisnis tumbuh melalui konsultasi strategis — 
              dari energi terbarukan hingga transformasi digital.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="bg-[#3b82f6] hover:bg-[#2563eb]">
                <a href="/contact">Contact →</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/services">Services</a>
              </Button>
            </div>
          </div>

          {/* Foto Kanan + Gradient Overlay */}
          <div className="relative flex-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl md:aspect-auto md:h-[520px]">
              <Image
                src="/images/profile.png"
                alt="Ary Wibowo - Profesional Consultant"
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay Smooth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70 md:bg-gradient-to-r md:from-black/40 md:via-black/10 md:to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
