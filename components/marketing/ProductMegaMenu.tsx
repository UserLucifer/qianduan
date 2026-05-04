'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiArrowRight, FiCpu, FiDatabase, FiCloud, FiZap, FiTarget, FiActivity } from 'react-icons/fi';
import './ProductMegaMenu.css';

const productCategories = [
  {
    id: 'foundation',
    name: '基础架构',
    icon: <FiCpu />,
    subItems: [
      { name: 'GPU 计算', href: '/gpu-computing', items: ['NVIDIA Blackwell', 'NVIDIA Hopper', 'NVIDIA Ada Lovelace'] },
      { name: 'CPU 计算', href: '#' },
      { name: '裸金属服务器', href: '#' },
      { name: '网络', href: '#' }
    ],
    featured: {
      title: '算力租赁荣获 SemiAnalysis 铂金级',
      description: '唯一两度获得铂金评级的 AI 云服务商——了解为何算力租赁是 AI 的核心云。',
      image: '/images/navagation/1.jpg'
    }
  },
  {
    id: 'data-storage',
    name: '数据与存储',
    icon: <FiDatabase />,
    subItems: [
      { name: 'AI 对象存储', href: '#' },
      { name: '专用 VAST 存储', href: '#' },
      { name: '分布式文件存储', href: '#' },
      { name: '本地存储', href: '#' }
    ],
    featured: {
      title: '零流出数据迁移 (0EM)',
      description: '免费、无锁定地将数据迁移到算力租赁，由专家引导传输至高性能 AI 对象存储。',
      image: '/images/navagation/2.jpg'
    }
  },
  {
    id: 'infrastructure-control',
    name: '基础架构控制',
    icon: <FiCloud />,
    subItems: [
      { name: '托管 Kubernetes', href: '#' }
    ],
    featured: {
      title: '定义 AI 核心云',
      description: '探索算力租赁的 AI 核心云如何重新定义基础架构。',
      image: '/images/navagation/3.jpg'
    }
  },
  {
    id: 'runtime-acceleration',
    name: '运行加速',
    icon: <FiZap />,
    subItems: [
      { name: 'SUNK', href: '#' },
      { name: 'SUNK Anywhere', href: '#' },
      { name: 'Serverless RL', href: '#' }
    ],
    featured: {
      title: 'MLPerf v5.0 测试结果',
      description: '算力租赁在 MLPerf 基准测试中持续刷新纪录，在 AI 训练与推理性能方面处于行业领先地位。',
      image: '/images/navagation/4.jpg'
    }
  },
  {
    id: 'model-agent-development',
    name: '模型与代理开发',
    icon: <FiTarget />,
    subItems: [
      { name: '训练', href: '#' },
      { name: '微调', href: '#' },
      { name: '推理', href: '#' },
      { name: '监控', href: '#' }
    ],
    featured: {
      title: '算力租赁 ARENA',
      description: '在专用基础架构上运行真实的 AI 工作负载，在投入生产前验证性能、规模和成本。',
      image: '/images/navagation/5.avif'
    }
  },
  {
    id: 'mission-control',
    name: '任务控制',
    icon: <FiActivity />,
    subItems: [
      { name: 'Mission Control', href: '#' },
      { name: 'Fleet lifecycle controller', href: '#' },
      { name: 'Node lifecycle controller', href: '#' },
      { name: 'Observability', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Tensorizer', href: '#' }
    ],
    featured: {
      title: 'Mission Control: 大型 AI 运行标准',
      description: 'Mission Control 将可观测性、安全审计可见性和自动化操作结合在一起，保持 AI 基础架构的可靠与透明。',
      image: '/images/navagation/6.jpg'
    }
  }
];

export default function ProductMegaMenu() {
  const [activeCategory, setActiveCategory] = useState(productCategories[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
      className="mega-menu"
    >
      <div className="mega-menu__inner">
        {/* Left: Navigation */}
        <aside className="mega-menu__nav">
          <div className="mega-menu__nav-header">
            <span className="mega-menu__nav-label">PRODUCTS //</span>
          </div>
          <div className="mega-menu__categories">
            {productCategories.map((category) => (
              <button
                key={category.id}
                className={`mega-menu__category-btn ${activeCategory.id === category.id ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveCategory(category)}
              >
                <span className="mega-menu__category-icon">{category.icon}</span>
                <span className="mega-menu__category-name">{category.name}</span>
                <FiChevronRight className="mega-menu__chevron" />
                {activeCategory.id === category.id && (
                  <motion.div
                    layoutId="active-bg"
                    className="mega-menu__category-bg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Center: Detailed View */}
        <main className="mega-menu__main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mega-menu__content-wrapper"
            >
              <div className="mega-menu__grid">
                {activeCategory.subItems.length > 0 ? (
                  activeCategory.subItems.map((sub, idx) => (
                    <div key={idx} className="mega-menu__group">
                      <Link href={sub.href || '#'} className="mega-menu__sub-title">
                        {sub.name}
                        <FiArrowRight className="mega-menu__arrow" />
                      </Link>
                      {sub.items && (
                        <div className="mega-menu__items">
                          {sub.items.map((item, i) => (
                            <Link key={i} href="#" className="mega-menu__item">
                              {item}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="mega-menu__empty">
                    <p>探索我们的核心控制面板，实时管理您的全球算力资源。</p>
                    <Link href="#" className="mega-menu__empty-link">进入控制台 →</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right: Intelligence / Featured */}
        <aside className="mega-menu__featured-panel">
          <AnimatePresence mode="wait">
            {activeCategory.featured ? (
              <motion.div
                key={`${activeCategory.id}-featured`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="mega-menu__featured-card"
              >
                <div className="mega-menu__featured-image-wrapper">
                  <img
                    src={activeCategory.featured.image}
                    alt={activeCategory.featured.title}
                    className="mega-menu__featured-image"
                  />
                  <div className="mega-menu__featured-overlay"></div>
                </div>
                <div className="mega-menu__featured-body">
                  <h4 className="mega-menu__featured-title">{activeCategory.featured.title}</h4>
                  <p className="mega-menu__featured-desc">{activeCategory.featured.description}</p>
                </div>
              </motion.div>
            ) : (
              <div className="mega-menu__featured-placeholder">
                <div className="mega-menu__placeholder-icon"><FiActivity /></div>
                <p>Mission Control Ready</p>
              </div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </motion.div>
  );
}
