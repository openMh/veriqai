const STORAGE_KEYS = {
    HISTORY: 'chat_history',
    SETTINGS: 'chat_settings',
    CURRENT_CHAT: 'current_chat_id',
};

export const storage = {
    getHistory: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse history:', e);
            return [];
        }
    },

    saveHistory: (history) => {
        try {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
        } catch (e) {
            console.error('Failed to save history:', e);
        }
    },

    getSettings: () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
            // Default settings
            return stored ? JSON.parse(stored) : {
                apiKey: '',
                model: 'gpt-3.5-turbo',
                provider: 'openai'
            };
        } catch (e) {
            return { apiKey: '', model: 'gpt-3.5-turbo', provider: 'openai' };
        }
    },

    saveSettings: (settings) => {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    },
};
