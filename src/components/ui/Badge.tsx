import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'gray', children, ...props }) => {
  const variants = {
    green: 'bg-green-100 text-green-800 border bg-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border bg-yellow-200',
    red: 'bg-red-100 text-red-800 border bg-red-200',
    blue: 'bg-blue-100 text-blue-800 border bg-blue-200',
    gray: 'bg-gray-100 text-gray-800 border bg-gray-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
