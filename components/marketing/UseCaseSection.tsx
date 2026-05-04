import React from 'react';
import Link from 'next/link';
import { FiType, FiImage, FiUsers, FiArrowRight } from 'react-icons/fi';
import './UseCaseSection.css';

const previewUseCases = [
  {
    icon: <FiType />,
    title: 'AI 文本生成',
    desc: '部署大型语言模型进行文本生成、对话 AI 和代码辅助。',
    href: '/use-cases/ai-text-generation'
  },
  {
    icon: <FiImage />,
    title: 'AI 图像与视频生成',
    desc: '运行 Stable Diffusion 或视频生成模型，释放创意工作流。',
    href: '/use-cases/ai-image-video-generation'
  },
  {
    icon: <FiUsers />,
    title: 'AI 智能体',
    desc: '构建自主 AI 智能体，用于任务自动化和工作流编排。',
    href: '/use-cases/ai-agents'
  }
];

export default function UseCaseSection() {
  return (
    <section className="uc-section">
      <div className="uc-container">
        <div className="uc-header">
          <div className="uc-header__copy">
            <h2 className="uc-title">广泛的 AI 工作负载支持</h2>
            <p className="uc-subtitle">无论您运行的是训练、推理还是渲染，我们都能提供匹配的算力支持。</p>
          </div>
          <Link href="/use-cases" className="uc-all-link">
            查看全部用例 <FiArrowRight />
          </Link>
        </div>

        <div className="uc-grid">
          {previewUseCases.map((uc, index) => (
            <Link key={index} href={uc.href} className="uc-preview-card">
              <div className="uc-preview-card__icon">{uc.icon}</div>
              <h3 className="uc-preview-card__title">{uc.title}</h3>
              <p className="uc-preview-card__desc">{uc.desc}</p>
              <div className="uc-preview-card__footer">
                <span className="uc-preview-card__link">了解更多</span>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
