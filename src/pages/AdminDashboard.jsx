import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, MessageSquare, Activity } from 'lucide-react';
import { storage } from '../utils/storage';
import { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalChats: 0,
        totalMessages: 0,
        apiProvider: 'openai'
    });

    useEffect(() => {
        const history = storage.getHistory();
        const settings = storage.getSettings();
        const totalMsgs = history.reduce((acc, chat) => acc + chat.messages.length, 0);

        setStats({
            totalChats: history.length,
            totalMessages: totalMsgs,
            apiProvider: settings.provider || 'openai'
        });
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="text-cyan-400" />
                        <span className="font-bold text-lg">VeriqAI Dashboard</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400">Welcome, {user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 text-sm font-medium">Total Conversations</h3>
                            <MessageSquare className="text-cyan-400 opacity-80" size={20} />
                        </div>
                        <p className="text-3xl font-bold">{stats.totalChats}</p>
                        <p className="text-xs text-slate-500 mt-1">Stored locally</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 text-sm font-medium">Total Messages</h3>
                            <Activity className="text-purple-400 opacity-80" size={20} />
                        </div>
                        <p className="text-3xl font-bold">{stats.totalMessages}</p>
                        <p className="text-xs text-slate-500 mt-1">across all chats</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-400 text-sm font-medium">Active Users</h3>
                            <Users className="text-emerald-400 opacity-80" size={20} />
                        </div>
                        <p className="text-3xl font-bold">1</p>
                        <p className="text-xs text-slate-500 mt-1">Single Local User</p>
                    </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">System Overview</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                            <div>
                                <p className="font-medium text-slate-200">Active AI Provider</p>
                                <p className="text-sm text-slate-500 capitalize">{stats.apiProvider}</p>
                            </div>
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                                OPERATIONAL
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                            <div>
                                <p className="font-medium text-slate-200">Database Status</p>
                                <p className="text-sm text-slate-500">LocalStorage (Client-side)</p>
                            </div>
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">
                                CONNECTED
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
