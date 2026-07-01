interface VelvoriaLogoProps {
  className?: string;
}

/** Monogram "V" gem-cut Velvoria — dua facet champagne-gold + sparkle rose. */
export function VelvoriaLogo({ className }: VelvoriaLogoProps) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vv-goldL" x1="52" y1="52" x2="100" y2="154" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0D9AE" />
          <stop offset="1" stopColor="#C5A572" />
        </linearGradient>
        <linearGradient id="vv-goldR" x1="148" y1="52" x2="100" y2="154" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C9A56E" />
          <stop offset="1" stopColor="#9C7B49" />
        </linearGradient>
        <linearGradient id="vv-spark" x1="150" y1="46" x2="164" y2="74" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBEFD8" />
          <stop offset="1" stopColor="#E8B4A0" />
        </linearGradient>
      </defs>
      <path d="M52 52 L74 52 L100 122 L100 154 Z" fill="url(#vv-goldL)" />
      <path d="M148 52 L126 52 L100 122 L100 154 Z" fill="url(#vv-goldR)" />
      <path d="M157 44 L161 60 L177 64 L161 68 L157 84 L153 68 L137 64 L153 60 Z" fill="url(#vv-spark)" />
    </svg>
  );
}
