import { app, BrowserWindow, globalShortcut, ipcMain, clipboard, Menu } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { isDev } from './utils'

interface AppSettings {
  deepgramApiKey?: string;
}

class SimpleStore {
  private configPath: string
  private data: AppSettings = {}

  constructor() {
    const configDir = join(homedir(), '.wisp')
    if (!existsSync(configDir)) {
      mkdirSync(configDir, { recursive: true })
    }
    this.configPath = join(configDir, 'config.json')
    this.load()
  }

  private load() {
    try {
      if (existsSync(this.configPath)) {
        const fileContent = readFileSync(this.configPath, 'utf8')
        this.data = JSON.parse(fileContent)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
      this.data = {}
    }
  }

  private save() {
    try {
      writeFileSync(this.configPath, JSON.stringify(this.data, null, 2))
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  }

  get(key: string, defaultValue: any = null): any {
    return this.data[key as keyof AppSettings] ?? defaultValue
  }

  set(key: string, value: any): void {
    this.data[key as keyof AppSettings] = value
    this.save()
  }

  has(key: string): boolean {
    return key in this.data
  }

  delete(key: string): void {
    delete this.data[key as keyof AppSettings]
    this.save()
  }

  clear(): void {
    this.data = {}
    this.save()
  }
}

class WispApp {
  private mainWindow: BrowserWindow | null = null
  private isRecording = false
  private store: SimpleStore

  constructor() {
    this.store = new SimpleStore()
    this.initializeApp()
  }

  private initializeApp() {
    app.whenReady().then(() => {
      this.createWindow()
      this.setupGlobalShortcuts()
      this.setupIpcHandlers()
      this.setupMenu()
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow()
      }
    })

    app.on('before-quit', () => {
      globalShortcut.unregisterAll()
    })
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      width: 600,
      height: 800,
      minWidth: 500,
      minHeight: 600,
      frame: false,
      transparent: true,
      alwaysOnTop: false,
      resizable: true,
      skipTaskbar: false,
      focusable: true,
      minimizable: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, 'preload.js'),
        webSecurity: !isDev(),
        sandbox: false,
      },
    })

    if (isDev()) {
      this.mainWindow.loadURL('http://localhost:3000')
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(join(__dirname, 'renderer/index.html'))
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })

    this.mainWindow.on('blur', () => {
      if (this.isRecording) {
        this.mainWindow?.webContents.send('stop-recording')
        this.isRecording = false
      }
    })
  }

  private setupGlobalShortcuts() {

    globalShortcut.register('CommandOrControl+Shift+Space', () => {
      if (this.mainWindow) {
        if (this.mainWindow.isVisible()) {
          this.mainWindow.hide()
        } else {
          this.mainWindow.show()
          this.mainWindow.focus()
        }
      }
    })
  }

  private setupIpcHandlers() {
    ipcMain.handle('window-minimize', () => {
      this.mainWindow?.minimize()
    })

    ipcMain.handle('window-close', () => {
      this.mainWindow?.close()
    })

    ipcMain.handle('window-drag', (_, { x, y }) => {
      if (this.mainWindow) {
        this.mainWindow.setPosition(x, y)
      }
    })

    ipcMain.handle('copy-to-clipboard', (_, text: string) => {
      clipboard.writeText(text)
      return true
    })

    ipcMain.handle('set-recording-state', (_, recording: boolean) => {
      this.isRecording = recording
    })

    ipcMain.handle('get-app-version', () => {
      return app.getVersion()
    })

    ipcMain.handle('save-window-bounds', () => {
      if (this.mainWindow) {
        const bounds = this.mainWindow.getBounds()
        return bounds
      }
    })

    ipcMain.handle('restore-window-bounds', (_, bounds) => {
      if (this.mainWindow && bounds) {
        this.mainWindow.setBounds(bounds)
      }
    })

    // Persistent API key storage for Deepgram
    ipcMain.handle('set-deepgram-api-key', async (_, apiKey: string) => {
      this.store.set('deepgramApiKey', apiKey)
      return !!apiKey
    })

    ipcMain.handle('has-deepgram-api-key', () => {
      return !!this.store.get('deepgramApiKey')
    })

    ipcMain.handle('get-deepgram-api-key', () => {
      return this.store.get('deepgramApiKey', null)
    })

    ipcMain.handle('set-always-on-top', (_, alwaysOnTop: boolean) => {
      this.mainWindow?.setAlwaysOnTop(alwaysOnTop)
    })
  }

  private setupMenu() {
    const template = [
      {
        label: 'Wisp',
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectall' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ]

    const menu = Menu.buildFromTemplate(template as any)
    Menu.setApplicationMenu(menu)
  }
}

new WispApp()
