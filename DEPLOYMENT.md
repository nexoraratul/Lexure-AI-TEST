# DEPLOYMENT GUIDE - Lexure AI

Complete step-by-step guide to deploy Lexure AI to cPanel hosting.

## Quick Start (5 minutes)

### Prerequisites
- cPanel hosting account
- Domain name pointing to your hosting
- FTP access or cPanel File Manager access

### Steps

1. **Download all files** from the repository
2. **Connect to File Manager** via cPanel or FTP
3. **Upload to public_html** - maintain folder structure
4. **Visit your domain** - that's it!

---

## Detailed Deployment Methods

### Method 1: cPanel File Manager (Easiest)

1. **Login to cPanel**
   - Visit `cp.yourdomain.com` or provided cPanel URL
   - Enter username and password

2. **Open File Manager**
   - Left sidebar → Files → File Manager
   - Click "public_html"

3. **Create folders** (if needed)
   ```
   assets/
   ├── css/
   ├── js/
   └── icons/
   ```
   - Right-click → Create Folder

4. **Upload HTML files**
   - index.html
   - chat.html
   - privacy.html
   - manifest.json
   - service-worker.js

5. **Upload CSS**
   - Go into `assets/css/`
   - Upload `style.css`

6. **Upload JavaScript**
   - Go into `assets/js/`
   - Upload all 5 JS files:
     - app.js
     - db.js
     - llm.js
     - memory.js
     - ui.js

7. **Upload Icon**
   - Go into `assets/icons/`
   - Upload `logo.svg`

8. **Upload README**
   - Upload `README.md` to root

9. **Test**
   - Visit `https://yourdomain.com`
   - Should see landing page
   - Click "Start Chat" to test

### Method 2: FTP Upload

1. **Get FTP Credentials**
   - From cPanel → FTP Accounts
   - Or use default hosting credentials

2. **Download FTP Client**
   - FileZilla (free, recommended)
   - Cyberduck
   - WinSCP

3. **Connect**
   - Host: `yourdomain.com` or FTP address
   - Username: FTP username
   - Password: FTP password
   - Port: 21

4. **Navigate to public_html**
   - Double-click public_html folder

5. **Create Folder Structure**
   - assets/
   - assets/css/
   - assets/js/
   - assets/icons/

6. **Upload Files**
   - Drag all files matching structure
   - Or use "Queue" feature

7. **Verify Upload**
   - All files should appear in FTP
   - Check file count matches source

8. **Test**
   - Visit `https://yourdomain.com`

### Method 3: Git Clone (For Developers)

1. **SSH into Server**
   ```bash
   ssh username@yourdomain.com
   cd public_html
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/lexure-ai.git .
   ```

3. **Verify Files**
   ```bash
   ls -la
   ```

4. **Done!**
   - Visit `https://yourdomain.com`

### Method 4: cPanel Git Integration

1. **cPanel Dashboard**
   - Search for "Git" in cPanel
   - Click "Git Version Control"

2. **Create Repository**
   - Click "Create" or "New Repository"
   - Repository path: `/public_html`
   - Clone URL: `https://github.com/yourusername/lexure-ai.git`

3. **Clone Repository**
   - Select repository
   - Click "Deploy or Pull"

4. **Done!**

---

## Post-Installation

### 1. Check File Permissions

cPanel usually sets correct permissions automatically, but verify:

**Via cPanel File Manager:**
- Right-click files → Permissions (644)
- Right-click folders → Permissions (755)

**Via SSH:**
```bash
cd public_html
chmod 755 assets assets/css assets/js assets/icons
chmod 644 *.html *.json *.js *.md
chmod 644 assets/css/*.css
chmod 644 assets/js/*.js
chmod 644 assets/icons/*.svg
```

### 2. Enable HTTPS

cPanel usually includes free SSL via AutoSSL:
- Check that SSL is enabled
- All traffic should redirect to HTTPS
- Browsers should show padlock icon

### 3. Verify Everything Works

Visit `https://yourdomain.com` and:
- ✅ Landing page loads
- ✅ "Start Chat" button works
- ✅ Chat interface appears
- ✅ Model starts downloading
- ✅ Can type messages

### 4. Test on Mobile

Visit from phone to verify:
- ✅ Responsive layout
- ✅ Sidebar collapses
- ✅ Touch input works

---

## Troubleshooting Deployment

### 404 Errors

**Problem:** Files not found

**Solutions:**
- Check all files uploaded to correct locations
- Verify folder structure matches source
- Check file names (case-sensitive)
- Clear browser cache (Ctrl+F5)

### Pages Won't Load

**Problem:** Blank page or error

**Solutions:**
- Check browser console (F12) for errors
- Verify JavaScript files present
- Check CSS file path is correct
- Ensure `manifest.json` exists
- Look for 404s in Network tab

### Chat Interface Issues

**Problem:** Chat page shows errors

**Solutions:**
- Open Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests
- Verify all JS files loaded
- Check IndexedDB support in browser

### Model Won't Download

**Problem:** Loading stuck or error

**Solutions:**
- Check browser supports WebGPU/WebAssembly
- Try Chrome/Edge instead of Firefox
- Check available storage (need ~1GB)
- Check available RAM (need ~4GB)
- Try clearing browser cache
- Check internet connection speed

### Chat Messages Not Saving

**Problem:** Messages disappear on refresh

**Solutions:**
- Check browser allows IndexedDB
- Verify sufficient storage space
- Check browser storage settings
- Try different browser
- Check browser privacy mode isn't enabled

---

## Configuration After Deployment

### Change AI Model

Edit `assets/js/llm.js` line 2:
```javascript
const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
```

Available models (future updates):
- `Llama-3.2-1B-Instruct-q4f16_1-MLC` (default)
- Future: `Llama-3.2-3B` / `Llama-3.2-7B`

### Customize System Prompt

Edit `assets/js/memory.js` in `buildSystemPrompt()`:
```javascript
let systemPrompt = `You are Lexure AI...`;
```

Change text to match your brand/requirements.

### Add Custom Logo

Replace `assets/icons/logo.svg` with your logo.

---

## Performance Optimization

### 1. Enable Caching Headers

**Via cPanel:**
- Go to "Optimize Website" 
- Or create `.htaccess` in public_html:

```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
</IfModule>
```

### 2. Enable Gzip Compression

cPanel usually enables this automatically. Verify:
- Check "Optimize Website" in cPanel
- Look for "Gzip Compression" enabled

### 3. Monitor Usage

Track in cPanel:
- Resource usage
- Bandwidth (model download)
- Storage usage

---

## Maintenance

### Regular Tasks

**Monthly:**
- Check for JavaScript errors (Console)
- Monitor storage usage
- Test chat functionality

**Quarterly:**
- Check for updates to WebLLM
- Review error logs
- Test on new browsers

### Backup

**cPanel Backup:**
- cPanel → Backup Wizard
- Download public_html backup

**Via SSH:**
```bash
cd public_html
zip -r lexure-ai-backup.zip .
```

---

## Advanced Configuration

### Custom Domain/Subdomain

1. **Add Domain in cPanel**
   - cPanel → Addon Domains
   - Point to public_html or subfolder

2. **Update Links (optional)**
   - Links in HTML use relative paths (works everywhere)
   - No changes needed

### HTTPS Certificate

**AutoSSL (recommended):**
- cPanel usually enables automatically
- Auto-renews every 90 days

**Manual:**
- cPanel → AutoSSL
- Select domain
- Click "Check"
- Certificate installs automatically

### Email Configuration

Not needed for Lexure AI (no backend).

If you want to add contact form later:
- Will require backend server
- Breaks privacy-first design
- Not recommended

---

## Scaling

Lexure AI is completely static and scales infinitely:
- No database
- No backend processing
- No server costs (CPU/memory)
- Works with any hosting provider

**What scales:**
- ✅ Unlimited concurrent users
- ✅ Unlimited storage (IndexedDB per browser)
- ✅ Unlimited bandwidth

**What doesn't scale (not applicable):**
- ✗ CPU (each browser uses own)
- ✗ Database (stored locally)
- ✗ API calls (none made)

---

## Security

### Built-in Security

✅ No backend = no API vulnerabilities  
✅ No database = no SQL injection  
✅ IndexedDB = browser-sandboxed  
✅ HTTPS = encrypted in transit  
✅ CSP headers = XSS protection  

### Recommended Headers

Add to `.htaccess`:
```apache
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## Migration

### Moving to Different Hosting

1. Download all files from current host
2. Upload to new host following this guide
3. Update domain DNS to new host
4. Done! All data stays on user devices

### Moving to New Domain

1. Same files work on any domain
2. Just upload to new public_html
3. No database/configuration changes needed

---

## Getting Help

### Troubleshooting Resources

1. **Check Browser Console** (F12)
   - Most errors show there
   - Look for red error messages

2. **Check Network Tab** (F12)
   - See which files failed to load
   - Check response codes

3. **Check Privacy.html**
   - FAQs and common issues
   - Data privacy info

4. **README.md**
   - Features overview
   - Tech stack details

### Common Issues & Fixes

See "Troubleshooting Deployment" section above for:
- 404 Errors
- Pages won't load
- Chat interface issues
- Model won't download
- Chat messages not saving

---

## Summary

1. **Upload** all files to public_html
2. **Maintain** folder structure
3. **Test** on your domain
4. **Done!** Site is live

No backend, no build step, no complex setup. Just pure static files running in browsers.

---

**Questions?** Check privacy.html or README.md for more info.

**Remember:** All user data stays private and local. That's our promise. 🔐
