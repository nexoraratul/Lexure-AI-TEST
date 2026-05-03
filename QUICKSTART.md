# Quick Start Guide - Lexure AI

## What You Have

A complete, production-ready AI chatbot website that:
- Runs entirely in the browser (no backend needed)
- Uses WebLLM for local AI inference
- Stores everything locally (IndexedDB)
- Is fully responsive for mobile/tablet/desktop
- Has zero dependencies or build steps
- Works on any static hosting (cPanel, etc.)

## File Summary

```
lexure-ai/
├── index.html              → Landing page with features
├── chat.html              → ChatGPT-like chat interface
├── privacy.html           → Detailed privacy policy
├── manifest.json          → PWA configuration
├── service-worker.js      → Offline support
├── DEPLOYMENT.md          → Step-by-step deployment guide
├── README.md              → Full documentation
├── assets/
│   ├── css/style.css      → All styling (30KB, no dependencies)
│   ├── js/
│   │   ├── db.js          → IndexedDB operations
│   │   ├── llm.js         → WebLLM integration
│   │   ├── memory.js      → User memory management
│   │   ├── ui.js          → Chat UI control
│   │   └── app.js         → Main app controller
│   └── icons/logo.svg     → App logo
```

## Key Features ✨

### Core Functionality
- ✅ Text chat with streaming responses
- ✅ Multiple conversations with history
- ✅ Copy/Like buttons on messages
- ✅ Export chats as TXT or JSON
- ✅ Clear individual or all conversations
- ✅ Smart memory (user facts)

### UI/UX
- ✅ ChatGPT-like dark interface
- ✅ Left sidebar for conversations (collapses on mobile)
- ✅ Smooth animations & transitions
- ✅ Fully responsive (mobile/tablet/desktop)
- ✅ Settings panel with theme toggle
- ✅ Professional loading states

### Privacy
- ✅ No API calls to any LLM service
- ✅ No tracking or analytics
- ✅ No data sent anywhere
- ✅ Everything stored in browser's IndexedDB
- ✅ Full user control over data

### Performance
- ✅ Uses Llama-3.2-1B (1 billion parameter model)
- ✅ ~500MB model (downloaded once, cached)
- ✅ Streaming responses (shows text as it generates)
- ✅ Responsive UI (never freezes)
- ✅ Works offline after first load

## Technology Stack 🛠️

| Component | Technology |
|-----------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| AI Engine | WebLLM (via CDN) |
| Model | Llama-3.2-1B-Instruct |
| Storage | IndexedDB (browser) |
| UI Framework | None (pure CSS) |
| Backend | None (static files) |

## Browser Support 🌐

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 121+ | ✅ Full | Best performance |
| Edge 121+ | ✅ Full | Full WebGPU support |
| Firefox | ⚠️ Limited | CPU fallback |
| Safari | ⚠️ Limited | WebGPU not supported |
| Mobile Chrome | ✅ Full | Responsive design |

**Minimum Requirements:**
- WebAssembly support
- Modern JavaScript (ES2020+)
- 4GB RAM
- 1GB free storage
- Chrome/Edge recommended

## Installation (3 Ways)

### Option 1: cPanel File Manager (Easiest)
1. Login to cPanel
2. Open File Manager → public_html
3. Create folders: `assets/css`, `assets/js`, `assets/icons`
4. Upload all files maintaining structure
5. Done! Visit your domain

### Option 2: FTP Upload
1. Download FileZilla (free)
2. Connect with FTP credentials
3. Navigate to public_html
4. Upload all files
5. Done!

### Option 3: Git Clone
```bash
ssh username@domain.com
cd public_html
git clone <repo-url> .
```

See **DEPLOYMENT.md** for detailed instructions.

## How It Works 🧠

### First Time Visit
1. User visits your domain
2. Landing page loads instantly
3. User clicks "Start Chat"
4. Browser starts downloading AI model (~500MB)
5. Progress bar shows download %
6. After download, chat is ready

### Normal Chat
1. User types message
2. Hits Enter or clicks Send
3. Message saved to IndexedDB
4. WebLLM processes locally (no internet needed!)
5. Response streams back word-by-word
6. Both messages saved to conversation history

### Memory Feature
1. User clicks "Memory" button
2. Can add facts: "I'm a programmer", "I speak Spanish"
3. Facts are saved to IndexedDB
4. When generating responses, memory is injected into system prompt
5. AI remembers facts in future conversations

## Configuration 🔧

### Change System Prompt
Edit `assets/js/memory.js` function `buildSystemPrompt()`:
```javascript
let systemPrompt = `You are Lexure AI...`;
```

### Change AI Model
Edit `assets/js/llm.js` line 2:
```javascript
const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
```

### Add Custom Logo
Replace `assets/icons/logo.svg` with your logo (keep SVG format).

### Change Brand Name
Search for "Lexure AI" in HTML files and replace with your brand.

## Data Storage 💾

### What's Stored (Locally, in Browser)
- Conversations (title, creation date)
- Messages (user and AI messages)
- Memory (user facts about themselves)
- Settings (theme, model preference)
- Feedback reactions (likes on messages)

### Where It's Stored
- IndexedDB (browser's local database)
- ~50KB per conversation (typical)
- User can delete anytime
- Synced with iCloud/Google on some browsers (optional)

### User Controls
- Export conversation as TXT
- Export all conversations as JSON
- Clear individual conversation
- Delete all conversations
- Delete all memory
- Clear all settings

## Troubleshooting 🔧

### Model Won't Load
- **Chrome/Edge version 121+?** → Update browser
- **4GB RAM available?** → Close other apps
- **1GB storage free?** → Delete files
- **WebGPU supported?** → Try Edge instead

### Chat Not Saving
- **Sufficient storage space?** → Check file explorer
- **JavaScript enabled?** → Check browser settings
- **IndexedDB available?** → Check browser console

### Responses Too Slow
- **Normal for 1B model** → 10-30 seconds is expected
- **Older device?** → Can be slower on low-end phones
- **Other tabs open?** → Close to free memory

### Messages Disappeared
- **Browser cache cleared?** → Check IndexedDB persists
- **Storage limit reached?** → Export and delete old chats
- **Private browsing?** → Use normal browsing

See **README.md** for more troubleshooting.

## Performance Tips ⚡

1. **First Load Takes Time**
   - Model download: 2-5 minutes (depends on internet)
   - Subsequent loads: instant (cached)

2. **Response Time**
   - 10-30 seconds per response (normal for 1B model)
   - Depends on: message length, device power, RAM available

3. **Mobile Usage**
   - Works on all modern phones
   - May be slower on low-end devices
   - Keep browser tab active for best performance

4. **Memory Management**
   - Keep browser tab open
   - Close other tabs to free RAM
   - Export old conversations to save storage

## Future Features 🚀

### Planned (Not Implemented Yet)
- [ ] Pro Cloud Mode (larger, faster models)
- [ ] Conversation search
- [ ] Dark/Light theme UI selector
- [ ] More AI models (3B, 7B)
- [ ] Image generation
- [ ] File upload/analysis

### Not Planned (Maintains Privacy)
- [ ] Cloud backup (keeps it local)
- [ ] Tracking/analytics (defeats privacy)
- [ ] API integrations (unless optional)
- [ ] Backend servers (static only)

## Privacy Promise 🔒

Lexure AI is built for privacy:
- ✅ No data leaves your device
- ✅ No tracking whatsoever
- ✅ No ads or monetization
- ✅ No "cloud sync" by default
- ✅ You own 100% of your data
- ✅ Can delete everything anytime

See `privacy.html` for detailed policy.

## Deployment Checklist ✓

- [ ] Download all files
- [ ] Create folder structure
- [ ] Upload to public_html
- [ ] Set correct permissions (644 files, 755 folders)
- [ ] Visit domain in Chrome/Edge
- [ ] See landing page
- [ ] Click "Start Chat"
- [ ] Model starts downloading
- [ ] Chat interface loads
- [ ] Send test message
- [ ] See response stream
- [ ] Test mobile on phone
- [ ] Check on multiple browsers

## File Sizes 📦

| File | Size |
|------|------|
| index.html | 12 KB |
| chat.html | 11 KB |
| privacy.html | 8 KB |
| style.css | 30 KB |
| app.js | 7 KB |
| llm.js | 2.6 KB |
| db.js | 10 KB |
| memory.js | 2.9 KB |
| ui.js | 16 KB |
| service-worker.js | 2.6 KB |
| manifest.json | 1.2 KB |
| logo.svg | 1.6 KB |
| **Total (files)** | **~104 KB** |
| **AI Model (first load)** | **~500 MB** |

Total site: 104 KB (one-time) + 500 MB model (one-time) = ~500 MB initial.  
Subsequent visits: instant (everything cached).

## Support & Help 🤝

1. **Check Documentation**
   - README.md (full overview)
   - DEPLOYMENT.md (detailed setup)
   - privacy.html (privacy details)

2. **Check Console**
   - Press F12 (Developer Tools)
   - Look in Console tab for errors
   - Check Network tab for failed requests

3. **Common Issues**
   - Browser too old → Use Chrome 121+
   - Model won't load → Check storage/RAM
   - Messages not saving → Check IndexedDB

## Next Steps 🚀

1. **Review the code**
   - Look at HTML structure
   - Check CSS styling
   - Understand JavaScript modules

2. **Customize for your brand**
   - Change logo
   - Update colors in CSS
   - Modify system prompt

3. **Deploy to production**
   - Follow DEPLOYMENT.md
   - Test thoroughly
   - Monitor user feedback

4. **Gather feedback**
   - User experience
   - Performance issues
   - Feature requests

## License 📄

MIT License - Free to use, modify, and distribute commercially.

See LICENSE file for details.

---

**You now have a complete, production-ready AI chatbot. Enjoy! 🎉**

For detailed info:
- **Setup:** See DEPLOYMENT.md
- **Features:** See README.md
- **Privacy:** See privacy.html
- **Code:** Explore the JavaScript modules
