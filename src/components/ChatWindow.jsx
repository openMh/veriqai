import { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Bot } from 'lucide-react';

const ChatWindow = ({ messages, isThinking }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-end">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-80 min-h-[50vh]">
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-slate-700/50">
                            <Bot size={48} className="text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-200 mb-2">How can I help you today?</h2>
                        <p className="text-slate-400 max-w-md text-center">I can help you with writing code, answering questions, or just creative tasks.</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <MessageBubble key={index} message={msg} />
                        ))}

                        {isThinking && (
                            <div className="flex items-center gap-2 text-slate-400 mb-6 ml-2 animate-pulse">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-3">
                                    <Bot size={18} className="text-white" />
                                </div>
                                <span className="text-sm font-medium">AI is thinking...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatWindow;
