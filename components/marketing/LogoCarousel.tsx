"use client";

import {
  SiShopify,
  SiAccenture,
  SiWebflow,
  SiMeta,
  SiNvidia,
  SiSnapchat,
  SiSiemens,
  SiBurton
} from 'react-icons/si';
import { FaMicrosoft } from 'react-icons/fa';

import './LogoCarousel.css';

interface LogoCarouselProps {
  title?: string;
  subtitle?: string;
}

export default function LogoCarousel({ title, subtitle }: LogoCarouselProps) {
  const logos = [
    { name: "Scale", content: <span className="logo-text" style={{ textTransform: 'lowercase' }}>scale</span> },
    {
      name: "NVIDIA", content: (
        <div className="logo-wrapper">
          <SiNvidia size={24} />
          <span className="logo-text" style={{ fontWeight: 700, letterSpacing: '0.02em' }}>NVIDIA</span>
        </div>
      )
    },
    { name: "Google", content: <span className="logo-text" style={{ fontWeight: 500 }}>Google</span> },
    {
      name: "Shopify", content: (
        <div className="logo-wrapper">
          <SiShopify size={24} />
          <span className="logo-text" style={{ fontWeight: 600 }}>shopify</span>
        </div>
      )
    },
    {
      name: "Accenture", content: (
        <div className="logo-wrapper">
          <SiAccenture size={24} />
          <span className="logo-text" style={{ fontWeight: 600 }}>accenture</span>
        </div>
      )
    },
    { name: "Giphy", content: <span className="logo-text" style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>GIPHY</span> },

    {
      name: "Webflow", content: (
        <div className="logo-wrapper">
          <SiWebflow size={24} />
          <span className="logo-text" style={{ fontWeight: 500 }}>Webflow</span>
        </div>
      )
    },
    {
      name: "Alloy", content: (
        <div className="logo-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 12l10 10 10-10L12 2zm0 2.8L19.2 12 12 19.2 4.8 12 12 4.8z" />
            <path d="M12 7l-5 5 5 5 5-5-5-5z" opacity="0.5" />
          </svg>
          <span className="logo-text logo-text--bold">Alloy</span>
        </div>
      )
    },
    { name: "OpenAI", content: <span className="logo-text" style={{ fontWeight: 600 }}>OpenAI</span> },
    {
      name: "Microsoft", content: (
        <div className="logo-wrapper">
          <FaMicrosoft size={24} />
          <span className="logo-text" style={{ fontWeight: 500 }}>Microsoft</span>
        </div>
      )
    },
    {
      name: "Luma", content: (
        <div className="logo-wrapper" style={{ gap: '4px' }}>
          <span className="logo-text" style={{ fontWeight: 500 }}>luma</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0l2 9 9 2-9 2-2 9-2-9-9-2 9-2z" />
          </svg>
        </div>
      )
    },

    {
      name: "Meta", content: (
        <div className="logo-wrapper">
          <SiMeta size={24} />
          <span className="logo-text" style={{ fontWeight: 500 }}>Meta</span>
        </div>
      )
    },
    { name: "Snapchat", content: <SiSnapchat size={28} /> },
    { name: "Forbes", content: <span className="logo-text logo-text--serif">Forbes</span> },
    { name: "Siemens", content: <SiSiemens size={64} /> },
    {
      name: "Burton", content: (
        <div className="logo-wrapper">
          <SiBurton size={24} />
          <span className="logo-text" style={{ fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Burton</span>
        </div>
      )
    },
  ];

  return (
    <div className="logo-carousel">
      <div className="logo-carousel__header">
        {title ? (
          <div className="logo-carousel__custom-header">
            <h2 className="logo-carousel__title">{title}</h2>
            {subtitle && <p className="logo-carousel__subtitle">{subtitle}</p>}
          </div>
        ) : (
          <p>
            <span style={{ opacity: 0.5 }}>超过一万家公司，从初创企业到财富500强，都在我们的平台上运营业务.</span>
          </p>
        )}
      </div>
      <div className="logo-carousel__marquee-container">
        <div className="logo-carousel__marquee">
          {logos.map((logo, index) => (
            <div key={`${logo.name}-${index}`} className="logo-carousel__item">
              {logo.content}
            </div>
          ))}
          {/* Duplicate for infinite seamless scrolling */}
          {logos.map((logo, index) => (
            <div key={`${logo.name}-dup-${index}`} className="logo-carousel__item">
              {logo.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
