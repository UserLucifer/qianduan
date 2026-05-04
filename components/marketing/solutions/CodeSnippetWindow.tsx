'use client';

import React from 'react';

interface CodeSnippetWindowProps {
  code: string;
}

export const CodeSnippetWindow: React.FC<CodeSnippetWindowProps> = ({ code }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-[#0d1117] shadow-2xl">
      {/* macOS dots */}
      <div className="flex items-center gap-1.5 border-b border-border/10 bg-[#161b22] px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
        <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
        <div className="ml-2 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest font-mono">
          Terminal
        </div>
      </div>
      
      {/* Code Area */}
      <div className="p-6 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-slate-300">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="whitespace-pre">
                <span className="text-slate-500 mr-4 inline-block w-4 text-right select-none">{i + 1}</span>
                {/* Very basic color highlighting for demo */}
                <span dangerouslySetInnerHTML={{ 
                  __html: line
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"(.*?)"/g, '<span class="text-emerald-400">"$1"</span>')
                    .replace(/\b(const|let|var|function|return|import|from|export|default|async|await|if|else|for|while)\b/g, '<span class="text-purple-400">$1</span>')
                    .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
                }} />
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};
