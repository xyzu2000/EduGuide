import clsx from 'clsx';
import { forwardRef } from 'react';

const Button = forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        return (
            <button
                className={clsx(
                    'bg-indigo-600 text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 min-w-24 hover:bg-indigo-700',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

export default Button;