import { useId } from 'react';
import { IconBase, IconProps } from './IconBase';
import { cn } from '@/shared/lib/utils';

export function FrequencySoul({ isAnimated, className, ...props }: IconProps) {
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
          <feFlood floodColor="currentColor" floodOpacity="0.3" result="glow" />
          <feComposite in="glow" in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>
          {`
            @keyframes barSpectrum {
              0%, 100% { height: 10px; y: 45px; }
              50% { height: 50px; y: 25px; }
            }
            .spectrum-bar {
              animation: barSpectrum 1.5s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      <g filter={`url(#${filterId})`}>
        {/* Dynamic Spectrum Bars */}
        {[20, 35, 50, 65, 80].map((x, i) => (
          <rect 
            key={x}
            x={x - 2} 
            y="45" 
            width="4" 
            height="10" 
            rx="2" 
            fill="currentColor" 
            className={cn(isAnimated && "spectrum-bar")}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </g>
    </IconBase>
  );
}
