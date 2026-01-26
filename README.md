# 🛠️ Personal Automation Suite

This repository acts as the central hub (Brain) for all my custom automation tools. It is designed to save time, reduce context switching, and manage my development workflow.

## 📂 Structure

| Tool Name | Folder | Description |
| :--- | :--- | :--- |
| **Web Waker** | `/web-waker` | Pings my deployed apps on Render/Vercel to wake them up. |
| **Dev Launcher** | `/dev-launcher` | CLI tool to instantly switch projects, opening Editor, Tabs, and Servers. |
| **Arkon** | `/Arkon` | Remote Administration Tool (RAT) with Cloud Server and Standalone Client. |

---

## 🚀 Projects & Tools

### 1. Web Waker
**Location:** `c:\Users\himan\Desktop\Bats\web-waker`
**Shortcut:** `Desktop\RunPingTool.bat`

A simple Node.js script that fetches a list of URLs to ensure they are active (preventing cold starts on free tier hosting).
- **Configuration**: Edit `web-waker/sites.json` to add new URLs.
- **Usage**: Double-click the desktop shortcut. It runs in parallel for speed.

### 2. Dev Launcher (Context Switcher)
**Location:** `c:\Users\himan\Desktop\Bats\dev-launcher`
**Shortcut:** `Desktop\SwitchProject.bat`

An interactive CLI that sets up my environment for specific projects.
- **Configuration**: Edit `dev-launcher/projects.json`.
- **Features**:
  - Opens VS Code (or specified editor) in the project folder.
  - Opens relevant Chrome tabs (Localhost, Production, Docs).
  - Starts terminal commands (like `npm run dev`) in a new window.

#### Managed Projects:
The launcher current supports these local projects:
1.  **Income Tracker** (`Desktop/Main Tracker/income-tracker`)
2.  **P2P Chat** (`Desktop/p2p-chat`)
3.  **StockOps** (`Desktop/stockops`) - Starts Streamlit.
4.  **DocSpace** (`Desktop/DocSpace`) - Starts Node server.
5.  **BlackBox** (`Desktop/BlackBox`) - Starts Python keylogger service.
6.  **SnapDoc** (`Desktop/SnapDoc`) - Starts Python app.
7.  **Chattr** (`Desktop/Chattr`) - Starts backend server.
8.  **Ping Tool** (`Desktop/Bats/web-waker`) - Self-reference.

### 3. Arkon (Remote Control)
**Location:** `c:\Users\himan\Desktop\Bats\Arkon`
**Shortcut:** `Desktop\Bats\Arkon.bat`

A remote administration tool that gives you control over a target PC via a mobile-optimized web dashboard.
- **Configuration**: Edit `Arkon/client/arkon.py` with your Render URL.
- **Features**: Remote Lock, Voice of God, Force Open, Minimize All.
- **Usage**: Run `StartArkon.bat` for local testing, or deploy Server to Render and build Client EXE for remote control.

## 🔧 How the Shortcuts Work (Batch Files)

The desktop shortcuts (e.g., `SwitchProject.bat`) are simple Windows Batch files. You can create your own by opening Notepad, pasting the code below, and saving it as `.bat`.



## 📝 Change Log
- **[2026-01-25]**: Added `Dev Launcher` with support for 8 projects.
- **[2026-01-25]**: Reorganized `Web Waker` into its own subdirectory.
- **[2026-01-25]**: Initialized `Ping Tool` (Web Waker).
