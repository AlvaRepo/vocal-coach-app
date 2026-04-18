import { useId } from 'react';
import { IconProps } from './IconBase';
import { CoroBlackIcon } from './CoroBlackIcon';
import { cn } from '@/shared/lib/utils';

export function CoroBlackLogo({ isAnimated, className, ...props }: IconProps) {
  const size = props.size || 200;
  const filterId = useId();
  
  return (
    <div className={cn("flex flex-col items-center justify-center gap-6", className)} style={{ width: size, height: 'auto' }}>
      <CoroBlackIcon size={size} isAnimated={isAnimated} {...props} />
      
      <svg 
        viewBox="0 0 400 60" 
        className="overflow-visible" 
        style={{ width: size, height: 'auto' }}
      >
        <defs>
          <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feFlood floodColor="#00ACBC" floodOpacity="0.5" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <text 
          x="200" 
          y="45" 
          textAnchor="middle" 
          fill="white" 
          fontSize="48" 
          fontWeight="700" 
          fontFamily="'Space Grotesk', sans-serif" 
          filter={`url(#${filterId})`}
          style={{ letterSpacing: '0.4em', textTransform: 'uppercase' }}
        >
          CoroBlack
        </text>
      </svg>
    </div>
  );
}
