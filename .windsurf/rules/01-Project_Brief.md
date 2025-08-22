```markdown
# HackMarine – Project Brief (v7.0 – Complete Scope)

## 1. Project Overview  
HackMarine is a **web-only India-first platform** that **co-creates, funds, monitors and showcases** environmental action.  
It delivers **exactly the 11 requested features** and nothing less.

## 2. Target Users  
- **Government** – policy & enforcement  
- **NGOs & Private Sector** – funding, research, CSR  
- **Citizen Scientists & Students** – data & outreach  
- **Administrators** – content & approval management  

## 3. Feature Matrix (11 × 1 = 11)

| Feature | Status | File Stub | Live Key Needed |
|---|---|---|---|
| **Data visualization dashboard** – forest, coral, ozone, sea-level via heat-maps & graphs | **MVP** | `/src/pages/Dashboard.jsx` | Google Maps key |
| **Fund & collaboration dashboard** – NGO, Gov, Private project lifecycle | **MVP** | `/src/pages/FundDashboard.jsx` | — |
| **AI integration** – future prediction (coral bleaching, deforestation) | **Scaffold** | `/src/hooks/usePrediction.js` | AI endpoint key |
| **3D modeling** – WebGL climate animations | **Scaffold** | `/src/pages/Climate3D.jsx` | — |
| **Hardware** – live data from LPG sensor, seashore rover, plastic counter | **MVP** | `/api/sensors/live.js` | Blynk token |
| **Government & learning links** – curated portals & resources | **Scaffold** | `/src/data/links.json` | — |
| **Voice agent** – quick support & knowledge | **Scaffold** | `/src/components/VoiceAgent.jsx` | Web Speech API |
| **Community feature** – global chat & posts (real-time) | **MVP** | `/src/pages/Community.jsx` | WebSocket / Supabase |
| **Landing-page live stats** – user counts, uploads, SDG progress | **MVP** | `/src/components/LiveStats.jsx` | — |
| **Real-time sensor data** – live feed via Blynk server | **MVP** | `/api/sensors/live.js` | Blynk token |
| **Email automation** – instant alerts to nearby NGOs & communities | **MVP** | `/api/alerts/send.js` | Email service key |

## 4. MVP vs Scaffold Legend
- **MVP** → fully functional, no keys → mock data  
- **Scaffold** → UI shell + dummy data → activates on key entry  

## 5. User Journey  
1. **Register** → role-based access  
2. **Fund / collaborate** via dashboard  
3. **Upload data** → **real-time dashboard & live stats** update  
4. **Chat & post** in global community  
5. **Receive email alerts** for coral / forest-fire / ozone incidents  
6. **Earn badges** via gamified challenges  

## 6. Success Metrics  
- **100 uploads / 48 h**  
- **5 approved NGOs**  
- **<2 s load**  
- **Zero 404s**  
- **1 000 chat messages / 48 h**  
- **Email alerts <5 min after sensor trigger**
```