'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Search, MapPin, DollarSign, Bed, Sparkles, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { Locale, SiteSettings } from '@/lib/types';
import { Dictionary } from '@/locales/dictionary';

interface HeroVideoProps {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
  availableLocations: string[];
}

export function HeroVideo({ locale, dict, settings, availableLocations }: HeroVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const isAr = locale === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedBedrooms !== 'all') params.set('bedrooms', selectedBedrooms);
    if (maxPrice) params.set('maxPrice', maxPrice);

    const queryString = params.toString();
    router.push(`/${locale}/properties${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#0c0f12] pt-24 pb-16">
      {/* Background Video with Poster Fallback */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={settings.heroVideoPoster}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        >
          <source src={settings.heroVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f12] via-[#0c0f12]/65 to-[#0c0f12]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0c0f12]/40 to-[#0c0f12]/90" />
      </div>

      {/* Video Controls (Bottom Right/Left) */}
      <div className="absolute bottom-6 end-6 z-20 flex items-center gap-2">
        <button
          onClick={togglePlay}
          type="button"
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all"
          title={isPlaying ? dict.hero.pauseVideo : dict.hero.playVideo}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
        </button>
        <button
          onClick={toggleMute}
          type="button"
          className="p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all"
          title={isMuted ? dict.hero.unmute : dict.hero.mute}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center mt-6">
        {/* Exclusive Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c5a880]/20 border border-[#c5a880]/40 text-[#dfcbb5] text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>{dict.hero.badge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl tracking-tight leading-[1.15] mb-5 font-serif-luxury drop-shadow-md">
          {dict.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#d8d2c7] max-w-2xl font-normal leading-relaxed mb-8">
          {dict.hero.subtitle}
        </p>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href={`/${locale}/properties`}
            className="btn-gold inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold shadow-lg"
          >
            <span>{dict.hero.ctaExplore}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
          <Link
            href={`/${locale}/list-your-property`}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
          >
            <Home className="w-4 h-4 text-[#c5a880]" />
            <span>{dict.hero.ctaContact}</span>
          </Link>
        </div>

        {/* Quick Search & Filter Glass Box */}
        <div className="w-full max-w-4xl glass-panel-dark rounded-2xl p-4 sm:p-5 shadow-2xl border border-white/15">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Location Select */}
            <div className="relative">
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus-within:border-[#c5a880]">
                <MapPin className="w-4 h-4 text-[#c5a880] shrink-0" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent text-sm w-full text-[#e5e1da] focus:outline-none cursor-pointer [&>option]:bg-[#161b22] [&>option]:text-white"
                >
                  <option value="">{dict.filters.allLocations}</option>
                  {availableLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bedrooms Select */}
            <div className="relative">
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus-within:border-[#c5a880]">
                <Bed className="w-4 h-4 text-[#c5a880] shrink-0" />
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="bg-transparent text-sm w-full text-[#e5e1da] focus:outline-none cursor-pointer [&>option]:bg-[#161b22] [&>option]:text-white"
                >
                  <option value="all">{dict.filters.allBeds}</option>
                  <option value="0">{dict.filters.studio}</option>
                  <option value="1">{dict.filters.bed1}</option>
                  <option value="2">{dict.filters.bed2}</option>
                  <option value="3">{dict.filters.bed3}</option>
                </select>
              </div>
            </div>

            {/* Max Price */}
            <div className="relative">
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus-within:border-[#c5a880]">
                <DollarSign className="w-4 h-4 text-[#c5a880] shrink-0" />
                <input
                  type="number"
                  placeholder={dict.filters.maxPrice}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-transparent text-sm w-full text-[#e5e1da] placeholder-[#8d8579] focus:outline-none"
                />
              </div>
            </div>

            {/* Search Submit Button */}
            <div className="sm:col-span-3 lg:col-span-1">
              <button
                type="submit"
                className="w-full h-full py-3 px-5 rounded-xl btn-gold flex items-center justify-center gap-2 text-sm font-bold shadow-md cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{dict.filters.search}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
