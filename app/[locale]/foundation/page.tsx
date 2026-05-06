"use client";

import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import './foundation.css';

const inspireCards = [
  {
    image: '/images/foundation/1.jpeg',
    title: '捐赠',
    desc: '我们增加了个人捐赠的可抵配额。目前员工有每年最多 10,000 美元。',
  },
  {
    image: '/images/foundation/2.jpeg',
    title: '提升志愿服务技能',
    desc: '我们鼓励员工通过工作并利用专业技能互相帮助的方式来参与。为创意贡献持续时间和创新服务。',
  },
  {
    image: '/images/foundation/3.jpeg',
    title: '新员工资助',
    desc: '我们以这种方式欢迎新员工加入。内容了解些问有关后制机构/资助一所方。我们自11/1起向之后加入的员工报新人引缴补贴。',
  },
  {
    image: '/images/foundation/4.jpeg',
    title: '倡导者领导的活动',
    desc: '这些活动表示着地板及最出名的 Inspire Champions 志愿、初体健康活动和整大型 NVIDIA 员工的团队慈善竞技出色公共工作的。',
  },
  {
    image: '/images/foundation/5.jpeg',
    title: '任务',
    desc: '我们在全球多个区域拥有提供志愿和不同层面的相应机构。我们帮助全球范围让优秀机构在本地找到社区和机会。任务成功可工作积累高影响。',
  },
  {
    image: '/images/foundation/6.jpeg',
    title: '慈善团队建设活动',
    desc: '我们已定期推动 NVIDIA 社区及周围活动。为参与 300 人的团队快速提供慈善团体行动才能够打开。',
  },
  {
    image: '/images/foundation/7.jpeg',
    title: '辅导和指导',
    desc: '帮助鼓励 NVIDIA 员工利用自己的技能和专业知识。帮助员到了形式上。数字专利可爱行计的制度范围。由学生跟新提供管理和已设置到的支持和服务了解人才信息。',
  },
  {
    image: '/images/foundation/8.jpeg',
    title: '灾害和危机应对',
    desc: '员工们通过帮助。让帮助更多等于可持续发展的人们。为政策获得地区支系。',
  },
];

export default function FoundationPage() {
  return (
    <>
      <Header />

      {/* Module 1: Hero – split layout */}
      <section className="foundation-hero">
        <div className="foundation-hero__inner">
          <div className="foundation-hero__left">
            <h1 className="foundation-hero__title">关于我们的基金会</h1>
          </div>
          <div className="foundation-hero__right" />
        </div>
      </section>

      {/* Module 2: Intro – centered title + description */}
      <section className="foundation-intro">
        <div className="shell">
          <h2 className="foundation-intro__title">
            支持 NVIDIA 员工回馈社区
          </h2>
          <p className="foundation-intro__text">
            社区是我们生活和工作的家园。我们的员工都热衷于为社区提供有意义的支持。NVIDIA
            基金会通过我们的 Inspire 365 计划，帮助将这种激情转化为实际行动。我们的目标是让所有
            NVIDIA 员工都能参与到社区事务中。Inspire 365 可助力轻松实现这一目标。
          </p>
        </div>
      </section>

      {/* Module 3: Quote – light gray background */}
      <section className="foundation-quote">
        <div className="shell">
          <div className="foundation-quote__inner">
            <p className="foundation-quote__text">
              <span className="foundation-quote__mark foundation-quote__mark--open">&ldquo;</span>
              Inspire 365 是让 NVIDIA 成为卓越工作场所的原因之一。
              <span className="foundation-quote__mark foundation-quote__mark--close">&rdquo;</span>
            </p>
            <span className="foundation-quote__attribution">
              — 办公室经理 Nina L
            </span>
          </div>
        </div>
      </section>

      {/* Module 5: Inspire 365 card grid */}
      <section className="foundation-inspire">
        <div className="shell">
          <div className="foundation-inspire__header">
            <h2 className="foundation-inspire__title">Inspire 365</h2>
            <p className="foundation-inspire__subtitle">
              我们提供灵活的资源，不论企业行程如何。还是开展志愿活动或计划社区和工具。员工可以自由的拥有独特的最优化最好的组织和联系。我们参与多元力量，可以自行选择要服务的帮助每他和新人。创造也界各地的社区文明和联系。
            </p>
          </div>
          <div className="foundation-inspire__grid">
            {inspireCards.map((card, i) => (
              <div key={i} className="inspire-card">
                <div className="inspire-card__image-wrapper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.image}
                    alt={card.title}
                    className="inspire-card__image"
                  />
                </div>
                <h3 className="inspire-card__title">{card.title}</h3>
                <p className="inspire-card__desc">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
