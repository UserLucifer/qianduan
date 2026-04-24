"use client";

import Header from '../components/Header';
import Footer from '../components/Footer';
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

      {/* Module 5: Support */}
      <section className="diversity-support">
        <div className="shell">
          <h2 className="diversity-support__title">为重要事项提供支持</h2>
          <div className="diversity-support__grid">
            <div className="diversity-support__left">
              <div className="support-item">
                <h3 className="support-item__title">关注员工需求</h3>
                <p className="support-item__text">
                  在 NVIDIA，我们的员工最重要。我们适应员工的不同需求，在个人和职业发展的每个阶段为他们提供支持。
                </p>
              </div>
              <div className="support-item">
                <h3 className="support-item__title">致力于实现卓越</h3>
                <p className="support-item__text">
                  我们相信，如果我们照顾好员工及其家人，他们每天都会在工作中展现自己的最佳状态。
                </p>
              </div>
            </div>
            <div className="diversity-support__right">
              <div className="support-quote">
                <p className="support-quote__text">
                  我刚到达 NVIDIA 的时候，我被激活以进行部署 ... 【NVIDIA】提供的支持让我和我的家人改变了游戏规则 ... ... 我永远不会忘记这一点。
                </p>
                <span className="support-quote__attribution">— Sam, 数据中心</span>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 6: Opportunities */}
      <section className="diversity-opportunities">
        <div className="shell">
          <h2 className="diversity-opportunities__title">参与的无限机会</h2>
          <div className="diversity-opportunities__grid">
            {/* Column 1 */}
            <div className="opp-card">
              <div className="opp-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="opp-card__title">与他人交流</h3>
              <p className="opp-card__text">
                我们的社区资源小组 (CRG) 在 NVIDIA 体验中发挥着重要作用，从领导庆祝活动到宣传，并且是构建包容性文化不可或缺的一部分。NVIDIA 为 9 个 CRG 以及神经多样性、护理人员和在职父母支持小组提供支持。
              </p>
              <ul className="opp-card__list">
                <li className="opp-card__list-item">阿拉伯和盟友网络</li>
                <li className="opp-card__list-item">NV Pride</li>
                <li className="opp-card__list-item">亚洲太平洋岛屿人和盟友</li>
                <li className="opp-card__list-item">NVIDIA 残障人士网络</li>
                <li className="opp-card__list-item">黑色 NVIDIA 网络</li>
                <li className="opp-card__list-item">南亚人和盟友</li>
                <li className="opp-card__list-item">早期职业网络</li>
                <li className="opp-card__list-item">退伍军人NVIDIA</li>
                <li className="opp-card__list-item">西班牙裔拉丁裔网络</li>
                <li className="opp-card__list-item">科技界女性</li>
              </ul>
              <div className="opp-card__quote">
                <p className="opp-card__quote-text">
                  “作为 ADHD NVIDIA 员工的联合负责人，我亲身体验到神经离者如何被人看见和被人所包含。神经离使我能够看到不同的部分如何相互联系，从而提供世界级的体验。”
                </p>
                <span className="opp-card__attribution">— IT 部门 Nate</span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="opp-card">
              <div className="opp-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="opp-card__title">打造更包容的职场</h3>
              <p className="opp-card__text">
                我们与超过 25 个大学校园的多元化学生组织合作，包括少数群体服务机构、传统黑人学院和大学 (HBCU) 以及西班牙裔服务机构 (HSIs)。我们还与 Anita Borg、Latinas in Tech、Women in Machine Learning、National Society Black Engineers 和 Society of Hispanic Professional Engineers 等机构和组织开展合作。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module 7: Commitment */}
      <section className="diversity-commitment">
        <div className="shell">
          <h2 className="diversity-commitment__title">我们对进步的承诺</h2>
          <p className="diversity-commitment__text">
            我们专注于聘用具有代表性的员工队伍。在过去几年中，我们实现了薪酬平等，并将在此基础上持续优化这样的实践。除了薪酬平等，还包括持续承诺，确保我们在聘用、发展、晋升和奖励员工方面是公平的。
          </p>
        </div>
      </section>


      <Footer />
    </>
  );
}
