# ⚡ Market Oracle - Quick Start

## 🌐 Access Your App NOW

**Frontend URL**: https://3000-ibz08thyi9dmuxfd4xcq4-c81df28e.sandbox.novita.ai

**Status**: ✅ ONLINE

---

## ⚠️ To Enable Backend Features

You need to configure MongoDB Atlas (FREE, 5 minutes):

### Quick MongoDB Setup

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster** (M0 Sandbox)
3. **Create database user**:
   - Username: `marketoracle`
   - Password: (generate strong password)
4. **Whitelist IP**: Add `0.0.0.0/0`
5. **Get connection string**: `mongodb+srv://marketoracle:PASSWORD@cluster0.xxxxx.mongodb.net/marketoracle`

### Configure Backend

Edit `/home/user/webapp/backend/.env`:
```bash
MONGODB_URI=mongodb+srv://marketoracle:YourPassword@cluster0.xxxxx.mongodb.net/marketoracle?retryWrites=true&w=majority
```

### Restart Backend
```bash
cd /home/user/webapp
pm2 restart market-oracle-backend
```

---

## 🔑 Get Gemini API Key

1. Visit: https://aistudio.google.com/apikey
2. Create API key (FREE)
3. Enter in app Settings modal

---

## 📚 Full Documentation

- **Setup Instructions**: `/home/user/webapp/SETUP_REQUIRED.md`
- **Deployment Status**: `/home/user/webapp/DEPLOYMENT_STATUS.md`
- **Troubleshooting**: `/home/user/webapp/TROUBLESHOOTING.md`
- **Full README**: `/home/user/webapp/README.md`

---

## 🚀 Quick Commands

```bash
# Check service status
pm2 list

# View logs
pm2 logs --nostream

# Restart services
pm2 restart all

# Access app
# Open: https://3000-ibz08thyi9dmuxfd4xcq4-c81df28e.sandbox.novita.ai
```

---

**Current Status**: Frontend ✅ | Backend ⏳ (Needs MongoDB)
