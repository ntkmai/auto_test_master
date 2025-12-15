# 🤖 Gemini AI Setup Guide

## ✅ Đã hoàn thành

Tool đã được cấu hình để sử dụng **Google Gemini AI** thay vì Grok AI.

### Model được sử dụng
- **Model**: `gemini-2.5-flash-lite`
- **API Version**: `v1beta`
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models`

### API Key đang dùng
```
[Nhập API key của bạn vào UI hoặc set environment variable]
```

## 📝 Test Results

### ✅ API Connection Test
```bash
node test-gemini-api.js
```
**Result**: ✅ Success - API hoạt động bình thường

### ✅ Available Models
Đã test và xác nhận các models sau có sẵn:
1. gemini-2.5-flash
2. gemini-2.5-pro
3. gemini-2.0-flash
4. gemini-2.0-flash-001
5. gemini-2.0-flash-lite-001
6. gemini-2.0-flash-lite
7. **gemini-2.5-flash-lite** ⭐ (đang dùng)

## 🔄 Changes Made

### 1. Code Changes
- **src/grokAI.ts**: Updated to use Gemini API format
  - Changed API URL to Gemini endpoint
  - Updated request/response format
  - Changed default model to `gemini-2.5-flash-lite`

- **server.ts**: Updated API key
  - Changed `GROK_API_KEY` → `GEMINI_API_KEY`
  - Updated console logs

### 2. Documentation Updates
- **AI-TESTING-GUIDE.md**: All references changed from Grok to Gemini
- **public/index.html**: UI text updated
- **public/test.html**: UI text and titles updated

### 3. Test Scripts
- **test-gemini-api.js**: Test script for Gemini API
- **list-gemini-models.js**: List available models

## 🚀 How to Use

### 1. Start Server
```bash
npm run server
```

### 2. Open Browser
Navigate to: http://localhost:3000

### 3. Run Analysis
1. Enter website URL
2. Click "Bắt đầu phân tích"
3. Wait for results

### 4. AI Testing
1. Click "🤖 AI Test & Execute" button
2. Select form to test
3. Click "✨ Generate Test Cases với Gemini AI"
4. Wait for Gemini to generate 7 test cases
5. Click "🧪 Execute Test" on each test case
6. View results with screenshots

## ⚡ Features

### AI-Generated Test Cases
Gemini AI automatically generates:
1. ✅ Valid Input Test
2. 📏 Boundary Test
3. ❌ Invalid Input Test
4. ⚠️ Missing Required Fields
5. 🔤 Special Characters Test
6. 🛡️ SQL Injection Test
7. 🔒 XSS Test

### Test Execution
- Auto-fills forms with AI-generated data
- Captures screenshots
- Detects validation errors
- Shows pass/fail status

## 💡 API Key Management

### Current Key Location
File: `server.ts` line 26
```typescript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-api-key-here';
```

### To Change API Key
1. Get new key from: https://aistudio.google.com/apikey
2. **Option 1:** Nhập trực tiếp vào UI (input API key trên trang test.html)
3. **Option 2:** Set environment variable `GEMINI_API_KEY`
4. **Option 3:** Update fallback value trong `server.ts` (không khuyến khích)
5. Restart server: `npm run server`

## 📊 Quota & Limits

### Free Tier Limits (Gemini 2.5 Flash Lite)
- Requests per minute: 15
- Requests per day: 1500
- Tokens per minute: 1M

### If You Hit Rate Limits
- Wait 1 minute between test generations
- Use a paid API key for higher limits
- Switch to `gemini-2.5-flash` (slower but higher quota)

## 🐛 Troubleshooting

### Error: 429 Too Many Requests
**Solution**: Wait 1 minute and try again

### Error: 404 Model Not Found
**Solution**: Check model name in `src/grokAI.ts` line 24

### Error: 403 Forbidden
**Solution**: API key invalid - get new key from Google AI Studio

### AI Not Generating Tests
1. Check server logs for errors
2. Verify API key is valid
3. Test with: `node test-gemini-api.js`
4. Check internet connection

## ✨ Next Steps

Tool is ready to use! No further configuration needed.

### Optional Improvements
1. Add retry logic for rate limits
2. Add progress indicators
3. Cache test results
4. Add test result comparison
5. Export test results to CSV/JSON

## 📞 Support

If you encounter issues:
1. Check server terminal for error logs
2. Check browser console (F12) for client errors
3. Run test scripts to verify API connection
4. Review Gemini API docs: https://ai.google.dev/docs

---

**Status**: ✅ Fully Configured & Tested
**Last Updated**: 2025-12-15
**API Status**: Working
