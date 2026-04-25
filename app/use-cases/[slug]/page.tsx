import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  FiCheckCircle,
  FiCpu,
  FiX,
  FiZap,
} from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { BuiltForSection } from '../../components/BuiltForSection';
import './use-case-detail.css';

const useCasePages = {
  'ai-text-generation': {
    title: 'AI文本生成',
    description: '通过 GPU 加速的分布式推理，数分钟内启动并扩展最新大语言模型。',
    visual: 'chat-workbench',
    builtFor: [
      '启动 LLaMA 3、DeepSeek 等开源模型，或加载您自己的微调检查点。',
      '跳过 DevOps 配置，使用 vLLM、TGI、Oobabooga 等预构建镜像承载推理服务。',
      '通过简洁 API 或 WebUI 提供模型服务，尽量减少上线前的手动设置。',
      '完全掌控运行环境。模型运行在隔离 GPU 上，数据按您的要求清除。',
    ],
  },
  'ai-image-video-generation': {
    title: 'AI图像+视频生成',
    description: '使用 GPU 驱动的创意工作流，高效生成高质量图像和视频。',
    visual: 'image-overlay',
    image: '/images/use-cases/use_cases_5.webp',
    imageAlt: 'AI 图像和视频生成工作流',
    builtFor: [
      '使用 Stable Diffusion、Disco Diffusion 等模型生成高分辨率输出。',
      '数分钟内启动针对创意工作负载优化的预配置环境。',
      '为计算密集型渲染接入强大 GPU，同时控制预算。',
      '使用 Stable Diffusion 与 Disco Diffusion 模板简化部署和资源管理。',
    ],
  },
  'ai-agents': {
    title: '人工智能代理',
    description: '使用高性价比 GPU 算力部署并扩展 AI 代理工作负载。',
    visual: 'python-window',
    builtFor: [
      '运行您已经在用的框架，支持 LangChain、Langflow、AutoGen、CrewAI 或自定义代码。',
      '让代理工作负载从单节点平滑扩展到分布式集群。',
      '按秒计费，并通过实时利用率看板跟踪 GPU、CPU 和成本指标。',
      '将 Docker 镜像、库、CUDA 与驱动版本固化为可复用模板。',
      '用 OpenAI 兼容的聊天端点切换到开源等效方案，显著降低每 token 成本。',
    ],
  },
  'batch-data-processing': {
    title: '批量数据处理',
    description: '借助可靠的 GPU 性能，加速大规模数据处理与自动化 ETL 任务。',
    visual: 'data-workbench',
    builtFor: [
      '自动化大规模数据转换、清洗和整理任务。',
      '根据批处理作业需求动态分配计算资源。',
      '通过按秒计费和可中断实例选项降低空闲成本。',
      '轻松接入现有数据管道或云存储。',
    ],
  },
  'audio-to-text-transcription': {
    title: '音频转文本转录',
    description: '使用 GPU 驱动转录，快速将音频转换为准确文本处理工作负载。',
    visual: 'audio-workbench',
    builtFor: [
      '使用开源模型将音频文件转换为准确转录文本。',
      '通过可扩展 GPU 访问处理大规模转录工作负载。',
      '在锁定容器内支持多语言和常见音频格式。',
      '通过一键操作或 CLI 启动可直接使用的语音转文本环境。',
    ],
  },
  'ai-fine-tuning': {
    title: 'AI微调',
    description: '使用高效、按需的微调流程提升 AI 模型表现。',
    visual: 'logs',
    builtFor: [
      '在您自己的数据集上训练并优化预训练模型，获得更贴合任务的结果。',
      '使用强大 GPU 缩短训练时间并降低成本。',
      '按模型规模定制存储、内存和计算资源。',
      '训练完成后，将微调模型无缝部署到推理环境。',
    ],
  },
  'virtual-computing': {
    title: '虚拟计算',
    description: '轻松配置支持 GPU 的虚拟机，获得灵活且安全的访问方式。',
    visual: 'vm',
    builtFor: [
      '数秒内启动支持 GPU 的虚拟桌面或远程工作站。',
      '运行 Linux 或 Ubuntu，并完整访问您偏好的工具和工作流。',
      '按需调整资源，无需更换云服务商或套餐。',
      '在专用环境中保持隐私与隔离。',
    ],
  },
  'gpu-programming': {
    title: 'GPU编程',
    description: '加速 AI 与 HPC 突破，在规模化 GPU 计算上释放极致性能。',
    visual: 'code',
    builtFor: [
      '为自定义 CUDA 应用开发访问原始 GPU 算力。',
      '针对 A100、4090 等特定架构优化性能。',
      '使用完整管理员权限配置驱动、内存和执行环境。',
      '用极少设置在多种 GPU 类型之间测试和迭代。',
    ],
  },
  '3d-rendering': {
    title: '图形渲染',
    description: '使用强大的 GPU 加速能力，加速 3D 渲染与图形处理工作流。',
    visual: 'rendering-workbench',
    builtFor: [
      '使用 GPU 加速快速渲染细节丰富的 3D 模型。',
      '为复杂动画或可视化降低帧时间与场景处理耗时。',
      '无需长期合约即可访问专业级 GPU。',
      '支持 VFX、产品设计、建筑等更多渲染工作流。',
    ],
  },
} as const;

type UseCaseSlug = keyof typeof useCasePages;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(useCasePages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = useCasePages[slug as UseCaseSlug];

  if (!page) {
    return {};
  }

  return {
    title: `${page.title} — 算力租赁`,
    description: page.description,
  };
}

function VisualPanel({ page }: { page: (typeof useCasePages)[UseCaseSlug] }) {
  if ('visual' in page && page.visual === 'image-overlay' && 'image' in page) {
    const p = page as unknown as { image: string; imageAlt: string };
    return <ImageOverlayShowcase src={p.image} alt={p.imageAlt} />;
  }

  if ('visual' in page && page.visual === 'chat-workbench') {
    return <ChatWorkbenchShowcase />;
  }

  if ('visual' in page && page.visual === 'rendering-workbench') {
    return <RenderingWorkbenchShowcase />;
  }

  if ('image' in page) {
    const p = page as unknown as { image: string; imageAlt: string };
    return (
      <div className="uc-detail-visual uc-detail-visual--image">
        <Image src={p.image} alt={p.imageAlt} fill sizes="(max-width: 900px) 100vw, 520px" priority />
      </div>
    );
  }

  if ('gallery' in page) {
    const p = page as unknown as { gallery: readonly string[]; title: string };
    return (
      <div className="uc-detail-gallery">
        {p.gallery.map((src, index) => (
          <div className="uc-detail-gallery__item" key={src}>
            <Image src={src} alt={`${p.title}示例 ${index + 1}`} fill sizes="(max-width: 900px) 50vw, 260px" priority={index === 0} />
          </div>
        ))}
      </div>
    );
  }

  if ('visual' in page && page.visual === 'code') {
    return <CudaEditorShowcase />;
  }

  if ('visual' in page && page.visual === 'vm') {
    return <VirtualMachineShowcase />;
  }

  if ('visual' in page && page.visual === 'logs') {
    return <TrainingLogShowcase />;
  }

  if ('visual' in page && page.visual === 'audio-workbench') {
    return <AudioTranscriptionShowcase />;
  }

  if ('visual' in page && page.visual === 'data-workbench') {
    return <DataProcessingShowcase />;
  }

  if ('visual' in page && page.visual === 'python-window') {
    return <PythonCodeShowcase />;
  }

  const p = page as any;
  return 'visual' in p ? (
    <div className={`uc-detail-visual uc-detail-visual--${p.visual}`}>
      <div className="uc-detail-visual__topbar">
        <span />
        <span />
        <span />
      </div>
      <div className="uc-detail-visual__content">
        <div className="uc-detail-visual__chip">
          <FiCpu />
          GPU ready
        </div>
        <div className="uc-detail-visual__line uc-detail-visual__line--wide" />
        <div className="uc-detail-visual__line" />
        <div className="uc-detail-visual__grid">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  ) : null;
}

function CudaEditorShowcase() {
  return (
    <section className="cuda-editor" aria-label="CUDA 代码编辑器展示">
      <div className="cuda-editor__toolbar">
        <nav className="cuda-editor__menu" aria-label="编辑器菜单">
          <span>文件</span>
          <span>编辑</span>
          <span>查看</span>
          <span>查找</span>
          <span>帮助</span>
        </nav>
        <div className="cuda-editor__window-controls" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="cuda-editor__body">
        <div className="cuda-editor__row cuda-editor__row--active">
          <span className="cuda-editor__line">1</span>
          <code><span className="tok tok--pre">#include</span> <span className="tok tok--string">&lt;stdio.h&gt;</span></code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">2</span>
          <code />
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">3</span>
          <code><span className="tok tok--keyword">__global__</span> <span className="tok tok--type">void</span> <span className="tok tok--fn">vector_add</span>(<span className="tok tok--type">float</span> *A, <span className="tok tok--type">float</span> *B,</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">4</span>
          <code><span className="cuda-editor__indent">  </span><span className="tok tok--type">float</span> *C, <span className="tok tok--type">int</span> N) {'{'}</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">5</span>
          <code><span className="cuda-editor__indent">    </span><span className="tok tok--type">int</span> idx = threadIdx.x + blockIdx.x * blockDim.x;</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">6</span>
          <code><span className="cuda-editor__indent">    </span><span className="tok tok--flow">if</span> (idx &lt; N) {'{'}</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">7</span>
          <code><span className="cuda-editor__indent">      </span>C[idx] = A[idx] + B[idx];</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">8</span>
          <code><span className="cuda-editor__indent">    </span>{'}'}</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">9</span>
          <code>{'}'}</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">10</span>
          <code />
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">11</span>
          <code><span className="tok tok--type">int</span> <span className="tok tok--fn">main</span>() {'{'}</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">12</span>
          <code><span className="cuda-editor__indent">  </span><span className="tok tok--keyword">const</span> <span className="tok tok--type">int</span> N = <span className="tok tok--number">1024</span>;</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">13</span>
          <code><span className="cuda-editor__indent">  </span>size_t size = N * <span className="tok tok--fn">sizeof</span>(<span className="tok tok--type">float</span>);</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">14</span>
          <code />
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">15</span>
          <code><span className="cuda-editor__indent">  </span><span className="tok tok--type">float</span> *h_A = (<span className="tok tok--type">float</span> *)<span className="tok tok--fn">malloc</span>(size);</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">16</span>
          <code><span className="cuda-editor__indent">  </span><span className="tok tok--type">float</span> *h_B = (<span className="tok tok--type">float</span> *)<span className="tok tok--fn">malloc</span>(size);</code>
        </div>
        <div className="cuda-editor__row">
          <span className="cuda-editor__line">17</span>
          <code><span className="cuda-editor__indent">  </span><span className="tok tok--type">float</span> *h_C = (<span className="tok tok--type">float</span> *)<span className="tok tok--fn">malloc</span>(size);</code>
        </div>
      </div>
    </section>
  );
}

function VirtualMachineShowcase() {
  return (
    <div className="vm-window">
      <div className="vm-window__header">
        <div className="vm-window__tag">
          <div className="vm-window__logo">
            <FiCpu />
          </div>
          <span>虚拟机</span>
          <div className="vm-window__close">
            <FiX />
          </div>
        </div>
        <div className="vm-window__header-line" />
      </div>
      <div className="vm-window__content">
        <div className="vm-window__image-container">
          <Image
            src="/images/use-cases/use_cases_6.png"
            alt="Virtual Machine Interface"
            fill
            sizes="(max-width: 900px) 100vw, 440px"
            priority
          />
        </div>
      </div>
    </div>
  );
}

function TrainingLogShowcase() {
  return (
    <div className="terminal-window">
      <div className="terminal-window__header">
        <div className="terminal-window__controls">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="terminal-window__divider" />
      <div className="terminal-window__body">
        <div className="terminal-window__line">
          <span className="log-cmd">$ python train.py --model <span className="log-path">llama-3-8b</span> --batch_size <span className="log-val">32</span> --lr <span className="log-val">2e-5</span></span>
        </div>
        <div className="terminal-window__line">
          <span className="log-time">[2024-04-24 10:18:22]</span> <span className="log-info">INFO:</span> Detected <span className="log-device">8x NVIDIA H100 80GB SXM5</span>
        </div>
        <div className="terminal-window__line">
          <span className="log-time">[2024-04-24 10:18:25]</span> <span className="log-info">INFO:</span> Initializing distributed training (DDP)
        </div>
        <div className="terminal-window__line">
          <span className="log-time">[2024-04-24 10:18:30]</span> <span className="log-info">INFO:</span> Loading dataset from <span className="log-path">/datasets/pile_v2_subset</span>
        </div>
        <div className="terminal-window__line">
          <span className="log-time">[2024-04-24 10:18:45]</span> <span className="log-info">INFO:</span> Model weight loaded from <span className="log-path">/checkpoints/llama-3-base</span>
        </div>
        <div className="terminal-window__line">
          <span className="log-time">[2024-04-24 10:19:02]</span> <span className="log-info">INFO:</span> Starting training loop...
        </div>
        <div className="terminal-window__line">
          Step <span className="log-val">100</span>/5000 | Loss: <span className="log-val">2.1452</span> | PPL: <span className="log-val">8.54</span> | Speed: <span className="log-val">1240</span> tokens/sec
        </div>
        <div className="terminal-window__line">
          Step <span className="log-val">200</span>/5000 | Loss: <span className="log-val">1.9842</span> | PPL: <span className="log-val">7.27</span> | Speed: <span className="log-val">1245</span> tokens/sec
        </div>
        <div className="terminal-window__line terminal-window__line--active">
          Step <span className="log-val">300</span>/5000 | Loss: <span className="log-val">1.8721</span> | PPL: <span className="log-val">6.50</span> | Speed: <span className="log-val">1242</span> tokens/sec
        </div>
        <div className="terminal-window__line">
          <span className="log-cmd">_</span>
        </div>
      </div>
    </div>
  );
}

function AudioTranscriptionShowcase() {
  return (
    <div className="audio-workbench">
      {/* Large Output Window */}
      <div className="aw-window aw-window--output">
        <div className="aw-window__header">
          <div className="aw-window__dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="aw-window__body">
          <span className="aw-window__title">音频转文本输出：</span>
          <p className="aw-transcription-text">
            在计算生物学领域，高性能计算正以前所未有的速度推动药物研发。
            我们的平台通过分布式 GPU 集群，将原本需要数周的蛋白质折叠
            模拟缩短至数小时。这不仅加速了科学发现，也显著降低了
            初创企业的研发门槛...
          </p>
        </div>
      </div>

      {/* Small Input Window */}
      <div className="aw-window aw-window--input">
        <div className="aw-window__header">
          <div className="aw-window__dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="aw-window__body">
          <div className="aw-waveform">
            <img src="/images/use-cases/audio.svg" alt="Audio Waveform" />
          </div>
          <div className="aw-upload-bar">
            <span>上传音频</span>
            <div className="aw-upload-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DataProcessingShowcase() {
  const progresses = [
    { name: 'data_chunk_01.csv', progress: 100 },
    { name: 'data_chunk_02.csv', progress: 100 },
    { name: 'data_chunk_03.csv', progress: 50 },
    { name: 'data_chunk_04.csv', progress: 0 },
  ];

  return (
    <div className="data-workbench">
      {/* Main Window (Python) */}
      <div className="dw-window dw-window--main">
        <div className="dw-window__header">
          <div className="dw-window__tag">
            <FiCpu size={12} color="var(--accent-hover)" />
            <span>Python</span>
            <FiX className="dw-window__close" />
          </div>
          <div className="dw-window__header-line" />
        </div>
        <div className="dw-window__body">
          <div className="dw-python-code">
            <code>
              import cudf<br />
              df = cudf.read_csv('data.csv')<br />
              res = df.groupby('key').mean()<br />
              print("Processing batch: 8/12...")
            </code>
          </div>
          <div className="dw-chart">
            <img src="/images/use-cases/chart.svg" alt="Data Chart" />
          </div>
        </div>
      </div>

      {/* Sub Window (Processing) */}
      <div className="dw-window dw-window--sub">
        <div className="dw-window__header">
          <div className="dw-window__tag">
            <FiCpu size={12} color="var(--accent-hover)" />
            <span>加工</span>
            <FiX className="dw-window__close" />
          </div>
          <div className="dw-window__header-line" />
        </div>
        <div className="dw-window__body">
          <div className="dw-progress-list">
            {progresses.map((p) => (
              <div key={p.name} className="dw-progress-item">
                <div className="dw-progress-info">
                  <span>{p.name}</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="dw-progress-bar-bg">
                  <div
                    className="dw-progress-bar-fill"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PythonCodeShowcase() {
  const codeLines = [
    { num: 1, content: <><span className="py-kw">from</span> langgraph <span className="py-kw">import</span> StateGraph, END</>, active: true },
    { num: 2, content: <><span className="py-kw">from</span> typing <span className="py-kw">import</span> TypedDict, Annotated</> },
    { num: 3, content: <><span className="py-kw">import</span> operator</> },
    { num: 4, content: <><span className="py-cmt"># Define AI Agent workflow</span></> },
    { num: 5, content: <><span className="py-kw">class</span> <span className="py-fn">AgentState</span>(TypedDict):</> },
    { num: 6, content: <>    messages: Annotated[list, operator.add]</> },
    { num: 7, content: <><code /></> },
    { num: 8, content: <>workflow = StateGraph(AgentState)</> },
    { num: 9, content: <>workflow.add_node(<span className="py-str">"agent"</span>, call_model)</> },
    { num: 10, content: <>workflow.add_node(<span className="py-str">"action"</span>, call_tool)</> },
    { num: 11, content: <>workflow.set_entry_point(<span className="py-str">"agent"</span>)</> },
  ];

  return (
    <div className="python-window">
      <div className="python-window__header">
        <div className="python-window__tag">
          <FiCpu size={14} color="var(--accent-hover)" />
          <span>Python</span>
          <FiX style={{ marginLeft: '4px', opacity: 0.3 }} />
        </div>
        <div className="python-window__header-line" />
      </div>
      <div className="python-window__body">
        <div className="python-window__lines">
          {codeLines.map(line => (
            <span key={line.num}>{line.num}</span>
          ))}
        </div>
        <div className="python-window__code">
          {codeLines.map(line => (
            <div key={line.num} className={`python-window__row ${line.active ? 'python-window__row--active' : ''}`}>
              {line.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageOverlayShowcase({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="image-overlay-card">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 900px) 100vw, 520px"
        priority
      />
      <div className="image-overlay-card__bar">
        <p className="image-overlay-card__text">
          生成一架未来感十足的GPU运载无人机，穿梭于壮丽的沙漠景观之中。
        </p>
      </div>
    </div>
  );
}

function ChatWorkbenchShowcase() {
  const codeLines = [
    { num: 1, content: <><span className="py-kw">from</span> vast <span className="py-kw">import</span> Client</> },
    { num: 2, content: <>client = Client(api_key=<span className="py-str">"vast_..."</span>)</> },
    { num: 3, content: <>response = client.chat.completions.create(</> },
    { num: 4, content: <>    model=<span className="py-str">"deepseek-v3"</span>,</> },
    { num: 5, content: <>    messages=[{'{'}<span className="py-str">"role"</span>: <span className="py-str">"user"</span>, ...{'}'}]</> },
    { num: 6, content: <>)</> },
  ];

  return (
    <div className="chat-workbench">
      {/* Code Window */}
      <div className="cw-window cw-window--code">
        <div className="cw-window__header">
          <div className="cw-window__dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="cw-code-body">
          <div className="cw-code-lines">
            {codeLines.map(l => <span key={l.num}>{l.num}</span>)}
          </div>
          <div className="cw-code-content">
            {codeLines.map(l => (
              <div key={l.num}>{l.content}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="cw-window cw-window--chat">
        <div className="cw-window__header">
          <div className="cw-window__dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="cw-chat-body">
          <div className="cw-msg cw-msg--user">
            总结一下量子计算在 2024 年的主要突破。
          </div>
          <div className="cw-msg cw-msg--ai">
            2024 年量子计算取得了显著进展：<br />
            1. 纠错能力提升 <span className="log-val">10x</span><br />
            2. 逻辑量子比特突破 <span className="log-val">48</span> 个<br />
            3. 首次在商业云端实现容错模拟...
          </div>
        </div>
        <div className="cw-chat-footer">
          <div className="cw-input-bar">
            <span>输入消息...</span>
            <div className="cw-send-btn">
              <FiZap />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderingWorkbenchShowcase() {
  return (
    <div className="rendering-workbench">
      {/* Back Window (Left) */}
      <div className="rw-window rw-window--back">
        <div className="rw-window__header">
          <div className="rw-window__dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="rw-window__body">
          <img src="/images/use-cases/use_cases_7.jpeg" alt="3D Rendering Back" />
        </div>
      </div>

      {/* Front Window (Right) */}
      <div className="rw-window rw-window--front">
        <div className="rw-window__header">
          <div className="rw-window__dots">
            <span /><span /><span />
          </div>
        </div>
        <div className="rw-window__body">
          <img src="/images/use-cases/use_cases_8.jpeg" alt="3D Rendering Front" />
        </div>
      </div>
    </div>
  );
}

export default async function UseCaseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const page = useCasePages[slug as UseCaseSlug];

  if (!page) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="uc-detail">
        <section className="uc-detail-hero">
          <div className="uc-detail-hero__copy">
            <h1>{page.title}</h1>
            <p>{page.description}</p>
          </div>
          <VisualPanel page={page} />
        </section>

        <BuiltForSection items={page.builtFor as unknown as string[]} />
      </main>
      <Footer />
    </>
  );
}
