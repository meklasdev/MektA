# Mekta Addon System

Mekta provides a built-in command to install and manage specialized "Architect Addons."

## Usage

```bash
mekta addons --list
mekta addons gsap
mekta addons fivem
```

## Available Addons

### GSAP (GreenSock)
Installs GSAP for high-performance animations and creates a demo file (`gsap-demo.mek`) to show you how to use it in your Mekta components.

### FiveM
Architects your project for use as a FiveM UI resource. It generates:
- `fxmanifest.lua` with the correct UI configuration.
- A basic `html/` directory for your built files.

## Custom Addons

Addons are defined in `addons/addons.js`. They can:
1. Inject dependencies into `package.json`.
2. Generate boilerplate code or configuration files.
3. Perform post-install actions.
