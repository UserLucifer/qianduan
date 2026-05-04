'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';
import './ProductMegaMenu.css'; // Reusing the same base styles

const useCaseItems = [
  { name: 'AI 文本生成', href: '/use-cases/ai-text-generation' },
  { name: 'AI 图像+视频生成', href: '/use-cases/ai-image-video-generation' },
  { name: '人工智能代理', href: '/use-cases/ai-agents' },
  { name: 'AI 微调', href: '/use-cases/ai-fine-tuning' },
  { name: '批量数据处理', href: '/use-cases/batch-data-processing' },
  { name: '音频转文本转录', href: '/use-cases/audio-to-text-transcription' },
  { name: '虚拟计算', href: '/use-cases/virtual-computing' },
  { name: 'GPU 编程', href: '/use-cases/gpu-programming' },
  { name: '图形渲染', href: '/use-cases/3d-rendering' }
];

export default function UseCaseMegaMenu() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="mega-menu"
    >
      <div className="mega-menu__inner" style={{ gridTemplateColumns: '1fr', minWidth: '320px', width: 'fit-content', minHeight: 'auto' }}>
        <main className="mega-menu__main" style={{ padding: '24px' }}>
          <div className="mega-menu__grid" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {useCaseItems.map((item, idx) => (
              <Link 
                key={idx} 
                href={item.href} 
                className="mega-menu__category-btn"
                style={{ padding: '10px 16px', borderRadius: '8px' }}
              >
                <span className="mega-menu__category-name">{item.name}</span>
                <FiChevronRight className="mega-menu__chevron" />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </motion.div>
  );
}
