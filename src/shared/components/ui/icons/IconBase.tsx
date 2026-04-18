import React from 'react';
import { cn } from '@/shared/lib/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  isAnimated?: boolean;
}

interface IconBaseProps extends IconProps {
  viewBox?: string;
  children: React.ReactNode;
}

export const IconBase = React.forwardRef<SVGSVGElement, IconBaseProps>(
  ({ size = 24, className, viewBox = '0 0 24 24', children, isAnimated = false, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'inline-block align-middle transition-transform duration-300',
          className
        )}
        {...props}
      >
        {children}
      </svg>
    );
  }
);

IconBase.displayName = 'IconBase';
