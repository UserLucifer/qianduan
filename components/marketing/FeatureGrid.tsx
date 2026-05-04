import React from 'react';
import { FiTrendingUp, FiCpu, FiActivity, FiPieChart, FiServer, FiZap } from 'react-icons/fi';
import './FeatureGrid.css';

const features = [
  {
    icon: <FiTrendingUp />,
    title: '收益导向选机',
    description: '根据机器在真实 AI 场景下的表现，帮助你判断租哪台更合适。',
  },
  {
    icon: <FiCpu />,
    title: '热门 AI 任务匹配',
    description: '面向文本、图像、视频、语音等热门需求分配服务器资源。',
  },
  {
    icon: <FiActivity />,
    title: 'Token 表现可追踪',
    description: '实时查看机器的 Token 处理能力与任务表现，选择更有依据。',
  },
  {
    icon: <FiPieChart />,
    title: '成本收益更清楚',
    description: '从租赁费用到运行产出，关键数据持续可见。',
  },
  {
    icon: <FiServer />,
    title: '平台负责运行调度',
    description: '减少机器空闲与切换损耗，让服务器更专注于实际任务。',
  },
  {
    icon: <FiZap />,
    title: '上手更简单',
    description: '你关注机型和收益，平台处理接入与运行流程。',
  }
];

export default function FeatureGrid() {
  return (
    <section className="feature-section">
      <div className="feature-container">
        <div className="feature-header">
          <h2 className="feature-title">探索我们的GPU云服务</h2>
          <p className="feature-subtitle">从服务器选择到 Token 产出，再到收益表现，把关键结果直接展示给你。</p>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
