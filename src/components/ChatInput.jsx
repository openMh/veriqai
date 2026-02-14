import { useRef, useEffect, useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const ChatInput = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
            // Reset height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    return (
        <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
            <div className="max-w-4xl mx-auto relative flex items-end gap-2 bg-slate-800/50 rounded-xl border border-slate-700/50 p-2 shadow-lg">
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="w-full bg-transparent border-0 focus:ring-0 resize-none max-h-[200px] min-h-[44px] py-3 px-2 text-slate-100 placeholder-slate-400 scrollbar-hide"
                    rows={1}
                    disabled={disabled}
                />

                <button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                    className={clsx(
                        "p-2.5 rounded-lg mb-0.5 transition-all duration-200 flex items-center justify-center",
                        input.trim() && !disabled
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95"
                            : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    )}
                >
                    {disabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </div>
            <div className="text-center mt-2">
                <p className="text-xs text-slate-500">
                    AI can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
};

export default ChatInput;
