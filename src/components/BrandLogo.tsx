import React, { useState } from 'react';

// Domain mapping for unavatar / clean official logos
const BRAND_DOMAINS: Record<string, string> = {
  'sapphire': 'pk.sapphireonline.com.pk',
  'outfitters': 'outfitters.com.pk',
  'khaadi': 'pk.khaadi.com',
  'j-dot': 'junaidjamshed.com',
  'gul-ahmed': 'gulahmedshop.com',
  'nishat-linen': 'nishatlinen.com',
  'sana-safinaz': 'sanasafinaz.com',
  'bachaa-party': 'bachaaparty.com',
  'ethnic': 'ethnic.pk',
  'limelight': 'limelight.pk',
  'alkaram': 'alkaramstudio.com',
  'bonanza-satrangi': 'bonanzasatrangi.com',
  'generation': 'generation.com.pk',
  'zellbury': 'zellbury.com',
  'beechtree': 'beechtree.pk',
  'cross-stitch': 'crossstitch.pk',
  'edenrobe': 'edenrobe.com',
  'breakout': 'breakout.com.pk',
  'cougar': 'cougar.com.pk',
  'minnie-minors': 'minnieminors.com',
  'hopscotch': 'welovehopscotch.com',
  'stylo': 'stylo.pk',
  'borjan': 'borjan.com.pk',
  'servis': 'servis.pk',
  'bata': 'bata.com.pk',
  'ndure': 'ndure.com',
  'engine': 'engine.com.pk',
  'furor': 'furorjeans.com',
  'baroque': 'baroque.pk',
  'charizma': 'houseofcharizma.com',
  'maria-b': 'mariab.pk',
  'asim-jofa': 'asimjofa.com',
};

// Curated brand badge colors for clean luxury typography badges
const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
  'sapphire': { bg: 'bg-emerald-950', text: 'text-white' },
  'outfitters': { bg: 'bg-black', text: 'text-white' },
  'khaadi': { bg: 'bg-amber-950', text: 'text-amber-100' },
  'j-dot': { bg: 'bg-stone-900', text: 'text-white' },
  'gul-ahmed': { bg: 'bg-slate-900', text: 'text-amber-300' },
  'nishat-linen': { bg: 'bg-blue-950', text: 'text-white' },
  'sana-safinaz': { bg: 'bg-neutral-900', text: 'text-rose-200' },
  'stylo': { bg: 'bg-rose-900', text: 'text-rose-100' },
  'limelight': { bg: 'bg-lime-950', text: 'text-lime-200' },
  'alkaram': { bg: 'bg-slate-900', text: 'text-emerald-300' },
  'edenrobe': { bg: 'bg-zinc-900', text: 'text-white' },
  'breakout': { bg: 'bg-red-950', text: 'text-red-200' },
  'cougar': { bg: 'bg-orange-950', text: 'text-orange-200' },
  'beechtree': { bg: 'bg-teal-950', text: 'text-teal-200' },
  'borjan': { bg: 'bg-indigo-950', text: 'text-indigo-200' },
  'servis': { bg: 'bg-blue-900', text: 'text-white' },
  'bata': { bg: 'bg-red-900', text: 'text-white' },
  'ndure': { bg: 'bg-sky-950', text: 'text-sky-200' },
};

export function getBrandLogoUrl(brandSlug: string, fallbackUrl?: string | null): string {
  const domain = BRAND_DOMAINS[brandSlug];
  if (domain) {
    return `https://unavatar.io/${domain}`;
  }
  return fallbackUrl || '';
}

interface BrandLogoProps {
  name: string;
  slug: string;
  fallbackUrl?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  name,
  slug,
  fallbackUrl,
  className = '',
  size = 'md',
}) => {
  const [errorCount, setErrorCount] = useState(0);

  const domain = BRAND_DOMAINS[slug];
  const primarySrc = domain ? `https://unavatar.io/${domain}` : fallbackUrl;
  const secondarySrc = domain ? `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128` : '';

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm font-bold',
    xl: 'w-20 h-20 text-base font-black',
  }[size];

  const brandColor = BRAND_COLORS[slug] || { bg: 'bg-slate-900', text: 'text-white' };

  if (errorCount >= 2 || (!primarySrc && !secondarySrc)) {
    // Elegant typographic monogram fallback
    const initials = name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    return (
      <div
        className={`${sizeClasses} ${brandColor.bg} ${brandColor.text} rounded-2xl flex items-center justify-center font-display font-black tracking-tight select-none border border-white/20 shadow-xs ${className}`}
        title={name}
      >
        {initials}
      </div>
    );
  }

  const currentSrc = errorCount === 0 ? primarySrc : secondarySrc;

  return (
    <div
      className={`relative ${sizeClasses} rounded-2xl bg-white p-1.5 flex items-center justify-center border border-slate-200/80 shadow-xs overflow-hidden shrink-0 ${className}`}
    >
      <img
        src={currentSrc || ''}
        alt={`${name} logo`}
        className="w-full h-full object-contain"
        onError={() => setErrorCount((prev) => prev + 1)}
        loading="lazy"
      />
    </div>
  );
};
