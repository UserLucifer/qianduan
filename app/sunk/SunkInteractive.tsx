'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export type SunkTestimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
  logo?: string;
  logoAlt?: string;
  logoText?: string;
};

export function HeroVideoFrame({
  src,
  ariaLabel,
  className = '',
}: {
  src: string;
  ariaLabel: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        aria-label={ariaLabel}
        loop
        muted
        playsInline
        preload="metadata"
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-white/10" />
      <Button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause SUNK video' : 'Play SUNK video'}
        className={`absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b45f5] p-0 text-white shadow-[0_18px_50px_rgba(11,69,245,0.28)] transition duration-300 hover:bg-[#2a61ff] ${
          isPlaying ? 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100' : 'opacity-100'
        }`}
      >
        <Play className="ml-1 h-8 w-8 fill-current" />
      </Button>
    </div>
  );
}

export function TestimonialCarousel({ testimonials }: { testimonials: SunkTestimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;

    if (!track || !slide) return;

    track.scrollTo({
      left: slide.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const timer = window.setInterval(() => {
      scrollToIndex((activeIndex + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [activeIndex, scrollToIndex, testimonials.length]);

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    const closestIndex = slides.reduce((closest, slide, index) => {
      const currentDistance = Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft);
      const closestSlide = slides[closest];
      const closestDistance = closestSlide
        ? Math.abs(closestSlide.offsetLeft - track.offsetLeft - track.scrollLeft)
        : Number.POSITIVE_INFINITY;

      return currentDistance < closestDistance ? index : closest;
    }, 0);

    setActiveIndex(closestIndex);
  };

  return (
    <>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="mt-14 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="grid min-w-full snap-center overflow-hidden rounded-[18px] bg-white text-left lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="flex min-h-[520px] flex-col p-10 sm:p-14">
              <div className="text-[110px] font-semibold leading-none text-[#d9e8ff]">&ldquo;</div>
              <p className="-mt-8 max-w-[580px] text-2xl font-medium leading-9 text-black">
                {item.quote}
              </p>
              <div className="mt-10">
                <p className="text-xl font-semibold">{item.name}</p>
                <p className="mt-2 text-base italic text-black/72">{item.role}</p>
              </div>
              <div className="mt-auto pt-10">
                {item.logoText ? (
                  <span className="text-4xl font-black tracking-[-0.08em] text-black">
                    {item.logoText}
                  </span>
                ) : item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.logoAlt ?? ''}
                    width={150}
                    height={54}
                    className="h-9 w-auto object-contain"
                  />
                ) : null}
              </div>
            </div>
            <div className="relative min-h-[420px] bg-[#d6e8ff]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto mt-2 flex w-max items-center gap-2">
        {testimonials.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={`h-1 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'w-6 bg-[#ef4444]' : 'w-3 bg-[#d7dbe2]'
            }`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Show testimonial ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
}
