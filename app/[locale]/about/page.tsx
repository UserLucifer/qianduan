"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Header from "@/components/marketing/Header";
import Aurora from "@/components/marketing/Aurora";
import LogoCarousel from "@/components/marketing/LogoCarousel";
import Footer from "@/components/marketing/Footer";
import {
  FiChevronDown,
  FiHeart,
  FiKey,
  FiSearch,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import "./about.css";

type ValueCopy = {
  title: string;
  subtitle: string;
  description: string;
};

type TeamMemberCopy = {
  name: string;
  role: string;
};

const valueIcons = [FiSearch, FiHeart, FiKey, FiStar, FiUsers] as const;

const teamImages = [
  "/images/conpany-team/10001.avif",
  "/images/conpany-team/10002.avif",
  "/images/conpany-team/10003.avif",
  "/images/conpany-team/10004.avif",
  "/images/conpany-team/10005.avif",
  "/images/conpany-team/10006.avif",
  "/images/conpany-team/10007.avif",
  "/images/conpany-team/10008.avif",
] as const;

export default function AboutPage() {
  const t = useTranslations("About");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const values = t.raw("values.items") as ValueCopy[];
  const teamMembers = t.raw("team.members") as TeamMemberCopy[];

  const toggleValue = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />

      <section className="about-hero">
        <div className="about-hero__background">
          <Aurora
            colorStops={["#5227FF", "#B497CF", "#7cff67"]}
            blend={0.4}
            amplitude={1.4}
            speed={0.8}
          />
        </div>
        <div className="about-hero__content">
          <h1 className="about-hero__title">{t("hero.title")}</h1>
          <p className="about-hero__text">
            {t("hero.textBefore")}
            <span className="about-hero__highlight">{t("hero.highlight")}</span>
            {t("hero.textAfter")}
          </p>
        </div>
      </section>

      <section className="about-video">
        <video
          aria-label={t("video.label")}
          className="about-video__player"
          src="/videos/nv-brochure-2023-08-slide03.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </section>

      <section className="about-values">
        <div className="about-values__layout">
          <div className="about-values__left">
            <div className="about-values__content">
              <h2 className="about-values__title">{t("values.title")}</h2>
              <p className="about-values__subtitle">{t("values.description")}</p>
            </div>
          </div>

          <div className="about-values__right">
            {values.map((value, index) => {
              const isOpen = openIndex === index;
              const IconComponent = valueIcons[index] as IconType;

              return (
                <div
                  key={value.title}
                  className={`about-values__item ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    className="about-values__question"
                    onClick={() => toggleValue(index)}
                    aria-expanded={isOpen}
                  >
                    <div className="about-values__icon-title">
                      <span className="about-values__icon">
                        <IconComponent />
                      </span>
                      <span className="about-values__name">{value.title}</span>
                    </div>
                    <FiChevronDown className={`about-values__chevron ${isOpen ? "rotated" : ""}`} />
                  </button>
                  <div
                    className="about-values__answer-wrapper"
                    style={{
                      maxHeight: isOpen ? "300px" : "0",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="about-values__answer">
                      <span className="about-values__en-tag">{value.subtitle}</span>
                      <p>{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="shell">
          <div className="about-team__header">
            <h2 className="about-team__title">{t("team.title")}</h2>
            <p className="about-team__subtitle">{t("team.subtitle")}</p>
          </div>

          <div className="about-team__grid">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="team-card">
                <div className="team-card__image-container">
                  <Image
                    src={teamImages[index]}
                    alt={member.name}
                    width={300}
                    height={400}
                  />
                  <div className="team-card__info">
                    <h3 className="team-card__name">{member.name}</h3>
                    <p className="team-card__role">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="about-logos">
        <LogoCarousel
          title={t("partners.title")}
          subtitle={t("partners.subtitle")}
        />
      </div>

      <section className="about-cta">
        <video
          aria-label={t("cta.videoLabel")}
          className="about-cta__video"
          src="/videos/the-engine-of-ai.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="about-cta__overlay" />
        <div className="about-cta__container">
          <div className="about-cta__content">
            <h2 className="about-cta__title">
              {t("cta.titleLine1")}
              <br />
              {t("cta.titleLine2")}
            </h2>
            <p className="about-cta__text">{t("cta.description")}</p>
          </div>
        </div>
      </section>

      <section className="about-vision">
        <div className="about-vision__container">
          <div className="about-vision__content">
            <h2 className="about-vision__title">
              {t("vision.titleLine1")}
              <br />
              {t("vision.titleLine2")}
            </h2>
            <p className="about-vision__text">{t("vision.paragraph1")}</p>
            <p className="about-vision__text">{t("vision.paragraph2")}</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
