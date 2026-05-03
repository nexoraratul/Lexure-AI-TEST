// Main application controller
const App = (() => {
    let isInitialized = false;
    let isSending = false;

    const init = async () => {
        if (isInitialized) return;

        try {
            // Initialize database
            await DB.init();
            console.log('Database initialized');

            // Check theme setting
            const theme = await DB.getSetting('theme') || 'dark';
            if (theme === 'light') {
                document.documentElement.classList.add('light-theme');
            }

            // Setup event listeners
            setupEventListeners();

            // Load conversations
            await UI.updateConversationsList();

            // Attempt to load model
            await loadModel();

            isInitialized = true;
        } catch (error) {
            console.error('Initialization failed:', error);
            UI.showBrowserWarning();
        }
    };

    const loadModel = async () => {
        UI.showLoading();

        const result = await LLM.loadModel((progress, message) => {
            UI.updateProgress(progress, message);
            UI.setLoadingDetails(`${progress}% loaded - ${message}`);
        });

        if (result.error) {
            console.error('Model loading failed:', result.error);
            UI.hideLoading();
            UI.showBrowserWarning();
            return;
        }

        UI.hideLoading();
        console.log('Model loaded successfully');
    };

    const setupEventListeners = () => {
        // Chat input
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');

        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        sendBtn.addEventListener('click', sendMessage);

        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
        });

        // Sidebar
        document.getElementById('menuToggle').addEventListener('click', UI.toggleSidebar);
        document.getElementById('newChatBtn').addEventListener('click', UI.startNewChat);
        document.getElementById('memoryBtn').addEventListener('click', UI.openMemoryModal);

        // Settings
        document.getElementById('settingsToggle').addEventListener('click', UI.openSettingsModal);
        document.getElementById('closeSettingsBtn').addEventListener('click', UI.closeSettingsModal);
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            UI.setTheme(e.target.value);
        });
        document.getElementById('exportChatBtn').addEventListener('click', UI.exportCurrentChat);
        document.getElementById('clearChatBtn').addEventListener('click', UI.clearCurrentChat);
        document.getElementById('exportAllBtn').addEventListener('click', UI.exportAllChats);
        document.getElementById('clearAllBtn').addEventListener('click', UI.clearAllChats);

        // Memory
        document.getElementById('closeMemoryBtn').addEventListener('click', UI.closeMemoryModal);
        document.getElementById('addMemoryBtn').addEventListener('click', Memory.addMemory);
        document.getElementById('clearMemoryBtn').addEventListener('click', Memory.clearAllMemory);

        // Modal overlay click
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modalOverlay')) {
                const memoryModal = document.getElementById('memoryModal');
                const settingsModal = document.getElementById('settingsModal');
                if (memoryModal.style.display !== 'none') {
                    UI.closeMemoryModal();
                }
                if (settingsModal.style.display !== 'none') {
                    UI.closeSettingsModal();
                }
            }
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && window.innerWidth <= 768) {
                UI.closeSidebar();
            }
        });
    };

    const sendMessage = async () => {
        if (isSending) return;

        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        // Create conversation if needed
        if (!UI.getCurrentConversationId()) {
            await UI.startNewChat();
        }

        const conversationId = UI.getCurrentConversationId();
        if (!conversationId) {
            alert('Failed to create conversation');
            return;
        }

        isSending = true;
        input.value = '';
        input.style.height = 'auto';
        document.getElementById('sendBtn').disabled = true;

        try {
            // Save user message
            await DB.saveMessage(conversationId, 'user', message);
            UI.addMessage('user', message);

            // Update conversation title if it's the first message
            const messages = await DB.getMessages(conversationId);
            if (messages.length === 1) {
                const title = message.substring(0, 50);
                await DB.updateConversation(conversationId, { title });
                await UI.updateConversationsList();
            }

            // Get system prompt with memory
            const systemPrompt = await Memory.buildSystemPrompt();

            // Prepare messages for AI
            const previousMessages = messages.slice(0, -1).map(msg => ({
                role: msg.role,
                content: msg.content,
            }));
            previousMessages.push({
                role: 'user',
                content: message,
            });

            // Generate response
            let fullResponse = '';
            UI.addMessage('assistant', '');

            const result = await LLM.generateReply(previousMessages, systemPrompt, (chunk) => {
                fullResponse += chunk;
                UI.appendToLastMessage(chunk);
            });

            if (result.error) {
                UI.appendToLastMessage(`\n\n❌ Error: ${result.error}`);
                fullResponse += `\n\n❌ Error: ${result.error}`;
            }

            // Save assistant message
            if (fullResponse) {
                await DB.saveMessage(conversationId, 'assistant', fullResponse);
            }

            // Update conversation
            await DB.updateConversation(conversationId, {});

        } catch (error) {
            console.error('Send message error:', error);
            UI.addMessage('assistant', `Error: ${error.message}`);
        } finally {
            isSending = false;
            document.getElementById('sendBtn').disabled = false;
            input.focus();
        }
    };

    return {
        init,
        sendMessage,
    };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}
