export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const generateTitle = (message) => {
    if (!message) return 'New Chat';
    return message.length > 30 ? message.substring(0, 30) + '...' : message;
};
