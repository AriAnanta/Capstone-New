import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    disabled, 
    children, 
    type = 'button',
    ...props 
}, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-50 disabled:pointer-events-none active:scale-95';
    
    const variants = {
        primary: 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 border border-transparent',
        secondary: 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300',
        outline: 'bg-transparent text-emerald-600 border border-emerald-600 hover:bg-emerald-50/50',
        ghost: 'bg-transparent text-slate-600 hover:bg-slate-100/50 hover:text-slate-900',
        danger: 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/40',
        link: 'text-emerald-600 underline-offset-4 hover:underline p-0 h-auto'
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0'
    };

    return (
        <button
            ref={ref}
            type={type}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
