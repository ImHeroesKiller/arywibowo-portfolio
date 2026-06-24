interface LogoProps {
  className?: string
  showText?: boolean
  showName?: boolean
}

export default function Logo({ className = '', showText = true, showName }: LogoProps) {
  const shouldShowText = showText !== false && showName !== false

  return (
    <div className={`flex items-center ${className}`}>
      {shouldShowText && (
        <span className="font-semibold tracking-tight text-white text-xl md:text-2xl">
          Ary Wibowo
        </span>
      )}
    </div>
  )
}
