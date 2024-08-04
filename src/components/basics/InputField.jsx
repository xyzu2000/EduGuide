import clsx from 'clsx';
import { forwardRef } from 'react';

const InputField = forwardRef(({ className, type, label, ...props }, ref) => {
    return (
        <div>
            {label && (
                <label
                    htmlFor={props.id}
                    className="block text-sm font-medium leading-6 "
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                className={clsx(
                    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});

export default InputField;