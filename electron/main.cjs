const { app, BrowserWindow, shell, ipcMain } = require("electron");
const { spawn } = require("child_process");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");
const http = require("http");

let nextServer;
const statePath = () => path.join(app.getPath("userData"), "mekta-state.json");
const workspacePath = () => path.join(app.getPath("userData"), "mekta-workspace.json");
const orchestrationPath = () => path.join(app.getPath("userData"), "mekta-orchestration.json");
function startNext() {
  const root = app.isPackaged ? path.join(process.resourcesPath, "app") : path.join(__dirname, "..");
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  nextServer = spawn(process.execPath, [nextBin, "start", "-p", "3000"], { cwd: root, env: { ...process.env, ELECTRON_RUN_AS_NODE: "1" }, windowsHide: true });
  nextServer.stdout?.on("data", (data) => console.log(`[next] ${data}`));
  nextServer.stderr?.on("data", (data) => console.error(`[next] ${data}`));
  nextServer.on("error", (error) => console.error("Failed to start Next server", error));
}
function waitForServer(attempts = 40) { return new Promise((resolve, reject) => { const check = () => { const request = http.get("http://127.0.0.1:3000", (response) => { response.resume(); if (response.statusCode && response.statusCode < 500) resolve(); else retry(); }); request.on("error", retry); request.setTimeout(500, () => { request.destroy(); retry(); }); }; const retry = () => { if (attempts-- <= 0) reject(new Error("MektA Studio server did not start on port 3000")); else setTimeout(check, 250); }; check(); }); }
function createWindow() {
  const window = new BrowserWindow({ width: 1480, height: 940, minWidth: 1120, minHeight: 720, show: false, titleBarStyle: "hidden", titleBarOverlay: { color: "#08090c", symbolColor: "#a1a1aa", height: 34 }, backgroundColor: "#08090c", webPreferences: { contextIsolation: true, sandbox: true, preload: path.join(__dirname, "preload.cjs") } });
  const logPath = path.join(app.getPath("userData"), "renderer.log");
  const log = (message) => { try { fs.appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`); } catch {} };
  window.webContents.on("did-finish-load", () => { log("did-finish-load"); window.show(); });
  window.webContents.on("dom-ready", () => log("dom-ready"));
  window.webContents.on("did-fail-load", (_event, code, description, url) => log(`did-fail-load ${code} ${description} ${url}`));
  window.webContents.on("render-process-gone", (_event, details) => log(`render-process-gone ${details.reason}`));
  window.webContents.on("console-message", (_event, level, message) => log(`console ${level} ${message}`));
  const page = app.isPackaged ? window.loadFile(path.join(process.resourcesPath, "app", "out", "index.html")) : window.loadURL("http://localhost:3000");
  page.catch((error) => { log(`load-error ${error}`); window.show(); });
  window.webContents.setWindowOpenHandler(({ url }) => { if (url.startsWith("https:")) shell.openExternal(url); return { action: "deny" }; });
}
ipcMain.handle("mekta:run-command", async (_event, command) => {
  const value = typeof command === "string" ? command.trim() : "";
  const allowed = /^(opencode|npx mekta|npm run (dev|build|legacy:dev|legacy:build))\b/.test(value);
  if (!allowed) return { ok: false, output: "Command blocked. Only OpenCode and MektA project commands are allowed." };
  return await new Promise((resolve) => {
    const child = spawn(value, { cwd: path.join(__dirname, ".."), shell: true, windowsHide: true });
    let output = "";
    child.stdout?.on("data", (chunk) => { output += chunk.toString(); });
    child.stderr?.on("data", (chunk) => { output += chunk.toString(); });
    child.on("close", (code) => resolve({ ok: code === 0, output: output.slice(-6000) }));
  });
});
ipcMain.handle("mekta:load-state", async () => { try { return JSON.parse(fs.readFileSync(statePath(), "utf8")); } catch { return null; } });
ipcMain.handle("mekta:save-state", async (_event, state) => { fs.mkdirSync(path.dirname(statePath()), { recursive: true }); fs.writeFileSync(statePath(), JSON.stringify(state, null, 2), "utf8"); return { ok: true }; });
ipcMain.handle("mekta:load-workspace", async () => { try { return JSON.parse(fs.readFileSync(workspacePath(), "utf8")); } catch { return null; } });
ipcMain.handle("mekta:save-workspace", async (_event, workspace) => { fs.mkdirSync(path.dirname(workspacePath()), { recursive: true }); fs.writeFileSync(workspacePath(), JSON.stringify(workspace, null, 2), "utf8"); return { ok: true }; });
ipcMain.handle("mekta:load-orchestration", async () => { try { return JSON.parse(fs.readFileSync(orchestrationPath(), "utf8")); } catch { return null; } });
ipcMain.handle("mekta:save-orchestration", async (_event, state) => { fs.mkdirSync(path.dirname(orchestrationPath()), { recursive: true }); fs.writeFileSync(orchestrationPath(), JSON.stringify(state, null, 2), "utf8"); return { ok: true }; });
ipcMain.handle("mekta:runtime-status", async () => await new Promise((resolve) => { const child = spawn("opencode", ["--version"], { shell: true, windowsHide: true }); let output = ""; child.stdout?.on("data", (chunk) => { output += chunk.toString(); }); child.on("close", (code) => resolve({ installed: code === 0, version: output.trim() })); child.on("error", () => resolve({ installed: false, version: "" })); }));
ipcMain.handle("mekta:check-updates", async () => { if (!app.isPackaged) return { available: false, reason: "development" }; try { const result = await autoUpdater.checkForUpdates(); return { available: Boolean(result?.updateInfo), version: result?.updateInfo?.version ?? null }; } catch (error) { return { available: false, reason: String(error) }; } });
ipcMain.handle("mekta:install-update", async () => { if (!app.isPackaged) return { ok: false }; await autoUpdater.downloadUpdate(); autoUpdater.quitAndInstall(); return { ok: true }; });
autoUpdater.autoDownload = false;
app.whenReady().then(async () => { try { if (!app.isPackaged) { startNext(); await waitForServer(); } await createWindow(); } catch (error) { console.error(error); const window = new BrowserWindow({ width: 720, height: 420, backgroundColor: "#08090c" }); window.loadURL(`data:text/html,<body style="background:%2308090c;color:%23f4f4f5;font:16px Arial;padding:40px"><h2>MektA Studio could not start</h2><p>Local app assets failed to load.</p><pre>${String(error)}</pre></body>`); } app.on("activate", () => { if (!BrowserWindow.getAllWindows().length) createWindow(); }); });
app.on("window-all-closed", () => { if (nextServer) nextServer.kill(); if (process.platform !== "darwin") app.quit(); });
