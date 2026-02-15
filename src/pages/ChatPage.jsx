import { useState, useEffect } from 'react';
import { Menu, Settings as SettingsIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import SettingsModal from '../components/SettingsModal';
import { fetchAIResponse } from '../services/aiService';
import { storage } from '../utils/storage';
import { generateTitle } from '../utils/formatters';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [history, setHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState({ apiKey: '', model: 'gpt-3.5-turbo' });

    // Load data on mount
    useEffect(() => {
        const loadedHistory = storage.getHistory();
        const loadedSettings = storage.getSettings();
        setHistory(loadedHistory);
        setSettings(loadedSettings);
    }, []);

    // Save history when it changes
    useEffect(() => {
        storage.saveHistory(history);
    }, [history]);

    // Save settings when they change (handled in SettingsModal saving, but could be reactive here too)

    const createNewChat = () => {
        const newChatId = crypto.randomUUID();
        const newChat = {
            id: newChatId,
            title: 'New Chat',
            messages: [],
            updatedAt: Date.now(),
        };
        setHistory(prev => [newChat, ...prev]);
        setCurrentChatId(newChatId);
        setMessages([]);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectChat = (chatId) => {
        const chat = history.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chatId);
            setMessages(chat.messages);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
        }
    };

    const handleDeleteChat = (chatId) => {
        setHistory(prev => prev.filter(c => c.id !== chatId));
        if (currentChatId === chatId) {
            setCurrentChatId(null);
            setMessages([]);
        }
    };

    const handleSendMessage = async (content) => {
        const provider = settings.provider || 'openai';
        const hasEnvKey = provider === 'google'
            ? !!import.meta.env.VITE_GEMINI_API_KEY
            : !!import.meta.env.VITE_OPENAI_API_KEY;

        if (!settings.apiKey && !hasEnvKey) {
            setIsSettingsOpen(true);
            alert(`Please enter your ${provider === 'google' ? 'Gemini' : 'OpenAI'} API Key in settings, or configure it on the server.`);
            return;
        }

        let activeChatId = currentChatId;
        let currentHistory = history;

        // Create new chat if none selected
        if (!activeChatId) {
            activeChatId = crypto.randomUUID();
            const newChat = {
                id: activeChatId,
                title: generateTitle(content),
                messages: [],
                updatedAt: Date.now(),
            };
            // We update state immediately but also need a local ref for logic
            setHistory(prev => [newChat, ...prev]);
            setCurrentChatId(activeChatId);
            currentHistory = [newChat, ...history];
        }

        // Add User Message
        const userMessage = { role: 'user', content };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        // Update History immediately with user message
        setHistory(prev => prev.map(chat =>
            chat.id === activeChatId
                ? { ...chat, messages: newMessages, updatedAt: Date.now(), title: chat.messages.length === 0 ? generateTitle(content) : chat.title }
                : chat
        ));

        try {
            // Fetch AI Response
            // We pass the entire history of this chat as context
            const aiContent = await fetchAIResponse(newMessages, settings.apiKey, settings.model, settings.provider);

            const aiMessage = { role: 'assistant', content: aiContent };
            const finalizedMessages = [...newMessages, aiMessage];

            setMessages(finalizedMessages);

            // Update History with AI message
            setHistory(prev => prev.map(chat =>
                chat.id === activeChatId
                    ? { ...chat, messages: finalizedMessages, updatedAt: Date.now() }
                    : chat
            ));

        } catch (error) {
            console.error(error);
            const errorMessage = { role: 'assistant', content: `**Error:** ${error.message}` };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSettings = (newSettings) => {
        setSettings(newSettings);
        storage.saveSettings(newSettings);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
            <Sidebar
                history={history}
                activeChatId={currentChatId}
                onSelectChat={handleSelectChat}
                onNewChat={createNewChat}
                onDeleteChat={handleDeleteChat}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <main className="flex-1 flex flex-col relative w-full h-full transition-all duration-300">
                {/* Header */}
                <header className="h-16 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <span className="font-semibold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            VeriqAI
                        </span>
                    </div>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Settings"
                    >
                        <SettingsIcon size={20} />
                    </button>
                </header>

                {/* Chat Area */}
                <ChatWindow messages={messages} isThinking={isLoading} />

                {/* Input Area */}
                <ChatInput onSend={handleSendMessage} disabled={isLoading} />

            </main>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                settings={settings}
                onSave={handleSaveSettings}
            />
        </div>
    );
};

export default ChatPage;
