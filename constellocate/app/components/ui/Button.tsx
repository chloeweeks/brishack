'use client'

import React, { LinkHTMLAttributes } from 'react';

interface ButtonProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
}

export default function Button({
  text,
  type,
  className = 'font-semibold cursor-pointer whitespace-nowrap flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-background transition-colors hover:bg-gray-300 md:w-[158px] bg-white hover:shadow-[0_0_35px_rgba(99,102,241,1)]',
  onClick,
}: ButtonProps) {
  return (
    <div>
      <button type={type} className={className} onClick={onClick}>
        {text}
      </button>
    </div>
  );
}