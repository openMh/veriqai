import { X, Save, Key, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
    const [provider, setProvider] = useState(settings.provider || 'openai');
    const [apiKey, setApiKey] = useState(settings.apiKey || '');
    const [model, setModel] = useState(settings.model || 'gpt-3.5-turbo');

    useEffect(() => {
        if (isOpen) {
            setProvider(settings.provider || 'openai');
            setApiKey(settings.apiKey || '');
            setModel(settings.model || 'gpt-3.5-turbo');
        }
    }, [isOpen, settings]);

    // Reset model when provider changes
    useEffect(() => {
        if (provider === 'openai' && !model.startsWith('gpt')) {
            setModel('gpt-3.5-turbo');
        } else if (provider === 'google' && !model.startsWith('gemini')) {
            setModel('gemini-pro');
        }
    }, [provider]);

    const handleSave = () => {
        onSave({ ...settings, provider, apiKey, model });
        onClose();
    };

    if (!isOpen) return null;

    const getApiKeyLink = () => {
        if (provider === 'google') return 'https://aistudio.google.com/app/apikey';
        return 'https://platform.openai.com/api-keys';
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl transform transition-all scale-100">
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Provider Selector */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <Cpu size={16} className="text-cyan-400" />
                            AI Provider
                        </label>
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="input-field cursor-pointer accent-slate-800"
                        >
                            <option value="openai">OpenAI (GPT)</option>
                            <option value="google">Google (Gemini)</option>
                        </select>
                    </div>

                    {/* API Key Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                <Key size={16} className="text-cyan-400" />
                                {provider === 'google' ? 'Gemini API Key' : 'OpenAI API Key'}
                            </label>
                            <a
                                href={getApiKeyLink()}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                            >
                                Get API Key
                            </a>
                        </div>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder={provider === 'google' ? "AIzaSy..." : "sk-..."}
                            className="input-field"
                        />
                        <p className="text-xs text-slate-500">
                            Your key is stored locally in your browser and never sent to our servers.
                        </p>
                    </div>

                    {/* Model Selector */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <Cpu size={16} className="text-purple-400" />
                            AI Model
                        </label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="input-field cursor-pointer accent-slate-800"
                        >
                            {provider === 'openai' ? (
                                <>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Fast)</option>
                                    <option value="gpt-4">GPT-4 (Smart)</option>
                                    <option value="gpt-4-turbo">GPT-4 Turbo (New)</option>
                                </>
                            ) : (
                                <>
                                    <option value="gemini-pro">Gemini Pro (Free Tier Available)</option>
                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
