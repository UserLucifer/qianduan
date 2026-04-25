import React from 'react';
import './EnterpriseSection.css';

const enterpriseFeatures = [
  {
    image: '/images/home/1.webp',
    title: '99.9% 正常运行时间',
    description: '凭借业界领先的可靠性，您可以自信地运行关键工作负载。'
  },
  {
    image: '/images/home/2.webp',
    title: '默认安全',
    description: '经独立审计，符合 SOC 2 II 型合规性要求，实现端到端数据保护。'
  },
  {
    image: '/images/home/3.webp',
    title: '可扩展至数千个 GPU',
    description: '利用可随您发展而扩展的基础设施，即时适应需求。'
  }
];

export default function EnterpriseSection() {
  return (
    <section className="enterprise-section">
      <div className="enterprise-container">
        <span className="enterprise-badge">企业级</span>
        <h2 className="enterprise-title">从一开始就达到企业级水平</h2>
        <p className="enterprise-description">
          专为规模化而打造，安全可靠，旨在满足您最苛刻的需求。
        </p>

        <div className="enterprise-grid">
          {enterpriseFeatures.map((feature, index) => (
            <div key={index} className="enterprise-card">
              <div className="enterprise-card__image-box">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="enterprise-card__image"
                  loading="lazy"
                />
              </div>
              <h3 className="enterprise-card__title">{feature.title}</h3>
              <p className="enterprise-card__desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
