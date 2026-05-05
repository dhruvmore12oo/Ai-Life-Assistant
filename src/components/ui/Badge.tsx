import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
  };
  
  return (
    <span 
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide", variants[variant], className)} 
      {...props} 
    />
  );
}
