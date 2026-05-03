// Memory module for managing user facts and context
const Memory = (() => {
    const getFormattedMemory = async () => {
        const memories = await DB.getMemory();
        if (memories.length === 0) return '';
        
        const memoryText = memories.map(m => `• ${m.text}`).join('\n');
        return `\nUser Facts:\n${memoryText}`;
    };

    const buildSystemPrompt = async () => {
        const memory = await getFormattedMemory();
        let systemPrompt = `You are Lexure AI, a helpful private AI assistant that runs locally in the user's browser. 
You do NOT have access to the internet or any external APIs. 
You process all conversations locally on the user's device.
Be honest, practical, and provide step-by-step explanations when needed.
Reply in Bangla/Banglish by default unless the user asks for another language.
You are completely free and open source, running on the user's hardware.`;

        if (memory) {
            systemPrompt += memory;
        }

        return systemPrompt;
    };

    const renderMemoryList = async () => {
        const memories = await DB.getMemory();
        const memoryList = document.getElementById('memoryList');

        if (memories.length === 0) {
            memoryList.innerHTML = '<p class="empty-state">No memory saved yet.</p>';
            return;
        }

        memoryList.innerHTML = memories.map(memory => `
            <div class="memory-item">
                <div class="memory-text">${escapeHtml(memory.text)}</div>
                <button class="delete-memory-btn" onclick="Memory.deleteMemoryItem('${memory.id}')">
                    ✕
                </button>
            </div>
        `).join('');
    };

    const deleteMemoryItem = async (id) => {
        await DB.deleteMemory(id);
        await renderMemoryList();
    };

    const addMemory = async () => {
        const input = document.getElementById('memoryInput');
        const text = input.value.trim();

        if (!text) {
            alert('Please enter something to remember');
            return;
        }

        try {
            await DB.saveMemory(text);
            input.value = '';
            await renderMemoryList();
        } catch (error) {
            console.error('Error saving memory:', error);
            alert('Failed to save memory');
        }
    };

    const clearAllMemory = async () => {
        if (confirm('Are you sure you want to delete all memory? This cannot be undone.')) {
            try {
                await DB.clearAllMemory();
                await renderMemoryList();
            } catch (error) {
                console.error('Error clearing memory:', error);
                alert('Failed to clear memory');
            }
        }
    };

    return {
        getFormattedMemory,
        buildSystemPrompt,
        renderMemoryList,
        deleteMemoryItem,
        addMemory,
        clearAllMemory,
    };
})();
