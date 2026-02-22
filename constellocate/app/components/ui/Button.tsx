// 'use client'

// import React, { LinkHTMLAttributes } from 'react';

// interface ButtonProps {
//   text: string;
//   type?: 'button' | 'submit' | 'reset';
//   className?: string;
//   onClick?: () => void;
// }

// export default function Button({
//   text,
//   type,
//   className = 'font-semibold cursor-pointer whitespace-nowrap text-black flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-background transition-colors hover:bg-gray-300 md:w-[158px] bg-white hover:shadow-[0_0_35px_rgba(99,102,241,1)]',
//   onClick,
// }: ButtonProps) {
//   return (
//     <div>
//       <button type={type} className={className} onClick={onClick}>
//         {text}
//       </button>
//     </div>
//   );
// }

'use client'

import React from 'react';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string; // For extra custom classes (like margins)
  size?: 'sm' | 'md' | 'lg';  // The new size toggle
  onClick?: () => void;
}

export default function Button({
  text,
  type = 'button',
  className = '',
  size = 'md', // Default to medium
  onClick,
}: ButtonProps) {
  
  // 1. Base styles that both buttons share
  const baseStyles = "font-semibold cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 rounded-full transition-all hover:bg-gray-300 bg-white text-black hover:shadow-[0_0_35px_rgba(99,102,241,1)]";
  
  // 2. Size-specific styles
  const sizeStyles = {
    md: "h-12 w-full md:w-[158px] px-5 text-base", // Your original size
    sm: "h-8 w-fit px-4 text-xs",
    lg: "h-20 w-full md:w-[300px] px-5 text-3xl"
  };

  return (
    <div className="w-fit"> 
      <button 
        type={type} 
        className={`${baseStyles} ${sizeStyles[size]} ${className}`} 
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}