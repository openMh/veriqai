import { MessageSquare, Plus, Trash2, X } from 'lucide-react';
import clsx from 'clsx';
import { formatDate } from '../utils/formatters';

const Sidebar = ({ history, fontHistory, activeChatId, onSelectChat, onNewChat, onDeleteChat, isOpen, setIsOpen }) => {
    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Content */}
            <aside className={clsx(
                "fixed md:static inset-y-0 left-0 z-30 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transform transition-transform duration-300 md:translate-x-0 flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <button
                        onClick={onNewChat}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-xl transition-colors border border-slate-700/50 shadow-lg shadow-black/20"
                    >
                        <Plus size={18} className="text-cyan-400" />
                        <span className="font-medium">New Chat</span>
                    </button>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden ml-2 p-2 text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto py-2">
                    {history.length === 0 ? (
                        <div className="text-center text-slate-500 mt-10 px-6">
                            <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
                            <p className="text-sm">No chats yet.</p>
                            <p className="text-xs mt-1">Start a new conversation!</p>
                        </div>
                    ) : (
                        <div className="px-3 space-y-1">
                            <h3 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent</h3>
                            {history.map((chat) => (
                                <div
                                    key={chat.id}
                                    className="group relative"
                                >
                                    <button
                                        onClick={() => {
                                            onSelectChat(chat.id);
                                            if (window.innerWidth < 768) setIsOpen(false);
                                        }}
                                        className={clsx(
                                            "w-full text-left p-3 rounded-lg text-sm transition-all duration-200 flex flex-col gap-1",
                                            activeChatId === chat.id
                                                ? "bg-slate-800 text-cyan-400 shadow-md border border-slate-700/50"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                        )}
                                    >
                                        <span className="font-medium truncate pr-6 block">{chat.title}</span>
                                        <span className="text-xs opacity-60 font-mono">{formatDate(chat.updatedAt)}</span>
                                    </button>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChat(chat.id);
                                        }}
                                        className="absolute right-2 top-3 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-md transition-all"
                                        title="Delete chat"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-200 group-hover:text-white">User</p>
                            <p className="text-xs text-slate-500">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
