import Image from 'next/image'

interface LogoProps {
  className?: string
  imageClassName?: string
  showText?: boolean
  showName?: boolean
}

export default function Logo({ 
  className = '', 
  imageClassName = '', 
  showText = true, 
  showName 
}: LogoProps) {
  const shouldShowText = showText !== false && showName !== false

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative h-9 w-9 md:h-10 md:w-10 flex-shrink-0 ${imageClassName}`}>
        <Image
          src="/images/awi-logo.png"
          alt="AWI Logo"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
      {shouldShowText && (
        <span className="font-semibold tracking-tight text-white text-lg md:text-xl">
          Ary Wibowo
        </span>
      )}
    </div>
  )
}
