import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const wrapperClass =
    size === 'sm'
      ? 'flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden shrink-0'
      : 'inline-flex items-center justify-center w-16 h-16 rounded-xl overflow-hidden';

  return (
    <div className={`${wrapperClass} ${className}`}>
      <img
        src="/favicon.png"
        alt="Smart Leads"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default AppLogo;
