import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

const CodeBlock = ({ language, value }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-lg overflow-hidden border border-slate-700/50 bg-[#1e1e1e]">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
                <span className="text-xs text-slate-400 font-mono uppercase">{language || 'code'}</span>
                <button
                    onClick={handleCopy}
                    className="p-1 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white"
                    title="Copy code"
                >
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                </button>
            </div>
            <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                wrapLines={true}
            >
                {value}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;
