import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import {
  FiCpu,
  FiType,
  FiImage,
  FiUsers,
  FiDatabase,
  FiMic,
  FiSliders,
  FiMonitor,
  FiCode,
  FiFilm,
  FiZap,
  FiBox,
  FiDollarSign,
  FiLayers,
} from 'react-icons/fi';
import MagicRings from '../components/MagicRings';
import './use-cases.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '产品用例 — 算力租赁',
  description:
    '无论您运行的是 AI 训练、推理、渲染还是转录工作负载，我们都能帮助您快速、灵活且经济地启动。按秒计费，无限扩展。',
};

const useCases = [
  {
    slug: 'ai-text-generation',
    icon: FiType,
    title: 'AI 文本生成',
    desc: '部署大型语言模型进行文本生成、对话 AI、内容创作和代码辅助。利用高性能 GPU 实现低延迟推理。',
    video: '/videos/use/vid-useCase-textGeneration.mp4',
  },
  {
    slug: 'ai-image-video-generation',
    icon: FiImage,
    title: 'AI 图像与视频生成',
    desc: '运行 Stable Diffusion、Midjourney 替代方案或视频生成模型。从文本到像素，释放创意工作流的全部潜力。',
    video: '/videos/use/vid-useCase-imageVideoGeneration.mp4',
  },
  {
    slug: 'ai-agents',
    icon: FiUsers,
    title: 'AI 智能体',
    desc: '构建和运行自主 AI 智能体，用于任务自动化、决策支持和复杂工作流编排。',
    video: '/videos/use/vid-useCase-aiAgent.mp4',
  },
  {
    slug: 'batch-data-processing',
    icon: FiDatabase,
    title: '批量数据处理',
    desc: '大规模数据管道、ETL 任务和批量推理作业。利用 GPU 加速处理 TB 级数据集。',
    video: '/videos/use/vid-useCase-batchDataProcessing.mp4',
  },
  {
    slug: 'audio-to-text-transcription',
    icon: FiMic,
    title: '语音转文本',
    desc: '使用 Whisper 等模型进行高精度语音识别和转录。支持多语言、实时流和批量转录。',
    video: '/videos/use/vid-useCase-audio2text.mp4',
  },
  {
    slug: 'ai-fine-tuning',
    icon: FiSliders,
    title: 'AI 模型微调',
    desc: '在您的私有数据上微调基础模型。支持 LoRA、QLoRA 等高效微调方法，以最低成本获得定制模型。',
    video: '/videos/use/vid-useCase-fineTuning.mp4',
  },
  {
    slug: 'virtual-computing',
    icon: FiMonitor,
    title: '虚拟计算',
    desc: '按需启动高性能虚拟桌面和远程工作站。适用于 AI 研发、数据科学和专业工作流。',
    video: '/videos/use/vid-useCase-virtualComputing.mp4',
  },
  {
    slug: 'gpu-programming',
    icon: FiCode,
    title: 'GPU 编程',
    desc: '直接访问 CUDA、OpenCL 和 GPU 计算资源。为科学计算、数值模拟和自定义内核开发提供裸金属级性能。',
    video: '/videos/use/vid-useCase-gpuProgramming.mp4',
  },
  {
    slug: '3d-rendering',
    icon: FiFilm,
    title: '图形渲染',
    desc: '利用 GPU 加速 3D 渲染、动画制作和视觉特效。支持 Blender、Unreal Engine 等主流渲染引擎。',
    video: '/videos/use/vid-useCase-graphicsRendering.mp4',
  },
];

const highlights = [
  {
    icon: FiBox,
    title: '开箱即用的模板',
    desc: '跳过繁琐的环境配置，使用预构建模板在数分钟内启动完全配置的 GPU 实例。',
  },
  {
    icon: FiZap,
    title: '极致低成本 GPU',
    desc: '20,000+ 高性能 GPU 资源池 — 我们在 RTX 5090、4090、H100 和 H200 上的定价比主流云低 60-80%。',
  },
  {
    icon: FiLayers,
    title: '开源优先',
    desc: '使用 vLLM、TGI、ComfyUI 等开源框架 — 无专有许可费，无平台溢价，完全掌控您的技术栈。',
  },
  {
    icon: FiDollarSign,
    title: '灵活按需部署',
    desc: '自带模型，按您的方式扩展推理。按秒计费，随时缩减或扩容 — 零浪费支出。',
  },
];

export default function UseCasesPage() {
  return (
    <>
      <Header />

      {/* ── Hero ── */}
      <section className="uc-hero">
        <div className="uc-hero__inner">
          <span className="uc-hero__badge">Use Cases</span>
          <h1 className="uc-hero__title">
            无论何种 AI 工作负载，
            <br />
            <em>快速启动，灵活扩展</em>
          </h1>
          <p className="uc-hero__desc">
            从训练、微调、渲染到转录 — 我们帮助您以最低成本在高性能 GPU 上运行任意工作负载。按秒计费，无限扩展。
          </p>
          <div className="uc-hero__actions">
            <Link href="#" className="uc-btn uc-btn--primary">
              立即开始
            </Link>
            <Link href="/pricing" className="uc-btn uc-btn--ghost">
              查看定价
            </Link>
          </div>
        </div>
      </section>

      {/* ── Use Case Grid ── */}
      <section className="uc-grid-section">
        <div className="uc-grid-section__inner">
          <div className="uc-grid">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <Link key={uc.title} href={`/use-cases/${uc.slug}`} className="uc-card">
                  <div className="uc-card__video-wrap">
                    <video
                      src={uc.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="uc-card__video"
                    />
                    <div className="uc-card__video-overlay" />
                  </div>
                  <div className="uc-card__body">
                    <div className="uc-card__icon">
                      <Icon />
                    </div>
                    <h3 className="uc-card__title">{uc.title}</h3>
                    <p className="uc-card__desc">{uc.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Highlights ── */}
      <section className="uc-highlights">
        <div className="uc-highlights__inner">
          <div className="uc-highlights__header">
            <h2 className="uc-highlights__title">
              以开源模型为核心，完全掌控，零平台溢价
            </h2>
            <p className="uc-highlights__subtitle">
              直接访问高性能 GPU，以市场最低价格运行开源模型。预构建模板让部署变得轻而易举。
            </p>
          </div>

          <div className="uc-highlights__grid">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="uc-highlight">
                  <div className="uc-highlight__icon">
                    <Icon />
                  </div>
                  <h3 className="uc-highlight__title">{h.title}</h3>
                  <p className="uc-highlight__desc">{h.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="uc-cta">
        <div className="uc-cta__background">
          <MagicRings
            color="#A855F7"
            colorTwo="#6366F1"
            ringCount={12}
            speed={0.5}
            attenuation={3}
            lineThickness={2}
            baseRadius={0.6}
            radiusStep={0.4}
            scaleRate={0.2}
            opacity={0.35}
            noiseAmount={0.03}
            followMouse={true}
            mouseInfluence={0.1}
            hoverScale={1.1}
          />
        </div>
        <div className="uc-cta__inner">
          <h2 className="uc-cta__title">
            加入数千名开发者和企业的行列，
            <br />
            在我们的平台上运行 AI 工作负载
          </h2>
          <div className="uc-cta__actions">
            <Link href="#" className="uc-btn uc-btn--primary">
              立即开始
            </Link>
            <Link href="/contact-sales" className="uc-btn uc-btn--ghost">
              联系销售
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
