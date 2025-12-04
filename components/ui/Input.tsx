import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    suffix?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, type = 'text', suffix, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        type={type}
                        ref={ref}
                        className={cn(
                            'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                            error ? 'border-red-500' : 'border-gray-300',
                            suffix && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {suffix}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
