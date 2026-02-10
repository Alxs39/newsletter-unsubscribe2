import type { SVGProps } from 'react';

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export default function Logo({ size = 28, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      width={size}
      height={size}
      {...props}
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="108" fill="url(#logo-bg)" />
      <rect x="96" y="152" width="320" height="208" rx="24" fill="white" fillOpacity={0.95} />
      <path
        d="M120 168 L256 280 L392 168"
        fill="none"
        stroke="#4338CA"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.55}
      />
      <circle cx="384" cy="136" r="52" fill="#F43F5E" />
      <line
        x1="358"
        y1="136"
        x2="410"
        y2="136"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
      />
    </svg>
  );
}
