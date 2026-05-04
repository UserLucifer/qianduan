import Header from '@/components/marketing/Header';
import Aurora from '@/components/marketing/Aurora';
import Footer from '@/components/marketing/Footer';
import Link from 'next/link';
import { 
  FiZap, 
  FiMaximize, 
  FiShare2, 
  FiActivity,
  FiServer,
} from 'react-icons/fi';
import './gpu-computing.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GPU 计算 — 算力租赁',
  description: '获取领先的 AI 优化 NVIDIA GPU，包括 Blackwell、Hopper 与 Ada Lovelace 架构，助力最复杂的 AI 工作负载。',
};

const featuredGpus = [
  {
    id: 'blackwell',
    title: 'NVIDIA GB200 NVL72',
    tag: 'Blackwell 架构',
    desc: '面向实时万亿参数大语言模型推理与训练的领先平台。',
    features: [
      { label: '训练性能', value: '提升达 4 倍' },
      { label: '推理速度', value: '提升达 30 倍' },
      { label: '互联带宽', value: '双向 1.8TB/s' },
      { label: '冷却技术', value: '先进液冷设计' }
    ],
    color: 'cyan'
  },
  {
    id: 'h200',
    title: 'NVIDIA HGX H200',
    tag: 'Hopper 架构',
    desc: '首款搭载 HBM3e 的 GPU，为生成式 AI 提供海量显存与吞吐量。',
    features: [
      { label: '显存容量', value: '141GB HBM3e' },
      { label: '内存带宽', value: '4.8TB/s' },
      { label: '性能对比', value: '1.9x 胜过 H100' },
      { label: '互联', value: 'NVLink 第 4 代' }
    ],
    color: 'blue'
  },
  {
    id: 'h100',
    title: 'NVIDIA HGX H100',
    tag: 'Hopper 架构',
    desc: '行业标准的 AI 算力核心，助力全球最快超级计算机。',
    features: [
      { label: '显存容量', value: '80GB HBM3' },
      { label: '互联带宽', value: '900GB/s' },
      { label: '训练效率', value: '4x 胜过 A100' },
      { label: '网络', value: 'InfiniBand 400G' }
    ],
    color: 'violet'
  },
  {
    id: 'l40s',
    title: 'NVIDIA L40S',
    tag: 'Ada Lovelace 架构',
    desc: '多功能工作负载的最佳选择，平衡训练、推理与图形处理。',
    features: [
      { label: '显存', value: '48GB GDDR6' },
      { label: '算力', value: '733 TFLOPs' },
      { label: '核心数', value: '18,176 CUDA' },
      { label: '优势', value: '2x 胜过 A40' }
    ],
    color: 'indigo'
  }
];

const efficiencyCards = [
  {
    icon: FiActivity,
    title: '持续稳定的性能',
    desc: '算力规模必须伴随稳定性。我们的客户在使用中体验到更少的服务中断，节省数百万 GPU 小时。'
  },
  {
    icon: FiZap,
    title: '高效的基础设施',
    desc: '通过高达 20% 的系统有效利用率 (MFU) 提升，客户可以用更少的基础设施实现相同的性能。'
  },
  {
    icon: FiActivity,
    title: '原生弹性支持',
    desc: '内置自动健康检查与节点生命周期管理，全程监控集群性能，确保生产环境的高可用性。'
  }
];

const portfolio = [
  'GB300 NVL72', 'B200', 'A100', 'H100', 'H200', 'RTX PRO 6000', 'L40', 'L40S', 'A40', 'V100'
];

export default function GpuComputingPage() {
  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="gpu-hero">
        <div className="gpu-hero__bg">
          <Aurora
            colorStops={['#0ea5e9', '#6366f1', '#a855f7']}
            blend={0.5}
            amplitude={1.1}
            speed={0.6}
          />
        </div>
        <div className="gpu-hero__content">
          <span className="gpu-hero__badge">GPU Compute</span>
          <h1 className="gpu-hero__title">
            面向 AI 模型与创新的<br /><em>高性能 GPU 计算</em>
          </h1>
          <p className="gpu-hero__desc">
            快速获取领先的 AI 优化 NVIDIA GPU，抢占市场先机。
            基于裸金属架构，为最复杂的 AI 工作负载提供极限性能、控制力与可扩展性。
          </p>
          <div className="gpu-hero__actions">
            <Link href="/contact-sales" className="ent-btn ent-btn--primary">
              获取算力支持
            </Link>
            <Link href="/pricing" className="ent-btn ent-btn--ghost">
              查看定价
            </Link>
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <div className="gpu-highlights">
        <div className="gpu-highlight-card">
          <div className="gpu-highlight-card__icon"><FiServer /></div>
          <h3 className="gpu-highlight-card__title">裸金属性能</h3>
          <p className="gpu-highlight-card__desc">无虚拟化损耗，直接访问 GPU 核心，确保最低延迟与最高吞吐。</p>
        </div>
        <div className="gpu-highlight-card">
          <div className="gpu-highlight-card__icon"><FiShare2 /></div>
          <h3 className="gpu-highlight-card__title">超速互联</h3>
          <p className="gpu-highlight-card__desc">采用 NVIDIA Quantum-2 InfiniBand 网络，提供 3200Gbps 节点间带宽。</p>
        </div>
        <div className="gpu-highlight-card">
          <div className="gpu-highlight-card__icon"><FiMaximize /></div>
          <h3 className="gpu-highlight-card__title">弹性扩展</h3>
          <p className="gpu-highlight-card__desc">从单卡测试到万卡集群，分钟级完成部署，随业务需求无缝扩展。</p>
        </div>
      </div>

      {/* ── Featured Products ── */}
      <section className="gpu-section">
        <div className="gpu-section__inner">
          <div className="gpu-section__header">
            <span className="gpu-section__eyebrow">算力矩阵</span>
            <h2 className="gpu-section__title">为您的 AI 突破提供动力</h2>
            <p className="gpu-section__desc">
              从尖端的 Blackwell 架构到高性价比的 Ada Lovelace 架构，
              我们提供全系列 NVIDIA GPU，满足您在训练、微调与推理过程中的多样化需求。
            </p>
          </div>

          <div className="gpu-product-grid">
            {featuredGpus.map((gpu) => (
              <div key={gpu.id} className="gpu-product-card">
                <div className="gpu-product-card__content">
                  <span className="gpu-product-card__tag">{gpu.tag}</span>
                  <h3 className="gpu-product-card__title">{gpu.title}</h3>
                  <p className="gpu-product-card__desc">{gpu.desc}</p>
                  
                  <div className="gpu-product-card__specs">
                    {gpu.features.map((spec, idx) => (
                      <div key={idx} className="gpu-spec-item">
                        <span className="gpu-spec-item__label">{spec.label}</span>
                        <span className="gpu-spec-item__value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio Bar ── */}
      <section className="gpu-portfolio">
        <div className="gpu-section__inner">
          <div className="gpu-section__header" style={{ textAlign: 'center', margin: '0 auto 40px' }}>
            <span className="gpu-section__eyebrow">全量阵容</span>
            <h2 className="gpu-section__title" style={{ fontSize: '1.5rem' }}>更多 GPU 配置可选</h2>
          </div>
          <div className="gpu-portfolio__grid">
            {portfolio.map((item) => (
              <div key={item} className="gpu-portfolio__item">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quote ── */}
      <section className="gpu-quote-section">
        <div className="gpu-quote-container">
          <p className="gpu-quote__text">
            “训练最先进的模型并进行大规模推理需要数万亿次的同步计算。这不仅仅是显存的问题，更是基础设施整体效能的博弈。”
          </p>
          <div className="gpu-quote__author">
            — <span>Brannin McBee</span>, 算力基础设施专家
          </div>
        </div>
      </section>

      {/* ── Efficiency ── */}
      <section className="gpu-section gpu-section--alt">
        <div className="gpu-section__inner">
          <div className="gpu-section__header">
            <span className="gpu-section__eyebrow">技术优势</span>
            <h2 className="gpu-section__title">为何选择我们的 AI 云平台</h2>
          </div>

          <div className="gpu-efficiency-grid">
            {efficiencyCards.map((card, idx) => (
              <div key={idx} className="gpu-efficiency-card">
                <div className="gpu-efficiency-card__icon"><card.icon /></div>
                <h3 className="gpu-efficiency-card__title">{card.title}</h3>
                <p className="gpu-efficiency-card__desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data Center Info ── */}
      <section className="gpu-section">
        <div className="gpu-section__inner">
          <div className="gpu-section__header" style={{ maxWidth: '1000px' }}>
            <span className="gpu-section__eyebrow">基础设施</span>
            <h2 className="gpu-section__title">算力背后的 AI 数据中心</h2>
            <p className="gpu-section__desc">
              算力租赁平台致力于交付行业领先的 GPU 性能。我们的集群部署于全球 40 多个顶级数据中心，
              配备吉瓦级电力支持与极低延迟的骨干网络。
              从模型预训练到生产级推理，我们助力领先的 AI 实验室与企业更快实现规模化。
            </p>
          </div>
          
          <div className="gpu-hero__actions" style={{ justifyContent: 'flex-start' }}>
            <Link href="/contact-sales" className="ent-btn ent-btn--primary">
              立即开始构建
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
