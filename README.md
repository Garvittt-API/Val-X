<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0f,20:0c0c14,40:111118,60:16161f,80:111118,100:0a0a0f&height=200&section=header&text=VALX&fontSize=80&fontColor=4a9eff&fontAlignY=35&desc=Valorant%20Match%20Tracker&descSize=18&descAlignY=55&animation=fadeIn&animationDuration=1s" width="100%"/>

<!-- Badges -->
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tauri](https://img.shields.io/badge/Tauri_v2-FFC131?style=for-the-badge&logo=tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-2021-000000?style=for-the-badge&logo=rust&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%"/>

</div>

<br/>

<div align="center">

### **The Ultimate Valorant Companion App**

*Real-time match tracking • Player analytics • In-game overlay • Beautiful UI*

[![GitHub Stars](https://img.shields.io/github/stars/Garvittt-API/Val-X?style=social&logo=github)](https://github.com/Garvittt-API/Val-X)
[![GitHub Forks](https://img.shields.io/github/forks/Garvittt-API/Val-X?style=social&logo=github)](https://github.com/Garvittt-API/Val-X)
[![GitHub Issues](https://img.shields.io/github/issues/Garvittt-API/Val-X?style=social&logo=github)](https://github.com/Garvittt-API/Val-X)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Garvittt-API/Val-X?style=social&logo=github)](https://github.com/Garvittt-API/Val-X)

</div>

<br/>

---

## **Features**

<table>
<tr>
<td width="50%">

### **Real-Time Match Data**
- Live player stats during agent select
- In-game scoreboard tracking
- Rank, RR, and win rate updates
- Party detection and stack warnings

</td>
<td width="50%">

### **Player Analytics**
- Comprehensive match history
- K/D, HS%, ACS, ADR, KAST stats
- Peak rank and progression tracking
- Smurf detection scoring

</td>
</tr>
<tr>
<td width="50%">

### **In-Game Overlay**
- Transparent overlay window
- Customizable position & opacity
- Minimal performance impact
- Always-on-top display

</td>
<td width="50%">

### **Stunning 3D UI**
- Glassmorphism design system
- 3D perspective card transforms
- Neon glow effects & animations
- Dark mode optimized

</td>
</tr>
</table>

---

## **Tech Stack**

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                               │
├─────────────────────────────────────────────────────────────┤
│  React 18  •  TypeScript  •  Vite  •  TailwindCSS  •  Zustand  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│  Tauri v2  •  Rust  •  Tokio  •  Reqwest  •  WebSocket     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    VALORANT CLIENT                           │
├─────────────────────────────────────────────────────────────┤
│  Local API  •  Lockfile Auth  •  Presence WebSocket         │
└─────────────────────────────────────────────────────────────┘
```

</div>

---

## **Screenshots**

<div align="center">

![Dashboard](https://img.shields.io/badge/Dashboard-0a0a0f?style=for-the-badge&labelColor=4a9eff)
![Live Match](https://img.shields.io/badge/Live_Match-0a0a0f?style=for-the-badge&labelColor=ff4655)
![Player Search](https://img.shields.io/badge/Player_Search-0a0a0f?style=for-the-badge&labelColor=00d4ff)
![Match History](https://img.shields.io/badge/Match_History-0a0a0f?style=for-the-badge&labelColor=00ff88)

</div>

---

## **Quick Start**

### **Prerequisites**

- [Node.js](https://nodejs.org/) v18+ 
- [Rust](https://www.rust-lang.org/) (for Tauri backend)
- [VALORANT](https://playvalorant.com/) client running

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Garvittt-API/Val-X.git
cd Val-X

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Build for Production**

```bash
# Build the app
npm run tauri build
```

---

## **Usage**

1. **Launch VALORANT** - The app automatically connects via lockfile
2. **Start a Match** - Stats appear in real-time during agent select
3. **View Analytics** - Check your profile, history, and player stats
4. **Enable Overlay** - Toggle the in-game overlay for live tracking

---

## **Architecture**

```
ValX/
├── src/                    # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── dashboard/      # Main dashboard view
│   │   ├── match/          # Live match & agent select
│   │   ├── overlay/        # In-game overlay
│   │   ├── search/         # Player search
│   │   ├── history/        # Match history
│   │   └── shared/         # Reusable components
│   ├── store/              # Zustand state management
│   └── types/              # TypeScript definitions
├── src-tauri/              # Backend (Rust)
│   └── src/
│       ├── auth.rs         # Lockfile authentication
│       ├── fetcher.rs      # API data fetching
│       ├── orchestrator.rs # Main event loop
│       ├── websocket.rs    # Presence tracking
│       └── model.rs        # Data structures
└── public/                 # Static assets
```

---

## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### **Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=Garvittt-API/Val-X&type=Date)](https://star-history.com/#Garvittt-API/Val-X&Date)

<br/>

**Made with care for the VALORANT community**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0f,20:0c0c14,40:111118,60:16161f,80:111118,100:0a0a0f&height=80&section=footer" width="100%"/>

</div>
