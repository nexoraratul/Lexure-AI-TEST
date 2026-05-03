// Database module for IndexedDB operations
const DB = (() => {
    let db;
    const DB_NAME = 'LexureAI';
    const DB_VERSION = 1;

    const init = async () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };

            request.onupgradeneeded = (e) => {
                const database = e.target.result;

                // Conversations store
                if (!database.objectStoreNames.contains('conversations')) {
                    database.createObjectStore('conversations', { keyPath: 'id' });
                }

                // Messages store
                if (!database.objectStoreNames.contains('messages')) {
                    const messagesStore = database.createObjectStore('messages', { keyPath: 'id' });
                    messagesStore.createIndex('conversationId', 'conversationId', { unique: false });
                }

                // Memory store
                if (!database.objectStoreNames.contains('memory')) {
                    database.createObjectStore('memory', { keyPath: 'id' });
                }

                // Settings store
                if (!database.objectStoreNames.contains('settings')) {
                    database.createObjectStore('settings', { keyPath: 'key' });
                }

                // Feedback store
                if (!database.objectStoreNames.contains('feedback')) {
                    database.createObjectStore('feedback', { keyPath: 'id' });
                }
            };
        });
    };

    const createConversation = async (title = 'New Chat') => {
        const conversation = {
            id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['conversations'], 'readwrite');
            const store = transaction.objectStore('conversations');
            const request = store.add(conversation);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(conversation);
        });
    };

    const saveMessage = async (conversationId, role, content) => {
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId,
            role,
            content,
            timestamp: new Date().toISOString(),
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['messages'], 'readwrite');
            const store = transaction.objectStore('messages');
            const request = store.add(message);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(message);
        });
    };

    const getMessages = async (conversationId) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['messages'], 'readonly');
            const store = transaction.objectStore('messages');
            const index = store.index('conversationId');
            const request = index.getAll(conversationId);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
        });
    };

    const listConversations = async () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['conversations'], 'readonly');
            const store = transaction.objectStore('conversations');
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
        });
    };

    const getConversation = async (id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['conversations'], 'readonly');
            const store = transaction.objectStore('conversations');
            const request = store.get(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    };

    const updateConversation = async (id, updates) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['conversations'], 'readwrite');
            const store = transaction.objectStore('conversations');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const conversation = getRequest.result;
                if (conversation) {
                    Object.assign(conversation, updates, { updatedAt: new Date().toISOString() });
                    const updateRequest = store.put(conversation);
                    updateRequest.onerror = () => reject(updateRequest.error);
                    updateRequest.onsuccess = () => resolve(conversation);
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    };

    const deleteConversation = async (id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['conversations', 'messages'], 'readwrite');
            
            // Delete conversation
            const convStore = transaction.objectStore('conversations');
            const convRequest = convStore.delete(id);

            // Delete associated messages
            const msgStore = transaction.objectStore('messages');
            const msgIndex = msgStore.index('conversationId');
            const msgRequest = msgIndex.getAll(id);

            msgRequest.onsuccess = () => {
                msgRequest.result.forEach(msg => msgStore.delete(msg.id));
            };

            transaction.onerror = () => reject(transaction.error);
            transaction.oncomplete = () => resolve();
        });
    };

    const saveMemory = async (text) => {
        const memory = {
            id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            text,
            createdAt: new Date().toISOString(),
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['memory'], 'readwrite');
            const store = transaction.objectStore('memory');
            const request = store.add(memory);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(memory);
        });
    };

    const getMemory = async () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['memory'], 'readonly');
            const store = transaction.objectStore('memory');
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        });
    };

    const deleteMemory = async (id) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['memory'], 'readwrite');
            const store = transaction.objectStore('memory');
            const request = store.delete(id);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    };

    const clearAllMemory = async () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['memory'], 'readwrite');
            const store = transaction.objectStore('memory');
            const request = store.clear();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    };

    const saveSetting = async (key, value) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            const request = store.put({ key, value });

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve({ key, value });
        });
    };

    const getSetting = async (key) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result?.value);
        });
    };

    const getAllSettings = async () => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.getAll();

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const result = {};
                request.result.forEach(item => {
                    result[item.key] = item.value;
                });
                resolve(result);
            };
        });
    };

    return {
        init,
        createConversation,
        saveMessage,
        getMessages,
        listConversations,
        getConversation,
        updateConversation,
        deleteConversation,
        saveMemory,
        getMemory,
        deleteMemory,
        clearAllMemory,
        saveSetting,
        getSetting,
        getAllSettings,
    };
})();
