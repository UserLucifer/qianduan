"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mapOptions = [
  {
    id: "northAmerica",
    base: "/images/%E7%BD%91%E7%BB%9C/10004.svg",
    overlay: "/images/%E7%BD%91%E7%BB%9C/10001.svg",
    width: 1107,
    height: 963,
    baseClassName: "invert",
  },
  {
    id: "europe",
    base: "/images/%E7%BD%91%E7%BB%9C/10003.svg",
    overlay: "/images/%E7%BD%91%E7%BB%9C/10002.svg",
    width: 1107,
    height: 724,
    baseClassName: "",
  },
] as const;

type MapId = (typeof mapOptions)[number]["id"];

export default function DirectConnectMap() {
  const t = useTranslations("NetworkingServices.directConnect.map");
  const [activeMapId, setActiveMapId] = useState<MapId>("northAmerica");
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
              "h-11 rounded-full px-6 text-sm font-medium transition-colors hover:bg-white hover:text-black",
              activeMap.id === map.id ? "bg-white text-black shadow-sm" : "text-black/70",
            )}
          >
            {t(`${map.id}.label`)}
          </Button>
        ))}
      </div>

      <div className="relative mx-auto mt-10 aspect-[1.15] w-full max-w-[560px]">
        <Image
          src={activeMap.base}
          alt={t(`${activeMap.id}.alt`)}
          width={activeMap.width}
          height={activeMap.height}
          unoptimized
          className={cn("absolute inset-0 h-full w-full object-contain opacity-70", activeMap.baseClassName)}
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
