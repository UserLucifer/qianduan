import React from 'react';
import './HubSection.css';

const hubCards = [
  {
    title: '利用机器学习进行创作',
    description: '包含丰富的机器学习功能，例如模型评估、数据集查看器等等。',
    image: '/images/home/hub-ml.png',
    alt: '利用机器学习进行创作'
  },
  {
    title: '合作',
    description: '基于 Git，并以协作为核心设计理念。',
    image: '/images/home/hub-collaborate.png',
    alt: '合作'
  },
  {
    title: '边玩边学',
    description: '通过实验与我们优秀的社区分享来学习。',
    image: '/images/home/hub-play.png',
    alt: '边玩边学'
  },
  {
    title: '构建您的机器学习作品集',
    description: '与世界分享你的作品，打造你的机器学习个人档案。',
    image: '/images/home/hub-portfolio.png',
    alt: '构建您的机器学习作品集'
  }
];

export default function HubSection() {
  return (
    <section className="hub-section">
      <div className="hub-container">
        <div className="hub-header">
          <div className="hub-title-wrapper">
            <h2 className="hub-title">拥抱脸中心</h2>
            <span className="hub-badge">自由的</span>
          </div>
          <p className="hub-subtitle">
            HF Hub 是探索、实验、协作和构建机器学习技术的中心平台。加入开源机器学习运动吧！
          </p>
        </div>

        <div className="hub-grid">
          {hubCards.map((card, index) => (
            <div key={index} className="hub-card">
              <div className="hub-card__content">
                <h3 className="hub-card__title">{card.title}</h3>
                <p className="hub-card__description">{card.description}</p>
              </div>
              <div className="hub-card__image-container">
                <img 
                  src={card.image} 
                  alt={card.alt} 
                  className="hub-card__image"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
