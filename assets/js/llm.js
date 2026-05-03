// LLM module using WebLLM for local AI inference
const LLM = (() => {
    let engine = null;
    let modelLoaded = false;
    const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

    const loadModel = async (onProgress) => {
        try {
            // Check WebGPU and WebAssembly support
            if (!('gpu' in navigator) && !('indexedDB' in window)) {
                return { error: 'WebGPU or WebAssembly not supported' };
            }

            const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');

            if (onProgress) {
                onProgress(0, 'Initializing model...');
            }

            engine = await CreateMLCEngine(MODEL_ID, {
                initProgressCallback: (info) => {
                    const progress = Math.round((info.loadedBytes / info.totalBytes) * 100);
                    if (onProgress) {
                        onProgress(progress, info.text || 'Loading...');
                    }
                },
            });

            modelLoaded = true;
            return { success: true };
        } catch (error) {
            console.error('Failed to load model:', error);
            return { error: error.message };
        }
    };

    const generateReply = async (messages, systemPrompt, onChunk) => {
        if (!engine || !modelLoaded) {
            return { error: 'Model not loaded' };
        }

        try {
            const fullMessages = [
                { role: 'system', content: systemPrompt },
                ...messages,
            ];

            let fullResponse = '';

            const stream = await engine.chat.completions.create({
                messages: fullMessages,
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 1024,
                stream: true,
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    fullResponse += content;
                    if (onChunk) {
                        onChunk(content);
                    }
                }
            }

            return { success: true, content: fullResponse };
        } catch (error) {
            console.error('Generation error:', error);
            return { error: error.message };
        }
    };

    const isModelLoaded = () => modelLoaded;

    const getModelInfo = () => ({
        modelId: MODEL_ID,
        loaded: modelLoaded,
    });

    return {
        loadModel,
        generateReply,
        isModelLoaded,
        getModelInfo,
    };
})();
