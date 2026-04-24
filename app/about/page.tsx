"use client";

import { useState } from 'react';
import Header from '../components/Header';
import Aurora from '../components/Aurora';
import LogoCarousel from "../components/LogoCarousel";
import Footer from '../components/Footer';
import Image from 'next/image';
import {
  FiChevronDown,
  FiSearch,
  FiHeart,
  FiKey,
  FiStar,
  FiUsers,
} from 'react-icons/fi';
import './about.css';

const values = [
  {
    icon: FiSearch,
    title: '持续学习，勇于创新',
    subtitle: 'Mindset & Curiosity',
    description:
      '我们培养持续学习的心态，深知好奇心是创新的源动力。我们主动寻求信息，敢于质疑假设，并重视多元视角。好奇心是一种驱动力，让我们能够探索那些突破边界、挑战现状的创意与创新，从而更好地服务我们的客户。',
  },
  {
    icon: FiHeart,
    title: '透明信任，赋能成功',
    subtitle: 'Trust & Support',
    description:
      '我们信任彼此做出的决策，保持透明沟通，并明确目标。我们互相提供成功所需的工具、资源和反馈。我们深知，当员工感到被重视、被支持、被倾听时，他们才能发挥出最佳水平。',
  },
  {
    icon: FiKey,
    title: '主动担当，自我问责',
    subtitle: 'Accountability & Initiative',
    description:
      '我们对自己的工作和决策承担全部责任，致力于为任何挑战寻找最佳解决方案。等待他人解决问题？绝非我们的风格——我们积极行动，勇于创新，推动进步。我们主动出击，自我问责，并营造一种让每个人都感到被赋能、能为共同成功贡献力量的文化。',
  },
  {
    icon: FiStar,
    title: '客户至上，追求卓越',
    subtitle: 'Customer Obsession',
    description:
      '有人可能会说我们对客户近乎"痴迷"。我们竭尽全力理解客户需求，力求在每一个环节都超越预期。我们对卓越的承诺确保了我们能够建立持久的合作伙伴关系，并为卓越服务树立行业标杆。',
  },
  {
    icon: FiUsers,
    title: '团队协作，共创未来',
    subtitle: 'Collaboration',
    description:
      '协作是我们成功的核心。齐心协力，我们能释放更大的潜力，更高效地解决挑战。我们相信，通过利用多元视角、相互支持并拧成一股绳，我们可以成就单打独斗永远无法企及的目标。',
  },
];

const teamMembers = [
  {
    name: 'Mike Intrator',
    role: 'Chief Executive Officer, Co-founder',
    image: '/images/conpany-team/10001.avif',
  },
  {
    name: 'Brian Venturo',
    role: 'Chief Strategy Officer, Co-founder',
    image: '/images/conpany-team/10002.avif',
  },
  {
    name: 'Brannin McBee',
    role: 'Chief Development Officer, Co-founder',
    image: '/images/conpany-team/10003.avif',
  },
  {
    name: 'Peter Salanki',
    role: 'Chief Technology Officer, Co-founder',
    image: '/images/conpany-team/10004.avif',
  },
  {
    name: 'Max Nova',
    role: 'Chief Product Officer',
    image: '/images/conpany-team/10005.avif',
  },
  {
    name: 'Sarah Chen',
    role: 'VP of Engineering',
    image: '/images/conpany-team/10006.avif',
  },
  {
    name: 'David Miller',
    role: 'Head of Infrastructure',
    image: '/images/conpany-team/10007.avif',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Creative Director',
    image: '/images/conpany-team/10008.avif',
  },
];

export default function AboutPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleValue = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Header />

      {/* Module 1: Hero with Aurora */}
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
          <h1 className="about-hero__title">我们能做什么</h1>
          <p className="about-hero__text">
            我们是一个专为规模化、支持和加速 GenAI 而构建的
            <span className="about-hero__highlight">云计算平台</span>
            。我们是一个综合性平台和战略合作伙伴，旨在应对当下和未来在规模化部署 AI 时面临的挑战。我们管理 AI 增长的复杂性，使超级计算触手及，并不断突破可能性的边界。我们的团队打造现代化解决方案来支持现代化技术。选择我们，获得处理 GenAI 工作负载的首选平台。
          </p>
        </div>
      </section>

      {/* Module 2: Video — full width, outside .shell */}
      <section className="about-video">
        <video
          className="about-video__player"
          src="/videos/nv-brochure-2023-08-slide03.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </section>

      {/* Module 3: Our Values — Full Width Layout */}
      <section className="about-values">
        <div className="about-values__layout">
          <div className="about-values__left">
            <div className="about-values__content">
              <h2 className="about-values__title">我们的价值观</h2>
              <p className="about-values__subtitle">
                我们相信人的力量。作为快速行动者和前瞻性思考者，我们的价值观是驱动我们工作的核心理念。
              </p>
            </div>
          </div>

          <div className="about-values__right">
            {values.map((value, index) => {
              const isOpen = openIndex === index;
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className={`about-values__item ${isOpen ? 'is-open' : ''}`}
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
                    <FiChevronDown className={`about-values__chevron ${isOpen ? 'rotated' : ''}`} />
                  </button>
                  <div
                    className="about-values__answer-wrapper"
                    style={{
                      maxHeight: isOpen ? '300px' : '0',
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

      {/* Module 4: Our Team — Full Width Background */}
      <section className="about-team">
        <div className="shell">
          <div className="about-team__header">
            <h2 className="about-team__title">我们的团队</h2>
            <p className="about-team__subtitle">了解我们</p>
          </div>

          <div className="about-team__grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-card__image-container">
                  <Image src={member.image} alt={member.name} width={300} height={400} />
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

      {/* Module 5: Clients & Partners — Light Background with Optimized Padding */}
      <div className="about-logos">
        <LogoCarousel
          title="我们的客户与合作伙伴"
          subtitle="这些客户信任我们来处理其业务关键的 AI 工作负载。"
        />
      </div>

      {/* Module 6: CTA — Full Width Video with Left Content */}
      <section className="about-cta">
        <video
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
              我们构建全球人工<br />
              智能基础设施
            </h2>
            <p className="about-cta__text">
              对AI最友好的 GPU 集群
            </p>
          </div>
        </div>
      </section>

      {/* Module 7: Our Vision — Left Content with Background */}
      <section className="about-vision">
        <div className="about-vision__container">
          <div className="about-vision__content">
            <h2 className="about-vision__title">
              我们的愿景：<br />一人一台 GPU
            </h2>
            <p className="about-vision__text">
              我们最初作为机器学习工程师创立公司，是为了解决我们自身面临的扩展性问题，并构建我们梦寐以求的工具。这种业余时间的辛勤工作逐渐发展成为追求千兆瓦级人工智能工厂的事业，为那些不断开拓前沿的团队提供服务。
            </p>
            <p className="about-vision__text">
              我们的使命是让计算能力像电力一样普及，让每个人都能拥有超级智能。从单个 GPU 到数十万个 GPU，我们构建的基础设施为数亿人使用的 AI 服务提供动力。
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
