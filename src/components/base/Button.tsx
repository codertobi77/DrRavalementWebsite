
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  onClick,
  href,
  type = 'button',
  disabled = false
}: ButtonProps) {
  const baseClasses = `font-semibold transition-all duration-300 transform whitespace-nowrap ${
    disabled 
      ? 'opacity-50 cursor-not-allowed' 
      : 'hover:scale-105 cursor-pointer'
  }`;
  
  const variantClasses = {
    primary: 'bg-orange-600 text-white hover:bg-orange-700',
    secondary: 'bg-white text-orange-900 hover:bg-orange-50',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-orange-900'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} rounded-lg ${className}`;
  
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
