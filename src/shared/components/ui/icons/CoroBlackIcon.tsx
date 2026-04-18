import { useId } from 'react';
import { IconBase, IconProps } from './IconBase';
import { cn } from '@/shared/lib/utils';

export function CoroBlackIcon({ isAnimated, className, ...props }: IconProps) {
  const filterId = useId();
  
  return (
    <IconBase 
      viewBox="0 0 400 300" 
      className={cn("text-white overflow-visible", className)} 
      {...props}
    >
      <defs>
        {/* Superior Neon Filter */}
        <filter id={filterId} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feFlood floodColor="currentColor" floodOpacity="0.6" result="glowColor" />
          <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="cWaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00ACBC" /> {/* Cyan */}
          <stop offset="100%" stopColor="#C933FF" /> {/* Magenta */}
        </linearGradient>

        <style>
          {`
            @keyframes pulseWidth {
              0%, 100% { stroke-width: 2; opacity: 0.8; }
              50% { stroke-width: 4; opacity: 1; }
            }
            .animate-pulse-width {
              animation: pulseWidth 3s ease-in-out infinite;
            }
            @keyframes waveRotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </defs>

      <g filter={`url(#${filterId})`} transform="translate(200, 150)">
        {/* Outer C-Ring (Acoustic Pressure) */}
        <path 
          d="M 60,-60 A 85,85 0 1 0 60,60" 
          fill="none" 
          stroke="url(#cWaveGradient)" 
          strokeWidth="3" 
          strokeLinecap="round"
          className={cn(isAnimated && "animate-pulse-width")}
        />
        
        {/* Inner Frequency Spike (Vocal Resonance) */}
        <path 
          d="M 40,-30 L 45,-10 L 55,20 L 45,10 L 40,30" 
          fill="none" 
          stroke="#00ACBC" 
          strokeWidth="2" 
          strokeLinecap="round"
          className={cn(isAnimated && "animate-pulse-width")}
          style={{ animationDelay: '0.5s' }}
        />

        {/* Core Nodal Point */}
        <circle 
          cx="0" cy="0" r="4" 
          fill="white" 
          className={cn(isAnimated && "animate-pulse")}
        />
        
        {/* Echo Rings */}
        <circle 
          cx="0" cy="0" r="120" 
          fill="none" 
          stroke="#C933FF" 
          strokeWidth="0.5" 
          strokeDasharray="4 8"
          opacity="0.2"
        />
      </g>
    </IconBase>
  );
}
