import React from 'react';
import clsx from 'clsx';
// import * as LabelPrimitive from '@radix-ui/react-label'; // Unused

// Since we might not have radix-ui installed, I will make a simple implementation 
// that mimics the behavior if the package isn't available, but standard <label> is fine.
// Actually, to be safe without adding dependencies, I'll just use a standard label 
// with the right classes.

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={clsx(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
