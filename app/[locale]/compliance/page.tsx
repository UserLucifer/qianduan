import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import '@/components/marketing/LegalPage.css';

export const metadata = {
  title: '合规 | 算力租赁',
  description: '算力租赁平台安全合规认证与数据保护标准。',
};

export default function CompliancePage() {
  return (
    <>
      <Header />
      <main className="legal-page">
        <div className="legal-page__inner">
          <header className="legal-page__header">
            <h1 className="legal-page__title">合规</h1>
            <p className="legal-page__date">安全控制与合规认证</p>
          </header>

          <div className="legal-page__body">
            <p>
              算力租赁严格执行安全管控措施并持有多项合规认证，以保护客户数据安全。作为服务于 AI 初创企业、科研院校和大型企业的 GPU 算力平台，我们始终以客户所要求的同等标准来要求自己。
            </p>
            <p>
              如需讨论您的合规需求，请<strong>联系我们的销售团队</strong>。
            </p>

            <h2>合规认证</h2>

            <h3>SOC 2 Type 3</h3>
            <p>
              我们的 SOC 2 Type 3 报告可应要求立即提供。如需获取，请联系销售团队。
            </p>

            <h3>SOC 2 Type 2</h3>
            <p>
              算力租赁已完成 SOC 2 Type 2 认证。此项审计由独立第三方机构执行，验证了我们的安全性、可用性和保密性控制在持续观察期内符合 AICPA 信任服务标准。该报告在签署保密协议后可供查阅——请联系销售团队申请获取。
            </p>

            <h3>HIPAA</h3>
            <p>
              算力租赁在安全云层级支持符合 HIPAA 规范的工作负载。技术保障措施包括数据隔离、访问控制和审计日志，均符合 HIPAA 要求。符合条件的客户可签署业务伙伴协议（BAA）。
            </p>

            <h3>GDPR</h3>
            <p>
              我们为所有欧洲用户遵守《通用数据保护条例》。我们的数据处理协议详细说明了数据处理方式、分处理商披露和数据主体权利。可根据要求提供欧盟区域算力资源。
            </p>

            <h3>数据隐私合规</h3>
            <p>
              算力租赁遵守适用的数据隐私法律法规。我们的隐私政策详细说明了数据的收集、使用、保留和删除实践。
            </p>

            <h2>安全架构</h2>

            <h3>客户数据隔离</h3>
            <ul>
              <li>每个工作负载在独立的非特权 Docker 容器中运行，与其他租户完全隔离</li>
              <li>客户仅能访问自己的数据——租户之间无共享文件系统</li>
              <li>客户删除实例后，数据立即销毁</li>
            </ul>

            <h3>网络与访问控制</h3>
            <ul>
              <li>所有 API 和控制台流量通过 TLS 1.2+ 加密传输</li>
              <li>基于角色的访问控制管理内部系统</li>
              <li>所有编程访问均采用 API 密钥认证</li>
            </ul>

            <h3>监控与应急响应</h3>
            <ul>
              <li>对平台全域异常活动进行持续监控</li>
              <li>制定了文档化的应急响应流程和明确的升级路径</li>
              <li>定期进行内部和第三方安全审计</li>
            </ul>

            <h3>员工安全</h3>
            <ul>
              <li>所有员工均进行背景调查</li>
              <li>入职时和此后每年进行安全与合规培训</li>
              <li>所有内部访问均遵循最小权限原则</li>
            </ul>

            <h2>安全层级</h2>
            <p>算力租赁提供两个安全层级以满足不同需求：</p>

            <h3>认证主机</h3>
            <p>适用于通用 AI 和高性能计算工作负载：</p>
            <ul>
              <li>经过手动测试以确保可靠性和性能</li>
              <li>Docker 级别的租户隔离</li>
              <li>非受监管工作负载的高性价比选择</li>
            </ul>

            <h3>安全云（可信数据中心）</h3>
            <p>适用于受监管行业和企业级安全需求：</p>
            <p><strong>数据中心合作伙伴要求：</strong></p>
            <ul>
              <li>设备托管在专业管理的数据中心设施中</li>
              <li>至少配备 5 台搭载旗舰级硬件的 GPU 服务器</li>
              <li>与算力租赁签署数据处理协议</li>
              <li>对设施安全、所有权和商业身份进行尽职调查</li>
            </ul>
            <p><strong>合作伙伴可能持有的认证包括：</strong></p>
            <ul>
              <li>ISO 27001、ISO 20000-1、ISO 22301、ISO 14001</li>
              <li>SOC 1 Type 2、SOC 2 Type 2、SOC 3</li>
              <li>HIPAA、HITRUST、PCI DSS</li>
              <li>NIST 框架、GDPR 合规</li>
            </ul>
            <p><strong>物理与环境安全：</strong></p>
            <ul>
              <li>设施进出采用生物识别或门禁卡认证</li>
              <li>视频监控保留 90 天以上</li>
              <li>火灾检测和灭火系统</li>
              <li>冗余电力和温控系统</li>
              <li>每年对所有环境控制系统进行测试</li>
            </ul>
            <p><strong>审计与监管：</strong></p>
            <ul>
              <li>算力租赁对数据中心合作伙伴的股权结构、身份和资金来源进行审计</li>
              <li>持续验证合作伙伴是否维持设施标准并遵循最佳实践</li>
            </ul>

            <h2>法律与合同保障</h2>
            <ul>
              <li>数据处理协议规范所有数据处理行为</li>
              <li>隐私政策详细说明数据的收集、使用和保留实践</li>
              <li>服务条款明确平台义务和客户权利</li>
              <li>安全云数据中心主机签署附带额外数据处理协议条款的扩展托管协议</li>
            </ul>

            <h2>安全记录</h2>
            <p>
              算力租赁自推出以来一直保持着清白的安全记录，未发生过重大安全事件。
            </p>

            <div className="legal-page__contact">
              <h2>联系我们</h2>
              <p>
                如需合规文档、审计报告或讨论您的安全需求：
              </p>
              <p>
                <strong>合规团队：</strong>compliance@example.com<br />
                <strong>销售团队：</strong>联系我们的销售团队
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
