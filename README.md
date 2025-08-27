# AGK Web IDE

🚀 **Professional Web-Based IDE with Agentic Coding Capabilities & WASM-Powered File Management**

[![License: AGK-FIRE-INC](https://img.shields.io/badge/License-AGK--FIRE--INC-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.3.9-646CFF.svg)](https://vitejs.dev/)
[![WebAssembly](https://img.shields.io/badge/WebAssembly-Rust-orange.svg)](https://webassembly.org/)
[![Monaco Editor](https://img.shields.io/badge/Monaco-Editor-0078D4.svg)](https://microsoft.github.io/monaco-editor/)

## 📋 Overview

AGK Web IDE is a cutting-edge, browser-based integrated development environment built by **AGK FIRE INC**. It combines the power of modern web technologies with AI-assisted coding features and high-performance file management through WebAssembly (WASM).

### ✨ Key Features

- **🤖 Agentic Coding**: AI-powered code analysis, suggestions, and formatting
- **⚡ WASM Performance**: Rust-compiled WebAssembly for lightning-fast file operations
- **🎨 Monaco Editor**: Same editor engine as Visual Studio Code
- **📁 Native File Management**: File System Access API integration
- **🌈 Modern UI**: Beautiful, responsive interface with dark theme
- **🔧 Multi-Language Support**: JavaScript, TypeScript, Python, Rust, HTML, CSS, and more
- **📱 Responsive Design**: Works seamlessly on desktop and tablet devices

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- **Docker** (v20.10 or higher)
- **Docker Compose** (v2.0 or higher)

#### Quick Docker Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/agk-fire-inc/agk-web-ide.git
   cd agk-web-ide
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

#### Alternative Docker Commands

```bash
# Build and run
docker-compose up --build

# View logs
docker-compose logs -f agk-web-ide

# Stop the application
docker-compose down

# Rebuild after changes
docker-compose up --build --force-recreate
```

### Option 2: Local Development

#### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Rust** toolchain (for WASM compilation)
- **wasm-pack** (for building WASM modules)

#### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/agk-fire-inc/agk-web-ide.git
   cd agk-web-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build WASM modules**
   ```bash
   npm run wasm:build
   npm run wasm:copy
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### 🏠 Getting Started

1. **Open a Project Folder**
   - Click the "📂 Open Folder" button in the sidebar
   - Select a local directory to work with
   - The file tree will populate with your project structure

2. **Create New Files**
   - Click "➕ New File" to create a new file
   - Choose your preferred file extension
   - Start coding immediately!

3. **Edit Code**
   - Full Monaco Editor with IntelliSense
   - Syntax highlighting for 20+ languages
   - Auto-completion and error detection

### 🤖 Agentic Features

#### Code Analysis
- Click "🔍 Analyze Code" to get insights about your code
- View line count, word count, and complexity metrics
- Receive intelligent suggestions for improvement

#### Code Formatting
- Click "🎨 Format Code" for automatic code formatting
- Intelligent indentation and structure optimization
- Consistent coding style across your project

### 📁 File Management

- **Tree Navigation**: Expandable file tree with icons
- **Drag & Drop**: Native browser file operations
- **Search & Filter**: Quick file location
- **Multi-Tab Editing**: Work with multiple files simultaneously

### ⌨️ Keyboard Shortcuts

- `Ctrl+S`: Save current file
- `Ctrl+N`: New file
- `Ctrl+O`: Open folder
- `Ctrl+Shift+P`: Command palette (coming soon)

## 🐳 Docker Architecture

### Container Structure

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Monaco        │    │   WASM Module    │
│   (Frontend)    │◄──►│   Editor        │◄──►│   (Rust)         │
│   Container     │    │   Container     │    │   Container     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  File System    │    │   Syntax        │    │   File           │
│   Access API    │    │ Highlighting    │    │   Operations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Docker Images

- **wasm-builder**: Rust environment for compiling WebAssembly modules
- **node-builder**: Node.js environment for building React application
- **production**: Nginx server for serving the production build

### Multi-Stage Build Process

1. **WASM Stage**: Compiles Rust code to WebAssembly
2. **Build Stage**: Builds React app with Vite
3. **Production Stage**: Serves static files with Nginx

## 🏗️ Architecture

### Technology Stack

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Monaco        │    │   WASM Module    │
│   (Frontend)    │◄──►│   Editor        │◄──►│   (Rust)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  File System    │    │   Syntax        │    │   File           │
│   Access API    │    │ Highlighting    │    │   Operations     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Components

- **`App.jsx`**: Main application component
- **`FileTree.jsx`**: File explorer sidebar
- **`EditorTabs.jsx`**: Multi-tab file editor
- **`MonacoEditor.jsx`**: Code editor wrapper
- **`AgenticPanel.jsx`**: AI assistance panel

### WASM Integration

The WASM module (`wasm-file-manager`) provides:
- High-performance file validation
- Path sanitization
- Language detection
- Content processing
- Code analysis algorithms

## 🚀 Docker Deployment

### Production Deployment

#### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/agk-fire-inc/agk-web-ide.git
cd agk-web-ide

# Start the application
docker-compose up -d

# Check logs
docker-compose logs -f agk-web-ide

# Stop the application
docker-compose down
```

#### Using Docker Directly

```bash
# Build the image
docker build -t agk-web-ide .

# Run the container
docker run -p 3000:80 agk-web-ide

# Run with custom environment
docker run -p 3000:80 -e NODE_ENV=production agk-web-ide
```

### Advanced Docker Configuration

#### Custom Port Mapping
```yaml
# docker-compose.yml
services:
  agk-web-ide:
    ports:
      - "8080:80"  # Change 8080 to your desired port
```

#### SSL/TLS with Reverse Proxy
```yaml
# docker-compose.yml
services:
  agk-web-ide:
    ports:
      - "80:80"
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx-ssl.conf:/etc/nginx/nginx.conf:ro
      - ssl-certs:/etc/ssl/certs
```

#### Environment Variables
```bash
# Set environment variables
docker run -p 3000:80 \
  -e NODE_ENV=production \
  -e API_URL=https://api.example.com \
  agk-web-ide
```

### Docker Image Details

#### Image Layers
- **wasm-builder**: ~2GB (includes Rust toolchain)
- **node-builder**: ~800MB (includes Node.js and dependencies)
- **production**: ~150MB (Nginx with static files only)

#### Security Features
- Non-root user execution
- Minimal attack surface
- No shell access in production
- Security headers enabled

### Troubleshooting Docker

#### Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check build logs
docker-compose build --progress=plain
```

#### Runtime Issues
```bash
# Check container logs
docker-compose logs agk-web-ide

# Access container shell (debug only)
docker-compose exec agk-web-ide sh

# Check container health
docker-compose ps
```

#### WASM Build Failures
```bash
# Manual WASM build
docker run --rm -v $(pwd):/app -w /app rust:slim \
  cargo install wasm-pack && \
  cd wasm-file-manager && \
  wasm-pack build --target web --out-dir pkg
```

## 🔧 Development

### Project Structure

```
agk-web-ide/
├── src/
│   ├── assets/             # WASM modules and assets
│   │   ├── wasm_file_manager.js
│   │   └── wasm_file_manager_bg.wasm
├── src/
│   ├── components/         # React components
│   │   ├── FileTree.jsx
│   │   ├── EditorTabs.jsx
│   │   ├── MonacoEditor.jsx
│   │   └── AgenticPanel.jsx
│   ├── App.jsx            # Main app component
│   ├── App.css            # Main styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── wasm-file-manager/     # Rust WASM module
│   ├── src/
│   │   └── lib.rs
│   └── Cargo.toml
├── Dockerfile             # Docker build configuration
├── docker-compose.yml     # Docker orchestration
├── nginx.conf            # Nginx configuration
├── .dockerignore         # Docker ignore file
├── package.json
├── vite.config.js
└── README.md
```

### Building WASM Module

```bash
cd wasm-file-manager
wasm-pack build --target web --out-dir pkg
cd ..
npm run wasm:copy
```

### Adding New Languages

1. Update WASM module with new language detection
2. Add syntax highlighting in Monaco Editor
3. Update file icon mapping

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the **AGK FIRE INC License** - see the [LICENSE](LICENSE) file for details.

**Copyright © 2024 AGK FIRE INC**
**Contact: agk4444@gmail.com**

## 🙏 Acknowledgments

- **Microsoft** for Monaco Editor
- **Rust Team** for WebAssembly support
- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool

## 📞 Support

- **Email**: agk4444@gmail.com
- **Issues**: [GitHub Issues](https://github.com/agk-fire-inc/agk-web-ide/issues)
- **Discussions**: [GitHub Discussions](https://github.com/agk-fire-inc/agk-web-ide/discussions)

---

**Built with ❤️ by AGK FIRE INC**