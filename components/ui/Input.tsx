'use client';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export default function Input({ label, error, helper, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none
          ${error
            ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200'
            : 'border-gray-200 bg-white focus:border-primary focus:ring-2 focus:ring-primary/20'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      {helper && !error && <p className="mt-1.5 text-sm text-gray-500">{helper}</p>}
    </div>
  );
}
