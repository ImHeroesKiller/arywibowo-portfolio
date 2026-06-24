interface LogoProps {
  className?: string
  imageClassName?: string
  showText?: boolean
  showName?: boolean
}

export default function Logo({ className = '', imageClassName = '', showText = true, showName }: LogoProps) {
  const shouldShowText = showText !== false && showName !== false

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/images/awi-logo.webp" 
        alt="AWI Logo" 
        className={`h-9 w-9 md:h-10 md:w-10 object-contain ${imageClassName}`}
      />
      {shouldShowText && (
        <span className="font-semibold tracking-tight text-white text-lg md:text-xl">
          Ary Wibowo
        </span>
      )}
    </div>
  )
}
