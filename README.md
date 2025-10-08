# Sunlines ✨

An interactive Three.js WebGL sketch featuring animated vertical lines with custom shaders, procedural sky effects, and scroll-based interactions.
https://jonathan-j8.github.io/sketch-sunlines/

## 🚀 Getting Started

### Installation

1. **Install dependencies**

    ```bash
    npm install
    ```

    This will automatically download the LYGIA shader library via the postinstall script.

2. **Start development server**

    ```bash
    npm run dev
    ```

    Navigate to `http://localhost:5173` (or the port shown in terminal)

### Build for Production

```bash
npm run build
npm run preview
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── main.ts                    # Main application entry point
├── components/
│   ├── createLines/          # Line geometry and materials
│   ├── createSky/           # Procedural sky system
│   ├── createBloomFx.ts     # Post-processing bloom effect
│   └── createCubeTexture.ts # Environment mapping
├── useThreeWrapper.ts        # Three.js setup and utilities
├── usePointerUniforms.ts     # Mouse interaction system
└── lygia/                    # GLSL utility library (auto-installed)
```

---

_Created as part of creative coding exploration with WebGL and procedural graphics._
