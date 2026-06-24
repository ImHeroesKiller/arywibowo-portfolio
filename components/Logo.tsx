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
  // Support both showText and showName
  const shouldShowText = showText !== false && showName !== false

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/images/awi-logo.png" 
        alt="AWI Logo" 
        className={`h-8 w-8 md:h-9 md:w-9 object-contain ${imageClassName}`}
      />
      {shouldShowText && (
        <span className="font-semibold tracking-tight text-white text-lg md:text-xl">
          Ary Wibowo
        </span>
      )}
    </div>
  )
}
