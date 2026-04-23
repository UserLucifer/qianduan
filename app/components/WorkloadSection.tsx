import React from 'react';
import './WorkloadSection.css';

const workloads = [
  {
    title: '更快推向市场',
    number: '10X',
    subtext: '更快的推理启动时间',
    hoverBullets: [
      '通过全栈AI原生云平台，以行业领先的速度和规模，提前获得NVIDIA显卡，加快AI开发周期，更快将解决方案推向市场。',
      '我们的 Kubernetes 原生开发体验拥有最前沿的裸机基础设施、自动化配置以及对领先工作负载编排框架的支持。'
    ]
  },
  {
    title: '获得行业领先的性能\n和效率',
    number: '96%',
    subtext: '集群吞吐量',
    hoverBullets: [
      '减少中断，提高集群利用率，并近实时解决问题，使工作和工作负载重回正轨，保持团队高效并专注于创新。',
      '凭借强韧基础设施、严格的节点生命周期管理、深度可观察性，以及全天候24小时由专业工程团队支持，实现高达96%的货物投放率。'
    ]
  },
  {
    title: '提供实时的可靠性和\n韧性',
    number: '50%',
    subtext: '每天的中断减少',
    hoverBullets: [
      '通过高性能集群加快训练和推理，这些集群在第一天就准备好投入生产工作负载——设计上追求最大可靠性和最佳TCO。',
      '获得尖端的计算、存储和网络云服务，严格的健康检查，以及自动化生命周期管理，使你的AI工作负载能够在数小时内运行，而非数周。'
    ]
  }
];

export default function WorkloadSection() {
  return (
    <section className="workload-section">
      <div className="workload-container">
        <div className="workload-header">
          <h2 className="workload-title">专为AI工作负载设计</h2>
          <p className="workload-subtitle">我们通过提供高价值的性能、规模和专业知识，弥合人工智能当前及未来所需的基础设施，弥合人工智能雄心与执行之间的鸿沟。</p>
        </div>

        <div className="workload-grid">
          {workloads.map((item, index) => (
            <div key={index} className="workload-card">
              <div className="workload-card-front">
                <div className="workload-front-top">
                  <h3>{item.title}</h3>
                </div>
                <div className="workload-divider"></div>
                <div className="workload-front-bottom">
                  <div className="workload-number">{item.number}</div>
                  <div className="workload-subtext">{item.subtext}</div>
                </div>
              </div>

              <div className="workload-card-hover">
                <ul>
                  {item.hoverBullets.map((bullet, bIndex) => (
                    <li key={bIndex}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
