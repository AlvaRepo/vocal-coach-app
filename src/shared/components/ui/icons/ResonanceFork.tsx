import { useId } from 'react';
import { IconBase, IconProps } from './IconBase';
import { cn } from '@/shared/lib/utils';

export function ResonanceFork({ isAnimated, className, ...props }: IconProps) {
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
          <feComposite in="color" in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>
          {`
            @keyframes forkVibrate {
              0%, 100% { transform: scaleX(1); }
              50% { transform: scaleX(1.05); }
            }
            .animate-vocal-vibrate {
              animation: forkVibrate 0.1s linear infinite;
              transform-origin: center;
            }
          `}
        </style>
      </defs>

      <g filter={`url(#${filterId})`}>
        {/* Tuning Fork Silhouette */}
        <path 
          d="M 40,20 V 60 A 10,10 0 0 0 60,60 V 20" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
          className={cn(isAnimated && "animate-vocal-vibrate")}
        />
        <path 
          d="M 50,70 V 85" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
        <circle cx="50" cy="90" r="3" fill="currentColor" />

        {/* Resonance Ripples */}
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" className="animate-pulse" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.05" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
      </g>
    </IconBase>
  );
}
