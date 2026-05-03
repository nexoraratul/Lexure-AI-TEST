// UI module for managing chat interface
const UI = (() => {
    let currentConversationId = null;

    const showLoading = () => {
        document.getElementById('modelLoading').style.display = 'flex';
    };

    const hideLoading = () => {
        document.getElementById('modelLoading').style.display = 'none';
    };

    const updateProgress = (percentage, message) => {
        document.getElementById('progressFill').style.width = percentage + '%';
        document.getElementById('loadingStatus').textContent = message;
    };

    const setLoadingDetails = (details) => {
        document.getElementById('loadingDetails').textContent = details;
    };

    const showBrowserWarning = () => {
        document.getElementById('browserWarning').style.display = 'flex';
    };

    const hideBrowserWarning = () => {
        document.getElementById('browserWarning').style.display = 'none';
    };

    const getCurrentConversationId = () => currentConversationId;

    const setCurrentConversationId = (id) => {
        currentConversationId = id;
    };

    const addMessage = (role, content) => {
        const chatWindow = document.getElementById('chatWindow');
        const emptyState = document.getElementById('emptyChatState');

        if (emptyState) {
            emptyState.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        messageDiv.innerHTML = `
            <div class="message-content">${escapeHtml(content)}</div>
            ${role === 'assistant' ? `
                <div class="message-actions">
                    <button class="action-btn" onclick="UI.copyMessage(event)" title="Copy">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        </svg>
                    </button>
                    <button class="action-btn" onclick="UI.likeMessage(event)" title="Like">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                        </svg>
                    </button>
                </div>
            ` : ''}
        `;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const updateLastMessage = (content) => {
        const messages = document.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.classList.contains('assistant')) {
            lastMessage.querySelector('.message-content').textContent = content;
        }
        document.getElementById('chatWindow').scrollTop = document.getElementById('chatWindow').scrollHeight;
    };

    const appendToLastMessage = (chunk) => {
        const chatWindow = document.getElementById('chatWindow');
        const messages = chatWindow.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.classList.contains('assistant')) {
            const content = lastMessage.querySelector('.message-content');
            content.textContent += chunk;
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    };

    const copyMessage = (event) => {
        const content = event.target.closest('.message').querySelector('.message-content').textContent;
        navigator.clipboard.writeText(content).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => console.error('Copy failed:', err));
    };

    const likeMessage = (event) => {
        const btn = event.target.closest('.action-btn');
        btn.style.color = 'var(--success)';
        setTimeout(() => {
            btn.style.color = '';
        }, 500);
    };

    const toggleSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('active');
    };

    const closeSidebar = () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('active');
    };

    const openMemoryModal = async () => {
        const modal = document.getElementById('memoryModal');
        const overlay = document.getElementById('modalOverlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';
        await Memory.renderMemoryList();
    };

    const closeMemoryModal = () => {
        const modal = document.getElementById('memoryModal');
        const overlay = document.getElementById('modalOverlay');
        modal.style.display = 'none';
        overlay.style.display = 'none';
    };

    const openSettingsModal = async () => {
        const modal = document.getElementById('settingsModal');
        const overlay = document.getElementById('modalOverlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';

        const theme = await DB.getSetting('theme') || 'dark';
        document.getElementById('themeSelect').value = theme;
    };

    const closeSettingsModal = () => {
        const modal = document.getElementById('settingsModal');
        const overlay = document.getElementById('modalOverlay');
        modal.style.display = 'none';
        overlay.style.display = 'none';
    };

    const updateConversationsList = async () => {
        const conversations = await DB.listConversations();
        const list = document.getElementById('conversationsList');

        if (conversations.length === 0) {
            list.innerHTML = '<p class="empty-state">No conversations yet. Start a new chat!</p>';
            return;
        }

        list.innerHTML = conversations.map(conv => `
            <div class="conversation-item ${conv.id === currentConversationId ? 'active' : ''}" onclick="UI.loadConversation('${conv.id}')">
                <span class="conversation-title">${escapeHtml(conv.title)}</span>
                <button class="delete-conversation-btn" onclick="event.stopPropagation(); UI.deleteConversation('${conv.id}')">
                    ✕
                </button>
            </div>
        `).join('');
    };

    const loadConversation = async (conversationId) => {
        currentConversationId = conversationId;
        closeSidebar();

        const messages = await DB.getMessages(conversationId);
        const chatWindow = document.getElementById('chatWindow');
        
        // Clear chat window
        chatWindow.innerHTML = '';

        if (messages.length === 0) {
            chatWindow.innerHTML = `
                <div class="empty-chat-state" id="emptyChatState">
                    <div class="empty-state-content">
                        <h2>New Conversation</h2>
                        <p>Start typing to begin chatting with Lexure AI.</p>
                    </div>
                </div>
            `;
        } else {
            messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.role}`;
                messageDiv.innerHTML = `
                    <div class="message-content">${escapeHtml(msg.content)}</div>
                    ${msg.role === 'assistant' ? `
                        <div class="message-actions">
                            <button class="action-btn" onclick="UI.copyMessage(event)" title="Copy">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                                </svg>
                            </button>
                            <button class="action-btn" onclick="UI.likeMessage(event)" title="Like">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                </svg>
                            </button>
                        </div>
                    ` : ''}
                `;
                chatWindow.appendChild(messageDiv);
            });
        }

        chatWindow.scrollTop = chatWindow.scrollHeight;
        await updateConversationsList();
    };

    const deleteConversation = async (conversationId) => {
        if (confirm('Delete this conversation?')) {
            await DB.deleteConversation(conversationId);
            if (currentConversationId === conversationId) {
                currentConversationId = null;
                const chatWindow = document.getElementById('chatWindow');
                chatWindow.innerHTML = `
                    <div class="empty-chat-state" id="emptyChatState">
                        <div class="empty-state-content">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                            </svg>
                            <h2>Welcome to Lexure AI</h2>
                            <p>Start a conversation to begin.</p>
                        </div>
                    </div>
                `;
            }
            await updateConversationsList();
        }
    };

    const startNewChat = async () => {
        const conversation = await DB.createConversation();
        currentConversationId = conversation.id;
        closeSidebar();

        const chatWindow = document.getElementById('chatWindow');
        chatWindow.innerHTML = `
            <div class="empty-chat-state" id="emptyChatState">
                <div class="empty-state-content">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                    </svg>
                    <h2>Welcome to Lexure AI</h2>
                    <p>Start a conversation to begin. Your chats are saved locally and never sent anywhere.</p>
                    <div class="suggested-prompts">
                        <button class="prompt-btn" onclick="document.getElementById('messageInput').value = 'What can you help me with?'; document.getElementById('sendBtn').click();">What can you help me with?</button>
                        <button class="prompt-btn" onclick="document.getElementById('messageInput').value = 'Tell me about yourself'; document.getElementById('sendBtn').click();">Tell me about yourself</button>
                        <button class="prompt-btn" onclick="document.getElementById('messageInput').value = 'How does local AI work?'; document.getElementById('sendBtn').click();">How does local AI work?</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('messageInput').focus();
        await updateConversationsList();
    };

    const exportCurrentChat = async () => {
        if (!currentConversationId) {
            alert('No conversation to export');
            return;
        }

        const conversation = await DB.getConversation(currentConversationId);
        const messages = await DB.getMessages(currentConversationId);

        const textContent = messages.map(msg => `[${msg.role.toUpperCase()}]\n${msg.content}\n`).join('\n');
        downloadFile(`${conversation.title}.txt`, textContent, 'text/plain');
    };

    const exportAllChats = async () => {
        const conversations = await DB.listConversations();
        const allData = {};

        for (const conv of conversations) {
            const messages = await DB.getMessages(conv.id);
            allData[conv.id] = {
                ...conv,
                messages,
            };
        }

        downloadFile('lexure-ai-backup.json', JSON.stringify(allData, null, 2), 'application/json');
    };

    const clearCurrentChat = () => {
        if (!currentConversationId) {
            alert('No conversation to clear');
            return;
        }

        if (confirm('Clear all messages in this conversation?')) {
            DB.deleteConversation(currentConversationId).then(() => {
                currentConversationId = null;
                const chatWindow = document.getElementById('chatWindow');
                chatWindow.innerHTML = `
                    <div class="empty-chat-state" id="emptyChatState">
                        <div class="empty-state-content">
                            <h2>Conversation Cleared</h2>
                            <p>Start a new chat to begin.</p>
                        </div>
                    </div>
                `;
                updateConversationsList();
            });
        }
    };

    const clearAllChats = () => {
        if (confirm('Delete ALL conversations? This cannot be undone!')) {
            DB.listConversations().then(conversations => {
                Promise.all(conversations.map(conv => DB.deleteConversation(conv.id))).then(() => {
                    currentConversationId = null;
                    const chatWindow = document.getElementById('chatWindow');
                    chatWindow.innerHTML = `
                        <div class="empty-chat-state" id="emptyChatState">
                            <div class="empty-state-content">
                                <h2>All Conversations Deleted</h2>
                                <p>Start a new chat to begin.</p>
                            </div>
                        </div>
                    `;
                    updateConversationsList();
                });
            });
        }
    };

    const setTheme = async (theme) => {
        await DB.saveSetting('theme', theme);

        if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('light-theme', !isDark);
        } else {
            document.documentElement.classList.toggle('light-theme', theme === 'light');
        }
    };

    return {
        showLoading,
        hideLoading,
        updateProgress,
        setLoadingDetails,
        showBrowserWarning,
        hideBrowserWarning,
        getCurrentConversationId,
        setCurrentConversationId,
        addMessage,
        updateLastMessage,
        appendToLastMessage,
        copyMessage,
        likeMessage,
        toggleSidebar,
        closeSidebar,
        openMemoryModal,
        closeMemoryModal,
        openSettingsModal,
        closeSettingsModal,
        updateConversationsList,
        loadConversation,
        deleteConversation,
        startNewChat,
        exportCurrentChat,
        exportAllChats,
        clearCurrentChat,
        clearAllChats,
        setTheme,
    };
})();

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility function to download file
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
