import { useId } from 'react';
import { IconBase, IconProps } from './IconBase';
import { cn } from '@/shared/lib/utils';

export function SoulPulse({ isAnimated, className, ...props }: IconProps) {
  const filterId = useId();
  
  return (
    <IconBase 
      viewBox="0 0 100 100" 
      className={cn("text-soul-magenta", className)} 
      style={{ overflow: 'visible' }} 
      {...props}
    >
      <defs>
        <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feFlood floodColor="currentColor" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>
          {`
            @keyframes waveFlow {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50px); }
            }
            .animate-wave-flow {
              animation: waveFlow 4s linear infinite;
            }
          `}
        </style>
      </defs>

      <g filter={`url(#${filterId})`}>
        {/* Repeating Sine Wave for a continuous pulse effect */}
        <path 
          d="M 0,50 Q 12.5,20 25,50 T 50,50 T 75,50 T 100,50 T 125,50 T 150,50" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round"
          className={cn(isAnimated && "animate-wave-flow")}
        />
      </g>
    </IconBase>
  );
}
