"use client";

import Header from '../components/Header';
import './diversity.css';

export default function DiversityPage() {
  return (
    <>
      <Header />
      
      {/* Module 1: Hero Banner */}
      <section className="diversity-hero">
        <div className="diversity-hero__bg" />
        <div className="diversity-hero__overlay" />
        <div className="diversity-hero__content">
          <h1 className="diversity-hero__title">
            多元化、包容性和归属感：充分发挥我们的潜力
          </h1>
        </div>
      </section>

      {/* Module 2: Intro */}
      <section className="diversity-intro">
        <div className="shell">
          <h2 className="diversity-intro__title">人人享有无限机会</h2>
          <p className="diversity-intro__text">
            应对世界上的重大挑战需要基于独特视角、背景和文化的新想法。正是这种多元化推动了我们的创新和创造力，并为每个致力于将其变为现实的人提供了无穷无尽的机会。每个人都有自己的声音。每个人都属于自己。
          </p>
        </div>
      </section>

      {/* Module 3: Pillars */}
      <section className="diversity-pillars">
        <div className="shell">
          <h2 className="diversity-pillars__title">携手创造未来</h2>
          <div className="diversity-pillars__grid">
            {/* Pillar 1 */}
            <div className="pillar-card">
              <div className="pillar-card__image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/Inclusivity/2.jpg" 
                  alt="与优秀人才交流" 
                  className="pillar-card__image"
                />
              </div>
              <h3 className="pillar-card__subtitle">与优秀人才交流</h3>
              <p className="pillar-card__description">
                我们希望吸引反映不同观点的全球优秀人才，帮助我们实现改变生活的突破。我们调整了流程，让应聘者在面试过程中与来自其代表社区的员工会面，撰写更具包容性的职位描述，并在全球范围内提高我们的社会包容性。
              </p>
              <div className="pillar-card__quote-box">
                <p className="pillar-card__quote">
                  “我从一开始就受到热烈欢迎，并获得了取得成功的支持和鼓励。无论您来自何处，......您都是团队的一员。”
                </p>
                <span className="pillar-card__attribution">— Manuel, 招聘</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="pillar-card">
              <div className="pillar-card__image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/Inclusivity/3.jpg" 
                  alt="在工作中探索 Allyship" 
                  className="pillar-card__image"
                />
              </div>
              <h3 className="pillar-card__subtitle">在工作中探索 Allyship</h3>
              <p className="pillar-card__description">
                我们努力创造一个让弱势群体感到有能力的环境。通过我们的 CARE Allyship 计划，我们训练员工释放多元化和包容性的力量，并采取行动帮助他人取得成功。
              </p>
              <div className="pillar-card__quote-box">
                <p className="pillar-card__quote">
                  “Allyship 计划教会了我如何更加关注弱势群体的需求，以及如何为人们创造被看到和听到的空间。”
                </p>
                <span className="pillar-card__attribution">— Thiru, 软件</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="pillar-card">
              <div className="pillar-card__image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/Inclusivity/4.jpg" 
                  alt="处理日常工作" 
                  className="pillar-card__image"
                />
              </div>
              <h3 className="pillar-card__subtitle">处理日常工作</h3>
              <p className="pillar-card__description">
                NVIDIA 一直毫不犹豫地迎接新的挑战，我们鼓励和支持拥有相同价值观的员工。NVIDIA 有无穷无尽的机会，您有机会探索所有这些机会。我们提供量身定制的指导计划、职位跟踪体验和领导力发展机会。
              </p>
              <div className="pillar-card__quote-box">
                <p className="pillar-card__quote">
                  “NVIDIA 为我创造了良好的条件，让我能够茁壮成长，并通过包容性和归属感提升员工体验。”
                </p>
                <span className="pillar-card__attribution">— 来自 Diversity, Inclusion, and Belonging 的 Marc</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 4: Featured Quote */}
      <section className="diversity-featured">
        <div className="diversity-featured__content">
          <div className="featured-quote">
            <p className="featured-quote__text">
              在我的职业生涯中，我第一次可以成为自己，我不必为了取得成功而装模作样。作为一个骄傲的黑人难民，这是我职业生涯中最快乐的一次。让我的整个自我投入工作一直是一个梦想。
            </p>
            <span className="featured-quote__attribution">— Veronica, 产品安全</span>
          </div>
        </div>
      </section>
    </>
  );
}
