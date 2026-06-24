import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
}

export default function Logo({ className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-8 w-8 md:h-9 md:w-9">
        <Image
          src="/images/awi-logo.png"
          alt="AWI Logo"
          fill
          className="object-contain"
          unoptimized // ← Penting untuk PNG transparan
        />
      </div>
      {showText && (
        <span className="font-semibold tracking-tight text-white text-lg md:text-xl">
          Ary Wibowo
        </span>
      )}
    </div>
  )
}