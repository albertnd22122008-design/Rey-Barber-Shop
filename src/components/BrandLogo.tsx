import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* High-fidelity Vector Recreation of Official Rey Barber Shop Logo */}
      <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center select-none`}>
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Curved Path for CORTE & AFEITADO text */}
            <path
              id="topTextArc"
              d="M 45 105 A 76 76 0 0 1 195 105"
              fill="none"
            />
            {/* Chrome metallic gradient for pole caps */}
            <linearGradient id="chromeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="35%" stopColor="#94a3b8" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Inner background stripes clip path */}
            <clipPath id="innerCircleClip">
              <circle cx="120" cy="120" r="88" />
            </clipPath>

            {/* Barber Pole Glass Cylinder clip path */}
            <clipPath id="poleCylinderClip">
              <rect x="94" y="98" width="52" height="78" rx="4" />
            </clipPath>
          </defs>

          {/* 1. Outer Black Border & Teal Ring */}
          <circle cx="120" cy="120" r="116" fill="#007d7d" stroke="#111827" strokeWidth="5" />
          
          {/* Inner Red Accent Ring */}
          <circle cx="120" cy="120" r="95" fill="#ffffff" stroke="#c5221f" strokeWidth="4" />

          {/* 2. Inner Striped Background (Red, White, Blue diagonal ribbons) */}
          <g clipPath="url(#innerCircleClip)">
            <rect x="20" y="20" width="200" height="200" fill="#ffffff" />
            {/* Diagonal Stripes */}
            <path d="M10 20 L230 180 L230 205 L10 45 Z" fill="#4d5382" opacity="0.85" />
            <path d="M10 55 L230 215 L230 240 L10 80 Z" fill="#c5221f" opacity="0.85" />
            <path d="M10 -15 L230 145 L230 170 L10 10 Z" fill="#c5221f" opacity="0.85" />
            <path d="M10 -50 L230 110 L230 135 L10 -25 Z" fill="#4d5382" opacity="0.85" />
            <path d="M10 -85 L230 75 L230 100 L10 -60 Z" fill="#c5221f" opacity="0.85" />
            <path d="M10 90 L230 250 L230 275 L10 115 Z" fill="#4d5382" opacity="0.85" />
            <path d="M10 125 L230 285 L230 310 L10 150 Z" fill="#c5221f" opacity="0.85" />
          </g>

          {/* 3. Outer Teal Ring Details */}
          {/* Top Arched Text: CORTE & AFEITADO */}
          <text fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">
            <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">
              CORTE &amp; AFEITADO
            </textPath>
          </text>

          {/* Left and Right Clipper Badges on Teal Ring */}
          <circle cx="34" cy="118" r="8" fill="#1e293b" stroke="#ffffff" strokeWidth="1.2" />
          {/* Tiny shaver/scissor icon */}
          <path d="M31 115 L37 121 M37 115 L31 121" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

          <circle cx="206" cy="118" r="8" fill="#1e293b" stroke="#ffffff" strokeWidth="1.2" />
          <path d="M203 115 L209 121 M209 115 L203 121" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

          {/* Bottom 5 Stars along Teal Arc */}
          <g fill="#ffffff" transform="translate(0, 0)">
            {/* Star 1 */}
            <polygon points="56,198 58,203 63,203 59,206 61,211 56,208 52,211 54,206 50,203 55,203" transform="scale(0.85) translate(14, 2)" />
            {/* Star 2 */}
            <polygon points="86,212 88,217 93,217 89,220 91,225 86,222 82,225 84,220 80,217 85,217" transform="scale(0.85) translate(16, 2)" />
            {/* Star 3 (Center) */}
            <polygon points="120,218 122,223 127,223 123,226 125,231 120,228 116,231 118,226 114,223 119,223" transform="scale(0.85) translate(21, 2)" />
            {/* Star 4 */}
            <polygon points="154,212 156,217 161,217 157,220 159,225 154,222 150,225 152,220 148,217 153,217" transform="scale(0.85) translate(26, 2)" />
            {/* Star 5 */}
            <polygon points="184,198 186,203 191,203 187,206 189,211 184,208 180,211 182,206 178,203 183,203" transform="scale(0.85) translate(28, 2)" />
          </g>

          {/* 4. Central Classic Barber Pole */}
          {/* Cylinder Base/Pedestal */}
          <ellipse cx="120" cy="182" rx="28" ry="8" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M102 182 C102 196 138 196 138 182 Z" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />
          <circle cx="120" cy="196" r="6" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.2" />

          {/* Glass Cylinder Body */}
          <rect x="94" y="98" width="52" height="78" rx="4" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
          
          {/* Barber Spirals inside Glass */}
          <g clipPath="url(#poleCylinderClip)">
            <path d="M80 85 L160 135 L160 150 L80 100 Z" fill="#c5221f" />
            <path d="M80 115 L160 165 L160 180 L80 130 Z" fill="#1d4ed8" />
            <path d="M80 145 L160 195 L160 210 L80 160 Z" fill="#c5221f" />
            <path d="M80 55 L160 105 L160 120 L80 70 Z" fill="#1d4ed8" />
            {/* Cylindrical shine highlight */}
            <rect x="98" y="98" width="8" height="78" fill="#ffffff" opacity="0.6" />
          </g>

          {/* Top Chrome Cap for Cylinder */}
          <ellipse cx="120" cy="98" rx="27" ry="7" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />
          <ellipse cx="120" cy="93" rx="22" ry="5" fill="url(#chromeGrad)" stroke="#1e293b" strokeWidth="1.5" />

          {/* 5. King's Crown (Corona de Rey) with REY Text */}
          <g id="reyCrown">
            {/* Crown Body - Sharp Black with White Details */}
            <path
              d="M74 88 L72 45 L94 65 L120 33 L146 65 L168 45 L166 88 Z"
              fill="#0f172a"
              stroke="#000000"
              strokeWidth="2.5"
            />
            {/* Jewels on Crown Peaks */}
            <circle cx="72" cy="45" r="3.5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
            <circle cx="120" cy="33" r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
            <circle cx="168" cy="45" r="3.5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
            
            {/* Lower Jewels Line on Crown Base */}
            <circle cx="85" cy="84" r="2" fill="#ffffff" />
            <circle cx="102" cy="84" r="2" fill="#ffffff" />
            <circle cx="120" cy="84" r="2.5" fill="#ffffff" />
            <circle cx="138" cy="84" r="2" fill="#ffffff" />
            <circle cx="155" cy="84" r="2" fill="#ffffff" />

            {/* REY text in the center of Crown */}
            <text
              x="120"
              y="74"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="20"
              fontWeight="900"
              fontFamily="Georgia, serif"
              letterSpacing="2.5"
            >
              REY
            </text>
          </g>

          {/* 6. Central Black Ribbon with Scissors & BARBERSHOP Text */}
          <g id="ribbonBanner">
            {/* Ribbon Tail Left */}
            <path
              d="M10 135 L38 123 L38 152 L10 164 L24 149 Z"
              fill="#020617"
              stroke="#000000"
              strokeWidth="1.5"
            />
            {/* Ribbon Tail Right */}
            <path
              d="M230 135 L202 123 L202 152 L230 164 L216 149 Z"
              fill="#020617"
              stroke="#000000"
              strokeWidth="1.5"
            />

            {/* Main Center Ribbon Body */}
            <path
              d="M24 130 Q120 134 216 130 L216 160 Q120 164 24 160 Z"
              fill="#0a0a0c"
              stroke="#000000"
              strokeWidth="2"
            />

            {/* Left Scissor Graphic */}
            <g transform="translate(32, 137) scale(0.65)">
              <circle cx="6" cy="8" r="4" fill="none" stroke="#ffffff" strokeWidth="2" />
              <circle cx="6" cy="22" r="4" fill="none" stroke="#ffffff" strokeWidth="2" />
              <line x1="9" y1="10" x2="26" y2="24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="9" y1="20" x2="26" y2="6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* Right Scissor Graphic */}
            <g transform="translate(192, 137) scale(0.65)">
              <circle cx="24" cy="8" r="4" fill="none" stroke="#ffffff" strokeWidth="2" />
              <circle cx="24" cy="22" r="4" fill="none" stroke="#ffffff" strokeWidth="2" />
              <line x1="21" y1="10" x2="4" y2="24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="21" y1="20" x2="4" y2="6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            {/* BARBERSHOP Bold Serif/Slab Typography */}
            <text
              x="120"
              y="152"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="17.5"
              fontWeight="900"
              fontFamily="'Courier New', Courier, monospace, serif"
              letterSpacing="2.8"
            >
              BARBERSHOP
            </text>
          </g>
        </svg>
      </div>

      {/* Brand Text Lockup */}
      {showText && (
        <div className="flex flex-col">
          <span className="font-display tracking-widest text-lg sm:text-xl font-bold uppercase text-white leading-tight">
            Rey Barber Shop
          </span>
          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span>Corte &amp; Afeitado</span>
            <span className="text-neutral-500">·</span>
            <span>Santo Domingo</span>
          </span>
        </div>
      )}
    </div>
  );
};
