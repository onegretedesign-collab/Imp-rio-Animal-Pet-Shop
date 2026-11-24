import {useState} from 'react';
import {Stethoscope} from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'Império Animal',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#141414] via-[#22211D] to-[#0D0D0C] text-white p-6 text-center ${className}`}
      >
        <Stethoscope className="w-8 h-8 text-[#DBBD43] mb-3" aria-hidden="true" />
        <span className="font-display text-lg font-bold tracking-tight">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
