'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const defaultCodeString = `# Install SUNK with Helm
helm repo add coreweave https://helm.coreweave.com
helm repo update

helm install sunk coreweave/sunk \\
  --namespace slurm \\
  --create-namespace \\
  -f sunk-values.yaml

# Verify controller status
kubectl get pods -n slurm -l app.kubernetes.io/name=sunk`;

type SunkCodeBlockProps = {
  codeString?: string;
  className?: string;
};

export default function SunkCodeBlock({
  codeString = defaultCodeString,
  className,
}: SunkCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, amount: 0.35 });
  const shouldReduceMotion = useReducedMotion();
  const isVisible = shouldReduceMotion || isInView;

  async function copyCode() {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        'relative max-w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#050814] shadow-2xl shadow-indigo-950/35',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-950 via-[#070b18] to-indigo-950" />
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <AnimatePresence>
          {copied ? (
            <motion.span
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur"
            >
              Copied!
            </motion.span>
          ) : null}
        </AnimatePresence>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label="Copy code"
          onClick={copyCode}
          className="h-9 w-9 rounded-md border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? 'check' : 'copy'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-200" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>

      <Highlight theme={themes.nightOwl} code={codeString} language="bash">
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="relative max-w-full overflow-hidden px-0 py-8 text-sm leading-7 whitespace-pre-wrap sm:text-[15px]">
            <code className="block w-full min-w-0 pr-3 sm:pr-6">
              <motion.span
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: shouldReduceMotion ? 0 : 0.06,
                    },
                  },
                }}
                className="block"
              >
                {tokens.map((line, index) => {
                  const { key: _lineKey, className: lineClassName, ...lineProps } = getLineProps({ line });

                  return (
                    <motion.span
                      {...lineProps}
                      key={index}
                      variants={{
                        hidden: { opacity: 0, y: 6 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: {
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }}
                      className={cn(lineClassName, 'grid grid-cols-[2.75rem_minmax(0,1fr)] sm:grid-cols-[3.5rem_minmax(0,1fr)]')}
                    >
                      <span className="select-none border-r border-white/10 px-3 text-right font-mono text-slate-500 sm:px-4">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 break-words px-3 font-mono whitespace-pre-wrap [overflow-wrap:anywhere] sm:px-5">
                        {line.map((token, tokenIndex) => {
                          const { key: _tokenKey, ...tokenProps } = getTokenProps({ token });

                          return <span {...tokenProps} key={tokenIndex} />;
                        })}
                      </span>
                    </motion.span>
                  );
                })}
              </motion.span>
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
