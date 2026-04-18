import { useId } from 'react';
import { IconBase, IconProps } from './IconBase';
import { cn } from '@/shared/lib/utils';

export function VocalFold({ isAnimated, className, ...props }: IconProps) {
  const filterId = useId();
  
  return (
    <IconBase 
      viewBox="0 0 100 100" 
      className={cn("text-soul-cyan", className)} 
      style={{ overflow: 'visible' }} 
      {...props}
    >
      <defs>
        <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
          <feFlood floodColor="currentColor" floodOpacity="0.4" result="color" />
          <feComposite in="color" in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>
          {`
            @keyframes vocalBreath {
              0%, 100% { d: path("M 40,30 C 45,40 45,60 40,70"); }
              50% { d: path("M 35,30 C 42,40 42,60 35,70"); }
            }
            .animate-vocal-breath {
              animation: vocalBreath 4s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      <g filter={`url(#${filterId})`}>
        {/* Left Fold */}
        <path 
          d="M 40,30 C 45,40 45,60 40,70" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeLinecap="round"
          className={cn(isAnimated && "animate-vocal-breath")}
        />
        {/* Right Fold (Symmetrical) */}
        <path 
          d="M 60,30 C 55,40 55,60 60,70" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1" 
          strokeLinecap="round"
          className={cn(isAnimated && "animate-vocal-breath")}
          style={{ transformOrigin: 'center', transform: 'scaleX(-1) translateX(-100px)' }}
        />

        {/* Outer resonance ring */}
        <circle 
          cx="50" cy="50" r="40" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          opacity="0.1" 
        />
      </g>
    </IconBase>
  );
}
