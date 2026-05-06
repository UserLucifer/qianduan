'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mapOptions = [
  {
    id: 'north-america',
    label: '北美',
    base: '/images/网络/10004.svg',
    overlay: '/images/网络/10001.svg',
    alt: '北美 Direct Connect 网络节点地图',
    width: 1107,
    height: 963,
    baseClassName: 'invert',
  },
  {
    id: 'europe',
    label: '欧洲',
    base: '/images/网络/10003.svg',
    overlay: '/images/网络/10002.svg',
    alt: '欧洲 Direct Connect 网络节点地图',
    width: 1107,
    height: 724,
    baseClassName: '',
  },
] as const;

export default function DirectConnectMap() {
  const [activeMapId, setActiveMapId] = useState<(typeof mapOptions)[number]['id']>('north-america');
  const activeMap = mapOptions.find((map) => map.id === activeMapId) ?? mapOptions[0];

  return (
    <div className="mt-10">
      <div className="mx-auto flex w-fit rounded-full bg-[#eef1f4] p-2 text-sm text-black">
        {mapOptions.map((map) => (
          <Button
            key={map.id}
            type="button"
            variant="ghost"
            onClick={() => setActiveMapId(map.id)}
            className={cn(
              'h-11 rounded-full px-6 text-sm font-medium transition-colors hover:bg-white hover:text-black',
              activeMap.id === map.id ? 'bg-white text-black shadow-sm' : 'text-black/70'
            )}
          >
            {map.label}
          </Button>
        ))}
      </div>

      <div className="relative mx-auto mt-10 aspect-[1.15] w-full max-w-[560px]">
        <Image
          src={activeMap.base}
          alt={activeMap.alt}
          width={activeMap.width}
          height={activeMap.height}
          unoptimized
          className={cn('absolute inset-0 h-full w-full object-contain opacity-70', activeMap.baseClassName)}
        />
        <Image
          src={activeMap.overlay}
          alt=""
          width={activeMap.width}
          height={activeMap.height}
          unoptimized
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
