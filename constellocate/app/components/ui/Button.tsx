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
  className = 'mr-1 ml-1 rounded bg-white px-4 py-2 text-lg font-bold text-black cursor-pointer',
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