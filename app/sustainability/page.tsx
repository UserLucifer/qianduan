"use client";

import Header from '../components/Header';
import Footer from '../components/Footer';
import './sustainability.css';

export default function SustainabilityPage() {
  return (
    <>
      <Header />
      
      {/* Module 1: Hero Banner */}
      <section className="sustainability-hero">
        <div className="sustainability-hero__bg" />
        <div className="sustainability-hero__overlay" />
        <div className="sustainability-hero__content">
          <h1 className="sustainability-hero__title">企业可持续发展</h1>
          <p className="sustainability-hero__text">
            我们在 AI 和加速计算方面的创新正在为环境责任设定新标准，同时助力打造更环保、更可持续的未来。
          </p>
        </div>
      </section>

      {/* Module 2: Stats */}
      <section className="sustainability-stats">
        <div className="shell">
          <h2 className="sustainability-stats__title">能源、效率和气候</h2>
          <div className="sustainability-stats__grid">
            <div className="stat-item">
              <div className="stat-item__value">#1</div>
              <div className="stat-item__subtitle">最高效的超级计算机</div>
              <div className="stat-item__description">
                NVIDIA 为 2024 年 11 月 Green500 榜单上的顶级超级计算机提供支持。
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-item__value">50x+</div>
              <div className="stat-item__subtitle">更高的能效</div>
              <div className="stat-item__description">
                对于 LLM AI 推理工作负载，NVIDIA Blackwell GPU 的能效通常比传统 CPU 高 50 倍以上。
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-item__value">30%</div>
              <div className="stat-item__subtitle">更低的功耗</div>
              <div className="stat-item__description">
                NVIDIA DPU 可以通过从效率较低的 CPU 中卸载基本的数据中心网络和基础设施功能来降低功耗。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 3: Renewable Energy Target */}
      <section className="sustainability-target">
        <div className="shell">
          <div className="sustainability-target__layout">
            <div className="sustainability-target__content">
              <h2 className="sustainability-target__title">实现 100% 可再生电力</h2>
              <p className="sustainability-target__text">
                2025 财年，我们已实现并将持续保持由我们运营控制的办公场所和数据中心 100% 使用可再生电力。通过履行这一承诺，我们正在努力按照流行的气候科学标准管理范围 1 和 2 排放，将温室气体足迹中的范围 2 基于市场的基础排放减少至零。
              </p>
            </div>
            <div className="sustainability-target__image-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/renewable-energy-progress.svg" 
                alt="Progress on Our Renewable Electricity Target" 
                className="sustainability-target__image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Module 4: Social Impact */}
      <section className="sustainability-social">
        <div className="shell">
          <h2 className="sustainability-social__title">社会影响</h2>
          <div className="sustainability-social__grid">
            <div className="social-card">
              <h3 className="social-card__title">向所有人开放机会</h3>
              <a href="/diversity-and-inclusion" className="social-card__link">在 NVIDIA 探索包容性 &gt;</a>
            </div>
            <div className="social-card">
              <h3 className="social-card__title">回馈社区</h3>
              <a href="/foundation" className="social-card__link">了解我们的基金会 &gt;</a>
            </div>
          </div>
        </div>
      </section>

      {/* Module 5: Careers */}
      <section className="sustainability-careers">
        <div className="shell">
          <div className="sustainability-careers__layout">
            <div className="sustainability-careers__content">
              <h2 className="sustainability-careers__title">员工们在这里实现他们的毕生事业</h2>
              <p className="sustainability-careers__text">
                我们在 Glassdoor 的“2025 年最佳工作场所”榜单中排名第 4 位。我们的员工愿意长期留在这里工作；大约五分之一的员工已在 NVIDIA 工作了十年或更长时间。
              </p>
            </div>
            <div className="sustainability-careers__image-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/images/glassdoors-best-places-to-work-2025-logo-regular.svg" 
                alt="Glassdoor Best Places to Work 2025" 
                className="sustainability-careers__image"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
