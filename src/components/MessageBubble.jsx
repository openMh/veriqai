import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import CodeBlock from './CodeBlock';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
    const isAI = message.role === 'assistant';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={clsx(
                "flex w-full mb-6",
                isAI ? "justify-start" : "justify-end"
            )}
        >
            <div className={clsx(
                "flex max-w-[85%] md:max-w-[75%]",
                isAI ? "flex-row" : "flex-row-reverse"
            )}>
                {/* Avatar */}
                <div className={clsx(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1",
                    isAI ? "bg-gradient-to-br from-cyan-500 to-blue-600 mr-3" : "bg-slate-700 ml-3"
                )}>
                    {isAI ? <Bot size={18} className="text-white" /> : <User size={18} className="text-slate-300" />}
                </div>

                {/* Content */}
                <div className={clsx(
                    "px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed overflow-hidden",
                    isAI
                        ? "bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-slate-100 rounded-tl-sm"
                        : "bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm"
                )}>
                    {isAI ? (
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                                    ) : (
                                        <code className="bg-slate-900/50 px-1.5 py-0.5 rounded text-cyan-300 font-mono text-xs" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-4">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-4">{children}</ol>,
                                h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4 text-white">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 text-white">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-3 text-white">{children}</h3>,
                                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                a: ({ href, children }) => (
                                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
