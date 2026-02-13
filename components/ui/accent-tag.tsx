import React from 'react';
import { cn } from "@/lib/utils"; // Assuming you have your cn utility here

interface AccentTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  // You can add more specific props here if needed
}

const AccentTag: React.FC<AccentTagProps> = ({ className, children, ...props }) => {
  return (
    <span
      className={cn(
        'px-2 min-w-[15%] h-9 bg-accent/50 text-accent-foreground/90 font-light rounded-md flex items-center justify-center',
        className // This allows you to pass additional classes from the parent
      )}
      {...props} // This passes any other HTML attributes like onClick, id, etc.
    >
      {children}
    </span>
  );
};

export { AccentTag };
