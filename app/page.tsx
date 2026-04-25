import Header from './components/Header';
import ProductList from "./components/product-list";
import Aurora from "./components/Aurora";
import LogoCarousel from "./components/LogoCarousel";
import FeatureGrid from './components/FeatureGrid';
import UseCaseSection from './components/UseCaseSection';
import WorkloadSection from './components/WorkloadSection';
import TestimonialSection from './components/TestimonialSection';
import FAQSection from './components/FAQSection';
import HubSection from './components/HubSection';
import EnterpriseSection from './components/EnterpriseSection';
import AccordionSection from './components/AccordionSection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />

      <main className="shell">
        <section className="hero">
          <div className="hero__background">
            <Aurora
              colorStops={["#7cff67","#B497CF","#5227FF"]}
              blend={0.5}
              amplitude={1.0}
              speed={1}
            />
          </div>
          <div className="hero__content">
            <div className="hero__eyebrow">
              <span className="badge">Compute Rental</span>
              <span className="hero__label">GPU / Training / Inference</span>
            </div>
            <h1>按需租用稳定算力，把资源交付做得像基础设施一样直接。</h1>
            <p className="hero__description">
              在这里浏览我们的算力产品目录。探索不同规格的 GPU 实例，支持您的 AI 训练与推理需求。
            </p>
          </div>
        </section>

        <LogoCarousel />

        <section className="panel">
          <div className="panel__header">
            <h2>实例型号与规格</h2>
            <p>探索各种显存容量的高性能计算节点。</p>
          </div>
          <ProductList />
        </section>

        <FeatureGrid />
        <UseCaseSection />
        <AccordionSection />
        <WorkloadSection />
        <TestimonialSection />
        <EnterpriseSection />
        <FAQSection />
        <HubSection />
      </main>

      <Footer />
    </>
  );
}
