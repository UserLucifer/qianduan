import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div className="site-footer__brand-col">
            <Link href="/" className="site-footer__brand">
              算力租赁
            </Link>
            <p className="site-footer__tagline">
              基于 Token 经济的高性能 AI 算力调度平台，为全球开发者提供即时可用的计算资源。
            </p>
          </div>

          <div className="site-footer__links-grid">
            <div className="site-footer__col">
              <h3 className="site-footer__title">公司信息</h3>
              <div className="site-footer__links">
                <Link href="/about" className="site-footer__link">关于我们</Link>
                <Link href="/sustainability" className="site-footer__link">企业可持续发展</Link>
                <Link href="/enterprise" className="site-footer__link">解决方案</Link>
                <Link href="/financing" className="site-footer__link">融资</Link>
                <Link href="/hardware" className="site-footer__link">硬件</Link>
              </div>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__title">资源</h3>
              <div className="site-footer__links">
                <Link href="/use-cases" className="site-footer__link">产品用例</Link>
              </div>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__title">条款</h3>
              <div className="site-footer__links">
                <Link href="/terms" className="site-footer__link">服务条款</Link>
                <Link href="/privacy" className="site-footer__link">隐私政策</Link>
                <Link href="/compliance" className="site-footer__link">合规</Link>
                <Link href="/vulnerability-disclosure" className="site-footer__link">漏洞披露</Link>
                <Link href="/data-processing" className="site-footer__link">数据处理</Link>
              </div>
            </div>

            <div className="site-footer__col">
              <h3 className="site-footer__title">帮助</h3>
              <div className="site-footer__links">
                <Link href="/docs" className="site-footer__link">文档中心</Link>
                <Link href="/blog" className="site-footer__link">博客</Link>
                <Link href="/contact" className="site-footer__link">联系我们</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <div className="site-footer__copyright">
            © {currentYear} 算力租赁. All rights reserved.
          </div>
          <div className="site-footer__status">
            <span className="status-dot"></span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
