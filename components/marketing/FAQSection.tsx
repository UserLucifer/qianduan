"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import './FAQSection.css';

const faqs = [
  {
    question: "可以租赁哪些类型的 GPU？",
    answer: "我们提供多种高性能 GPU 资源，包括 NVIDIA H100、A100 和 RTX 4090 等，可满足 AI 训练、推理和不同规模的算力任务。"
  },
  {
    question: "计费方式是怎样的？",
    answer: "平台采用透明的按量计费模式，通常按实际使用时长计费，不设置隐藏费用。长期租赁或稳定使用场景也可以享受更合适的价格方案。"
  },
  {
    question: "是否有最短租赁时长？",
    answer: "没有严格的最短租赁限制。你可以按需启动实例，既适合短时间实验验证，也适合持续运行的生产任务。"
  },
  {
    question: "平台提供哪些技术支持？",
    answer: "我们为算力基础设施提供技术支持，协助你处理部署、连接、运行和资源使用中的问题，并帮助优化实际使用体验。"
  },
  {
    question: "算力资源可以动态扩展吗？",
    answer: "可以。你可以根据任务负载变化，通过控制台选择和调整 GPU 节点，让资源规模更贴合训练、推理或批处理任务的实际需求。"
  }
];

export default function FAQSection() {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2>常见问题</h2>
          <p>了解算力租赁、产品资源和计费方式的关键信息。</p>
        </div>
        
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="faq-accordion"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className="faq-accordion__item"
            >
              <AccordionTrigger className="faq-accordion__trigger">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="faq-accordion__content">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
