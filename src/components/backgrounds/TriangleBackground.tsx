interface TriangleBackgroundProps {
  className?: string
}

export default function TriangleBackground({ className = '' }: TriangleBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Top-left triangle */}
      <div 
        className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500 opacity-50"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      {/* Right side triangle */}
      <div 
        className="absolute top-1/4 right-0 w-80 h-80 bg-blue-700 opacity-40"
        style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
      />
      {/* Bottom center triangle */}
      <div 
        className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-400 opacity-30"
        style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
      />
      {/* Bottom-right arrow triangle */}
      <div 
        className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-800 opacity-40"
        style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
      />
      {/* Center-left small triangle */}
      <div 
        className="absolute top-1/2 left-10 w-40 h-40 bg-white opacity-10"
        style={{ clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }}
      />
      {/* Top-right small triangle */}
      <div 
        className="absolute top-20 right-1/4 w-32 h-32 bg-blue-300 opacity-20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
      />
    </div>
  )
}
