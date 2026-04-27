import Header from '../components/Header';
import Aurora from '../components/Aurora';
import Footer from '../components/Footer';
import Link from 'next/link';
import {
  FiShield,
  FiDollarSign,
  FiLock,
  FiHeadphones,
  FiSettings,
  FiBarChart2,
  FiCheck,
  FiServer,
  FiGlobe,
  FiDatabase,
  FiZap,
  FiCpu,
  FiLayers,
  FiTerminal,
  FiUsers,
  FiAward,
  FiClock,
  FiMessageSquare,
} from 'react-icons/fi';
import './enterprise.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '企业解决方案 — 算力租赁',
  description:
    '从数百到数千 GPU，我们与企业合作设计安全、可扩展的 AI 基础设施。批量定价、合规就绪、白手套支持。',
};

const navCards = [
  {
    icon: FiBarChart2,
    title: '客户案例',
    desc: '探索来自企业客户的真实用例与成功故事。',
    href: '#case-studies',
  },
  {
    icon: FiDollarSign,
    title: '大规模工作负载批量定价',
    desc: '为大规模 AI 部署提供定制定价层级与批量折扣。',
    href: '#bulk-pricing',
  },
  {
    icon: FiShield,
    title: '合规就绪的基础设施',
    desc: '为受监管的高合规环境构建完全隔离的 GPU 集群。',
    href: '#compliance',
  },
  {
    icon: FiLock,
    title: '私有网络与网络存储',
    desc: '安全网络路径、高速带宽和可扩展的存储解决方案。',
    href: '#private-networking',
  },
  {
    icon: FiHeadphones,
    title: '高端白手套支持',
    desc: '专属入驻优化与 24/7 企业级技术支持。',
    href: '#white-glove',
  },
  {
    icon: FiSettings,
    title: '定制软件与高级工作流',
    desc: '为复杂 ML/AI 项目提供定制环境与工作流支持。',
    href: '#custom-software',
  },
];

const stats = [
  { value: '200,000', label: '12 个月内从零扩展至 20 万月活用户 — 零 CapEx' },
  { value: '8×4090', label: '大规模多 GPU 集群支撑大型语言模型训练' },
  { value: '80%', label: '多 GPU 机器学习工作负载成本节省高达 80%' },
];

const supportFeatures = [
  {
    icon: FiLayers,
    title: '灵活的支持层级',
    desc: '从标准支持起步，可升级至高端层级，享受白手套服务和专属客户经理。',
  },
  {
    icon: FiUsers,
    title: '入驻与优化',
    desc: '与我们的工程师直接合作，配置、启动并持续优化您的部署以达到峰值性能。',
  },
  {
    icon: FiClock,
    title: '优先响应与升级',
    desc: '获得 SLA 保障的响应时间，以及针对生产关键问题的快速升级路径。',
  },
  {
    icon: FiMessageSquare,
    title: '实时支持与专家访问',
    desc: '按需获得实时技术支持，加上 AI 基础设施专家的架构咨询与故障排除。',
  },
];

const complianceFeatures = [
  {
    icon: FiServer,
    title: '单租户隔离',
    desc: '在专属 GPU 硬件上部署，零共享计算，确保完全的环境隔离并防止跨租户风险。',
  },
  {
    icon: FiGlobe,
    title: '数据主权',
    desc: '完全控制数据生命周期，按需删除工作负载并保证清除整个堆栈中的所有残留数据。',
  },
  {
    icon: FiShield,
    title: '自定义安全配置',
    desc: '启用可选的私有 VPN、持久审计日志和自定义安全配置文件，满足 HIPAA、GDPR 等合规要求。',
  },
  {
    icon: FiTerminal,
    title: '完全访问环境',
    desc: '通过 SSH、CLI、API 或 Jupyter 直接工作，拥有 GPU 实例和计算环境的 root 级控制权。',
  },
];

const pricingFeatures = [
  {
    icon: FiDollarSign,
    title: '批量折扣',
    desc: '根据预留容量和使用层级协商定制定价方案。',
  },
  {
    icon: FiCpu,
    title: '预留 GPU 合同',
    desc: '通过长期预留锁定优惠费率，保障关键工作负载。',
  },
  {
    icon: FiBarChart2,
    title: '成本透明',
    desc: '前期明确的定价 — 无惊喜，无隐藏费用。',
  },
  {
    icon: FiZap,
    title: '灵活承诺',
    desc: '随项目规模扩大或缩小，灵活调整合同条款。',
  },
];

const networkingFeatures = [
  {
    icon: FiLock,
    title: '私有网络与 VPN',
    desc: '设置安全子网、网络路径和 VPN 访问，实现隔离部署。',
  },
  {
    icon: FiGlobe,
    title: '区域与混合配置',
    desc: '选择特定服务器区域，或将我们的 GPU 与您的内部基础设施混合使用。',
  },
  {
    icon: FiDatabase,
    title: '定制存储与访问控制',
    desc: '可扩展存储解决方案，配备高级用户权限管理。',
  },
  {
    icon: FiZap,
    title: '专属带宽',
    desc: '预留高速连接，保证关键工作负载的性能表现。',
  },
];

const workflowItems = [
  '为小众 AI/ML 工作流量身定制集群配置',
  '部署专有或定制构建的软件栈',
  '无缝集成第三方工具',
  '支持独特的编排和任务调度需求',
];

/* ─────────────── helper sub-components ─────────────── */

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="ent-feature">
      <div className={`ent-feature__icon ent-feature__icon--${color}`}>
        <Icon />
      </div>
      <h3 className="ent-feature__title">{title}</h3>
      <p className="ent-feature__text">{desc}</p>
    </div>
  );
}

/* ─────────────── page ─────────────── */

export default function EnterprisePage() {
  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="ent-hero">
        <div className="ent-hero__bg">
          <Aurora
            colorStops={['#5e6ad2', '#a78bfa', '#38bdf8']}
            blend={0.45}
            amplitude={1.2}
            speed={0.7}
          />
        </div>
        <div className="ent-hero__content">
          <span className="ent-hero__badge">Enterprise Solutions</span>
          <h1 className="ent-hero__title">
            为企业设计<em>安全、可扩展</em>的 AI 基础设施
          </h1>
          <p className="ent-hero__desc">
            从数百到数千 GPU，我们与企业合作定制部署方案
            — 按您的条件交付性能、控制力和可靠性，无需传统云的复杂性。
          </p>
          <div className="ent-hero__actions">
            <Link href="/contact-sales" className="ent-btn ent-btn--primary">
              获取报价
            </Link>
            <Link href="#" className="ent-btn ent-btn--ghost">
              开始构建
            </Link>
          </div>
        </div>
      </section>

      {/* ── Feature Navigation ── */}
      <nav className="ent-nav" aria-label="企业功能导航">
        <div className="ent-nav__grid">
          {navCards.map((c) => {
            const Icon = c.icon;
            return (
              <a key={c.title} href={c.href} className="ent-nav__card">
                <h3 className="ent-nav__card-title">
                  <Icon style={{ marginRight: 8, verticalAlign: '-2px' }} />
                  {c.title}
                </h3>
                <p className="ent-nav__card-desc">{c.desc}</p>
              </a>
            );
          })}
        </div>
      </nav>

      {/* ── Case Studies ── */}
      <section id="case-studies" className="ent-section">
        <div className="ent-section__inner ent-section__inner--split">
          <div className="ent-section__left">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--green">
                客户案例
              </span>
              <h2 className="ent-section__title">
                看看企业如何借助我们加速构建
              </h2>
            </div>

            <div className="ent-stats">
              {stats.map((s) => (
                <div key={s.value} className="ent-stat">
                  <div className="ent-stat__value">{s.value}</div>
                  <p className="ent-stat__label">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="ent-testimonial">
              <blockquote className="ent-testimonial__quote">
                「某些实验在其他任何地方都不具成本效益。这个平台真正让我们能够大规模地进行实验。」
              </blockquote>
              <p className="ent-testimonial__author">
                — 创始人兼 CEO，AI 咨询公司
              </p>
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide07.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── White-Glove Support ── */}
      <section
        id="white-glove"
        className="ent-section ent-section--alt"
      >
        <div className="ent-section__inner ent-section__inner--split ent-section__inner--reverse">
          <div className="ent-section__left">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide08.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
              />
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--red">
                白手套支持
              </span>
              <h2 className="ent-section__title">
                从入驻到生产，全程为您的团队保驾护航
              </h2>
              <p className="ent-section__desc">
                企业级支持让您的团队快速、自信地推进项目。
              </p>
            </div>


            <div className="ent-features">
              {supportFeatures.map((f) => (
                <FeatureCard
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                  color="red"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Compliance ── */}
      <section id="compliance" className="ent-section">
        <div className="ent-section__inner ent-section__inner--split">
          <div className="ent-section__left">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--blue">
                合规就绪
              </span>
              <h2 className="ent-section__title">
                隔离基础设施与完全数据控制
              </h2>
              <p className="ent-section__desc">
                为受监管行业和关键工作负载构建的安全计算环境。
              </p>
            </div>

            <div className="ent-features">
              {complianceFeatures.map((f) => (
                <FeatureCard
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                  color="blue"
                />
              ))}
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide04.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Bulk Pricing ── */}
      <section
        id="bulk-pricing"
        className="ent-section ent-section--alt"
      >
        <div className="ent-section__inner ent-section__inner--split ent-section__inner--reverse">
          <div className="ent-section__left">
            <div className="ent-video-wrapper">
              <video
                src="/videos/the-engine-of-ai.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
              />
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--amber">
                批量定价
              </span>
              <h2 className="ent-section__title">
                部署规模越大，节省越多
              </h2>
              <p className="ent-section__desc">
                为运行大规模、长期工作负载的团队提供灵活的定价协议。
              </p>
            </div>

            <div className="ent-features">
              {pricingFeatures.map((f) => (
                <FeatureCard
                  key={f.title}
                  icon={f.icon}
                  title={f.title}
                  desc={f.desc}
                  color="amber"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Private Networking ── */}
      <section id="private-networking" className="ent-section">
        <div className="ent-section__inner">
          <div className="ent-section__header">
            <span className="ent-section__eyebrow ent-section__eyebrow--violet">
              私有网络
            </span>
            <h2 className="ent-section__title">
              私有网络与网络存储
            </h2>
            <p className="ent-section__desc">
              为有高级需求的团队提供深度基础设施灵活性
              — 包括私有网络、专属带宽和可定制的存储解决方案。
            </p>
          </div>

          <div className="ent-features">
            {networkingFeatures.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                color="violet"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Custom Software ── */}
      <section
        id="custom-software"
        className="ent-section ent-section--alt"
      >
        <div className="ent-section__inner ent-section__inner--split">
          <div className="ent-section__left">
            <div className="ent-section__header">
              <span className="ent-section__eyebrow ent-section__eyebrow--cyan">
                定制工作流
              </span>
              <h2 className="ent-section__title">
                定制软件与高级工作流
              </h2>
              <p className="ent-section__desc">
                支持复杂用例 — 从专业机器学习框架到定制编排配置
                — 让您的团队按需构建。
              </p>
            </div>

            <div className="ent-checklist">
              {workflowItems.map((item) => (
                <div key={item} className="ent-checklist__item">
                  <span className="ent-checklist__icon">
                    <FiCheck />
                  </span>
                  <span className="ent-checklist__text">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ent-section__right">
            <div className="ent-video-wrapper">
              <video
                src="/videos/nv-brochure-2023-08-slide06.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="ent-side-video"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Bottom ── */}
      <section className="ent-cta">
        <div className="ent-cta__inner">
          <FiAward
            style={{ fontSize: 32, color: 'var(--accent)', marginBottom: 20 }}
          />
          <h2 className="ent-cta__title">
            大胆构建，<span>自信扩展</span>
          </h2>
          <p className="ent-cta__desc">
            企业级安全、定制部署、世界级支持。
            我们为您的团队提供所需的 GPU 基础设施 — 毫不妥协。
          </p>
          <div className="ent-cta__actions">
            <Link href="#" className="ent-btn ent-btn--primary">
              开始使用
            </Link>
            <Link
              href="/contact-sales"
              className="ent-btn ent-btn--ghost"
            >
              联系销售
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
