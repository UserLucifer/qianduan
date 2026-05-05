import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const products = [
  {
    name: "RTX 5090",
    architecture: "Blackwell",
    vram: "32GB VRAM",
    price: "$0.37",
    range: "$0.16 - $26.67/hr range",
    demand: "High",
    bars: 3,
    tone: "orange",
    sparkline: "M0 54 L22 54 C28 54 27 18 40 18 C72 22 122 18 164 19 C178 19 184 14 192 18 C202 24 211 15 224 19 C236 23 244 18 258 18 L320 18",
  },
  {
    name: "RTX 4090",
    architecture: "Ada Lovelace",
    vram: "24GB VRAM",
    price: "$0.30",
    range: "$0.13 - $1.33/hr range",
    demand: "High",
    bars: 3,
    tone: "orange",
    sparkline: "M0 49 C14 54 15 22 28 27 C42 34 42 10 56 17 C70 28 72 8 86 17 C99 35 113 26 126 29 C140 32 141 55 154 48 C168 42 164 14 178 18 C190 26 204 23 224 23 L248 23 C258 20 258 52 274 48 C290 43 286 28 306 31 L320 30",
  },
  {
    name: "H200",
    architecture: "Hopper",
    vram: "141GB VRAM",
    price: "$3.44",
    range: "$2.58 - $5.68/hr range",
    demand: "Low",
    bars: 1,
    tone: "orange",
    sparkline: "M0 48 C16 48 22 50 28 46 C36 40 34 18 48 18 C80 17 126 19 176 18 C190 19 198 20 212 18 C238 18 276 18 320 18",
  },
  {
    name: "B200",
    architecture: "Blackwell",
    vram: "192GB VRAM",
    price: "$3.85",
    range: "$3.56 - $12.50/hr range",
    demand: "Low",
    bars: 1,
    tone: "orange",
    sparkline: "M0 43 C14 44 18 38 28 39 L84 39 C98 39 96 45 112 44 C132 43 136 48 142 39 C148 28 156 28 170 29 C182 29 176 41 192 40 C210 38 206 48 226 44 C244 38 234 20 250 36 C262 48 270 44 282 43 C300 40 292 26 320 26",
  },
  {
    name: "RTX PRO 6000 S",
    architecture: "Blackwell",
    vram: "48GB VRAM",
    price: "$1.20",
    range: "$0.67 - $2.00/hr range",
    demand: "Med",
    bars: 2,
    tone: "orange",
    sparkline: "M0 46 C52 45 110 43 156 43 C168 44 160 24 176 25 L232 25 C242 24 236 20 250 20 L320 20",
  },
  {
    name: "RTX PRO 6000 WS",
    architecture: "Blackwell",
    vram: "96GB VRAM",
    price: "$0.96",
    range: "$0.45 - $2.67/hr range",
    demand: "Med",
    bars: 2,
    tone: "teal",
    sparkline: "M0 28 L62 28 C72 27 78 29 88 29 L156 29 C166 31 176 30 186 36 C198 44 220 40 246 40 L296 40 C304 40 304 34 320 34",
  },
];

function DemandBars({ active }: { active: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((bar) => (
        <span
          key={bar}
          className={
            bar < active
              ? "h-2 w-4 rounded-full bg-[#12d6b0]"
              : "h-2 w-4 rounded-full bg-[#d0d6e0]"
          }
        />
      ))}
    </div>
  );
}

function Sparkline({ path, tone }: { path: string; tone: "orange" | "teal" }) {
  const stroke = tone === "teal" ? "#12d6b0" : "#ff4b00";
  const fill = tone === "teal" ? "rgba(18, 214, 176, 0.12)" : "rgba(255, 75, 0, 0.12)";

  return (
    <svg
      className="h-16 w-full overflow-visible"
      viewBox="0 0 320 70"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d={`${path} L320 70 L0 70 Z`} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function ProductList() {
  return (
    <section className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] bg-[#08090a] px-6 py-20 text-[#f7f8f8] sm:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-[510] leading-none tracking-normal text-[#f7f8f8] md:text-5xl">
            实时 GPU 基础设施
          </h2>
          <p className="mt-5 text-base leading-7 text-[#d0d6e0] md:text-lg">
            覆盖 20,000+ GPU 的透明算力供给，按需租用、实时查询、快速交付。
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.name}
              className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.055] text-[#f7f8f8] shadow-none transition-colors hover:border-white/20"
            >
              <CardHeader className="flex-row items-start justify-between space-y-0 p-5 pb-3">
                <div>
                  <CardTitle className="text-xl font-[590] leading-none tracking-normal text-[#f7f8f8]">
                    {product.name}
                  </CardTitle>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#a4acb6]">
                    <Badge className="rounded-[4px] border-0 bg-white/10 px-2 py-1 text-xs font-[510] text-[#f7f8f8] shadow-none">
                      {product.architecture}
                    </Badge>
                    <span>{product.vram}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DemandBars active={product.bars} />
                  <Badge
                    variant="outline"
                    className="rounded-[4px] border-white/20 bg-transparent px-2.5 py-1 text-xs font-[510] text-[#f7f8f8]"
                  >
                    {product.demand}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-2">
                <Sparkline path={product.sparkline} tone={product.tone as "orange" | "teal"} />

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-[590] leading-none tracking-normal text-[#f7f8f8]">
                        {product.price}
                      </span>
                      <span className="text-sm text-[#d0d6e0]">/hr</span>
                    </div>
                    <p className="mt-3 text-sm text-[#8a8f98]">{product.range}</p>
                  </div>
                  <Button asChild size="sm" className="rounded-[6px] bg-[#3155f6] px-4 font-[590] text-white hover:bg-[#4568ff]">
                    <Link href="/rental">租用</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-[8px] border-white/80 bg-transparent px-5 font-[590] text-[#f7f8f8] shadow-none hover:bg-white/10 hover:text-[#f7f8f8]"
          >
            <Link href="/rental">
              查看全部 GPU
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
