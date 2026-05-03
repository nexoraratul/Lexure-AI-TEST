# Lexure AI - Private Browser-Based AI Chatbot

A production-ready, free local AI chatbot that runs entirely in your browser using WebLLM. No API keys, no server costs, no tracking. Your data stays on your device.

## Features

✅ **Completely Private** - All AI processing happens locally in your browser  
✅ **Works Offline** - After first load, chat without internet  
✅ **100% Free** - No subscriptions, no API costs  
✅ **Mobile Friendly** - Responsive design for all devices  
✅ **Smart Memory** - Save facts the AI remembers  
✅ **Export Conversations** - Download chats as TXT or JSON  
✅ **Open Source** - Uses Llama 3.2 model via WebLLM  
✅ **No Build Required** - Vanilla HTML, CSS, JavaScript  
✅ **PWA Support** - Install as app on mobile  

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Engine**: WebLLM (MLCChat) with Llama-3.2-1B-Instruct
- **Storage**: IndexedDB (local browser storage)
- **Deployment**: Static files only (no backend)

## File Structure

```
public_html/
├── index.html              # Landing page
├── chat.html              # Chat interface
├── privacy.html           # Privacy policy
├── manifest.json          # PWA manifest
├── service-worker.js      # Service worker for offline
├── assets/
│   ├── css/
│   │   └── style.css      # All styling
│   ├── js/
│   │   ├── app.js         # Main controller
│   │   ├── llm.js         # WebLLM integration
│   │   ├── db.js          # IndexedDB operations
│   │   ├── memory.js      # Memory management
│   │   └── ui.js          # UI control
│   └── icons/
│       └── logo.svg       # App logo
└── README.md              # This file
```

## Installation & Deployment

### Option 1: Direct Upload to cPanel

1. **Download/Clone Repository**
   ```bash
   git clone https://github.com/yourusername/lexure-ai.git
   cd lexure-ai
   ```

2. **Connect to cPanel File Manager**
   - Open cPanel File Manager
   - Navigate to `public_html` directory
   - Upload all files maintaining directory structure

3. **Set Permissions**
   - Ensure files are readable (644 for files, 755 for directories)
   - This is usually automatic on cPanel

4. **Access Your Site**
   - Go to `https://yourdomain.com` or `https://yourdomain.com/index.html`
   - Click "Start Chat" to begin

### Option 2: Using FTP

1. Connect via FTP (use cPanel's FTP account)
2. Upload all files to `public_html` directory
3. Maintain exact directory structure
4. No additional setup needed

### Option 3: cPanel Git Integration

1. In cPanel, go to "Git Version Control"
2. Clone repository to public_html
3. Done!

## How It Works

### First Time Use
1. User visits the site
2. Browser downloads the AI model (~500MB, one-time)
3. Model is stored in browser cache
4. App becomes fully functional

### Normal Usage
1. User types a message
2. Message sent to local WebLLM engine
3. AI processes locally (no internet needed)
4. Response generated and displayed
5. Both user and AI messages saved to IndexedDB
6. Chat history persists across sessions

### Privacy Guarantee
- **No data leaves device** - All processing is local
- **No tracking** - No analytics, no cookies
- **No API calls** - Except for model download (one-time)
- **Full control** - Users can export/delete all data anytime

## Browser Requirements

### Recommended
- Chrome 121+
- Edge 121+
- Modern Chromium-based browsers

### Partial Support
- Firefox (with limitations, may use CPU fallback)

### Requirements
- WebAssembly support
- Modern browser (ES2020+)
- ~1GB free storage (first-time model download)
- Minimum 4GB RAM recommended

## Configuration

### Change AI Model
Edit `assets/js/llm.js`:
```javascript
const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
```

### Available Models
- `Llama-3.2-1B-Instruct-q4f16_1-MLC` - Default (1B, fast, ~500MB)
- Future: Larger models via Pro Cloud Mode

### System Prompt
Edit `assets/js/memory.js` in `buildSystemPrompt()` function to customize AI behavior.

## Data Management

### Stored Locally (IndexedDB)
- Chat conversations
- Messages (user and AI)
- User memory/facts
- Settings and preferences
- Feedback

### User Controls
- **Export Chat** - Download current conversation as TXT
- **Export All** - Download all chats as JSON
- **Clear Chat** - Delete current conversation
- **Delete All** - Delete all conversations
- **Memory Management** - Add, view, delete facts

### No Cloud Sync (Currently)
All data stays on device. Future "Pro Cloud Mode" will be optional.

## Performance Tips

1. **First Load**: Model download takes 2-5 minutes (depends on internet)
2. **Response Time**: 10-30 seconds per response (depends on message length and device)
3. **Mobile**: Works on all modern phones but response time may be slower
4. **Memory**: Keep browser tab open; closing it may stop response generation

## Troubleshooting

### Model Fails to Load
- Check: Chrome/Edge version 121+
- Try: Clear browser cache
- Enable: WebGPU in browser flags if needed
- Fallback: App will attempt CPU inference

### Chat Not Saving
- Check: Sufficient storage space
- Try: Clear storage in Settings
- Verify: JavaScript is enabled

### Slow Responses
- Normal for 1B model (10-30s per response)
- Close other tabs to free memory
- Try on desktop for faster responses

### Missing Messages After Refresh
- Messages should persist via IndexedDB
- If lost: Check browser storage settings
- May need to allow persistent storage permission

## Future Roadmap

### Coming Soon
- [ ] Pro Cloud Mode (larger models, faster)
- [ ] Multiple language support UI
- [ ] Dark/Light theme selector
- [ ] Conversation search
- [ ] Custom system prompts
- [ ] Larger model options (3B, 7B)

### Not Planned
- Backend servers (defeats privacy purpose)
- API integrations (unless user-optional)
- Trackers or analytics
- Paid tiers (local mode always free)

## Contributing

Contributions welcome! Areas to improve:
- UX/UI refinements
- Performance optimizations
- Documentation
- Translation
- Testing on different devices

## License

MIT License - Free to use, modify, and distribute.

## Support

- Issues: GitHub Issues
- Docs: Check privacy.html for detailed information
- Questions: See FAQ on landing page

## Privacy Statement

**This is critical**: Lexure AI is designed for privacy. Your conversations:
- Never leave your device
- Are not sent to any server
- Are not used for training
- Are not sold or shared
- Can be deleted anytime

See `privacy.html` for detailed privacy policy.

## System Requirements

- **Browser**: Chrome 121+, Edge 121+
- **RAM**: 4GB minimum (8GB+ recommended)
- **Storage**: 1GB free (for model download)
- **Internet**: Required for first load only

## Credits

- **WebLLM**: MLChat WebAssembly implementation
- **Model**: Meta Llama 3.2 (Open source)
- **Inspiration**: ChatGPT, Claude interfaces

## Changelog

### v1.0.0 (Initial Release)
- Landing page with features
- Chat interface with sidebar
- WebLLM integration
- IndexedDB storage
- Memory management
- Export/Import
- PWA support
- Privacy-first design

---

**Remember**: Lexure AI is private by design. Your trust is our priority. 🔐
