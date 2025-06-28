# Gemini API Setup Guide

## Quick Fix Steps:

### 1. Enable Gemini API in Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Library"
4. **Search for these terms one by one:**
   - "Gemini API"
   - "Generative Language API" 
   - "Vertex AI"
   - "AI Platform"
5. **If you can't find any of these, try:**
   - Go to "APIs & Services" → "Enabled APIs"
   - Click "+ ENABLE APIS AND SERVICES" at the top
   - Search for "Gemini" or "Generative"

### 2. Alternative: Use Google AI Studio
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key" 
3. **This automatically enables the API for you**
4. Copy the new key and replace it in `src/config/api.js`

### 3. Check API Key Restrictions
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key
3. Click on it to edit
4. Check "Application restrictions" - should be "None" or include localhost
5. Check "API restrictions" - should include "Generative Language API"

### 4. Test Your API Key
1. Open `test-gemini.html` in your browser
2. Click "Test Gemini API" button
3. Check console for error messages

### 5. Common Error Messages:
- **403 Forbidden**: API not enabled or key restricted
- **400 Bad Request**: Invalid request format
- **401 Unauthorized**: Invalid API key
- **CORS Error**: Browser security blocking request

### 6. Quick Alternative Solution
If API setup is taking too long, I can implement a **smart fallback** that:
- Uses enhanced local AI responses
- Simulates real AI behavior
- Works immediately without any API setup
- Still provides intelligent, contextual responses

## Current Status:
- ✅ API Key: AIzaSyCgFIsTG8D3b1DVj-mMh8D2y7QzagYF0VU
- ✅ Code Integration: Complete
- ❌ API Connection: Failing (needs troubleshooting)

## Next Steps:
1. **Try Google AI Studio first** (easiest option)
2. If that doesn't work, search for the API in Google Cloud Console
3. If still having issues, I'll implement the smart fallback solution

**Which option do you prefer?**
- A) Try Google AI Studio (2 minutes)
- B) Keep searching Google Cloud Console
- C) Implement smart fallback solution (5 minutes) 