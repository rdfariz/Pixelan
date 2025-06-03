const BackgroundDecor: React.FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 -z-10 w-full h-full"
    viewBox="0 0 800 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="150" cy="150" r="120" fill="#fbbf24" fillOpacity="0.3" filter="url(#blur1)" />
    <circle cx="650" cy="120" r="90" fill="#f472b6" fillOpacity="0.25" filter="url(#blur2)" />
    <circle cx="400" cy="450" r="180" fill="#fbbf24" fillOpacity="0.15" filter="url(#blur3)" />
    <defs>
      <filter id="blur1" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="40" />
      </filter>
      <filter id="blur2" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="30" />
      </filter>
      <filter id="blur3" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="60" />
      </filter>
    </defs>
  </svg>
)

export default BackgroundDecor