import React, { useState } from 'react';
import LogoFallback from './LogoFallback';

interface CompanyLogoProps {
  src?: string | null;
  alt: string;
  className?: string;
  iconSize?: number;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ src, alt, className, iconSize }) => {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imgError, setImgError] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgError(false);
  }

  return (
    <div className={className}>
      {src && !imgError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <LogoFallback className="w-full h-full" size={iconSize} />
      )}
    </div>
  );
};

export default CompanyLogo;
