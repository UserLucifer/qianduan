import type { Metadata } from 'next';
import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  FiCpu,
  FiX,
  FiZap,
} from 'react-icons/fi';
import Header from '@/components/marketing/Header';
import Footer from '@/components/marketing/Footer';
import { BuiltForSection } from '@/components/marketing/BuiltForSection';
import { normalizeLocale } from '@/i18n/locales';
import './use-case-detail.css';

const useCasePages = {
  'ai-text-generation': {
    visual: 'chat-workbench',
  },
  'ai-image-video-generation': {
    visual: 'image-overlay',
    image: '/images/use-cases/use_cases_5.webp',
  },
  'ai-agents': {
    visual: 'python-window',
  },
  'batch-data-processing': {
    visual: 'data-workbench',
  },
  'audio-to-text-transcription': {
    visual: 'audio-workbench',
  },
  'ai-fine-tuning': {
    visual: 'logs',
  },
  'virtual-computing': {
    visual: 'vm',
  },
  'gpu-programming': {
    visual: 'code',
  },
  '3d-rendering': {
    visual: 'rendering-workbench',
  },
} as const;

type UseCaseSlug = keyof typeof useCasePages;

type UseCasePageCopy = {
  title: string;
  description: string;
  imageAlt?: string;
  builtFor: string[];
};

type VisualCopy = {
  cudaEditorAria: string;
  editorMenuAria: string;
  editorMenu: string[];
  vmLabel: string;
  galleryExampleAlt: string;
  audioOutputTitle: string;
  audioTranscription: string;
  uploadAudio: string;
  dataProcessingLabel: string;
  imagePrompt: string;
  chatUserMessage: string;
  chatAiLines: string[];
  chatInputPlaceholder: string;
};

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return Object.keys(useCasePages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = useCasePages[slug as UseCaseSlug];

  if (!page) {
    return {};
  }

  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "UseCaseDetail" });
  const pageCopy = t.raw(`pages.${slug}`) as UseCasePageCopy;

  return {
    title: t("metadataTitle", { title: pageCopy.title }),
    description: pageCopy.description,
  };
}

function VisualPanel({
  page,
  visualCopy,
}: {
  page: (typeof useCasePages)[UseCaseSlug] & UseCasePageCopy;
  visualCopy: VisualCopy;
}) {
  if ('visual' in page && page.visual === 'image-overlay' && 'image' in page) {
    const p = page as unknown as { image: string; imageAlt?: string; title: string };
    return <ImageOverlayShowcase src={p.image} alt={p.imageAlt ?? p.title} prompt={visualCopy.imagePrompt} />;
  }

  if ('visual' in page && page.visual === 'chat-workbench') {
    return <ChatWorkbenchShowcase copy={visualCopy} />;
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
            <Image
              src={src}
              alt={visualCopy.galleryExampleAlt.replace("{title}", p.title).replace("{index}", String(index + 1))}
              fill
              sizes="(max-width: 900px) 50vw, 260px"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    );
  }

  if ('visual' in page && page.visual === 'code') {
    return <CudaEditorShowcase copy={visualCopy} />;
  }

  if ('visual' in page && page.visual === 'vm') {
    return <VirtualMachineShowcase label={visualCopy.vmLabel} />;
  }

  if ('visual' in page && page.visual === 'logs') {
    return <TrainingLogShowcase />;
  }

  if ('visual' in page && page.visual === 'audio-workbench') {
    return <AudioTranscriptionShowcase copy={visualCopy} />;
  }

  if ('visual' in page && page.visual === 'data-workbench') {
    return <DataProcessingShowcase processingLabel={visualCopy.dataProcessingLabel} />;
  }

  if ('visual' in page && page.visual === 'python-window') {
    return <PythonCodeShowcase />;
  }

  const p = page as { visual?: string };
  return typeof p.visual === 'string' ? (
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

function CudaEditorShowcase({ copy }: { copy: VisualCopy }) {
  return (
    <section className="cuda-editor" aria-label={copy.cudaEditorAria}>
      <div className="cuda-editor__toolbar">
        <nav className="cuda-editor__menu" aria-label={copy.editorMenuAria}>
          {copy.editorMenu.map((item) => (
            <span key={item}>{item}</span>
          ))}
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

function VirtualMachineShowcase({ label }: { label: string }) {
  return (
    <div className="vm-window">
      <div className="vm-window__header">
        <div className="vm-window__tag">
          <div className="vm-window__logo">
          <FiCpu />
        </div>
          <span>{label}</span>
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

function AudioTranscriptionShowcase({ copy }: { copy: VisualCopy }) {
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
          <span className="aw-window__title">{copy.audioOutputTitle}</span>
          <p className="aw-transcription-text">
            {copy.audioTranscription}
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
            <span>{copy.uploadAudio}</span>
            <div className="aw-upload-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DataProcessingShowcase({ processingLabel }: { processingLabel: string }) {
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
            <span>{processingLabel}</span>
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

function ImageOverlayShowcase({ src, alt, prompt }: { src: string; alt: string; prompt: string }) {
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
          {prompt}
        </p>
      </div>
    </div>
  );
}

function ChatWorkbenchShowcase({ copy }: { copy: VisualCopy }) {
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
            {copy.chatUserMessage}
          </div>
          <div className="cw-msg cw-msg--ai">
            {copy.chatAiLines.map((line, index) => (
              <React.Fragment key={line}>
                {line}
                {index < copy.chatAiLines.length - 1 ? <br /> : null}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="cw-chat-footer">
          <div className="cw-input-bar">
            <span>{copy.chatInputPlaceholder}</span>
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
  const { locale, slug } = await params;
  const pageMeta = useCasePages[slug as UseCaseSlug];

  if (!pageMeta) {
    notFound();
  }

  const language = normalizeLocale(locale);
  const t = await getTranslations({ locale: language, namespace: "UseCaseDetail" });
  const page = {
    ...pageMeta,
    ...(t.raw(`pages.${slug}`) as UseCasePageCopy),
  };
  const visualCopy = t.raw("visual") as VisualCopy;

  return (
    <>
      <Header />
      <main className="uc-detail">
        <section className="uc-detail-hero">
          <div className="uc-detail-hero__copy">
            <h1>{page.title}</h1>
            <p>{page.description}</p>
          </div>
          <VisualPanel page={page} visualCopy={visualCopy} />
        </section>

        <BuiltForSection title={t("builtForTitle")} items={page.builtFor} />
      </main>
      <Footer />
    </>
  );
}
