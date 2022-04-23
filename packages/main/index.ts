import { app, BrowserWindow, shell, Menu, session, ipcMain, webContents } from 'electron'
import { release } from 'os'
import { join } from 'path'
import RiotWsProtocol from './ws'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null

async function createWindow() {
  // const ws = new WebSocket(`wss://riot:8-BSWlTJbVRriFYQImNlLA@127.0.0.1:59479`, 'wamp', {
  //   rejectUnauthorized: false
  // })
	win = new BrowserWindow({
		frame: false,
		transparent: true,
		backgroundColor: '#00000000',
		width: 1370,
		height: 850,
		title: 'Main window',
		// 禁止缩放
		resizable: false,
		icon: join(__dirname, 'favicon.ico'),
		webPreferences: {
			preload: join(__dirname, '../preload/index.cjs'),
			nodeIntegration: true,
			contextIsolation: false,
			// experimentalFeatures: true,
		},
	})

  	// vue-devtools
  	const vue_devtools_path = 'C:\\Users\\seabiscuit\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 1\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\6.1.4_1'
  	session.defaultSession.loadExtension(vue_devtools_path, { allowFileAccess: true }).then(msg => process.stdout.write('load vue_devtools')).catch(e => {})
  
	if (app.isPackaged) {
		win.loadFile(join(__dirname, '../renderer/index.html'))
	} else {
	// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
		const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

		win.loadURL(url)
		win.webContents.openDevTools()
	}
  
	// Test active push message to Renderer-process
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', new Date().toLocaleString())
	})
  
  	// Make all links open with the browser, not with the application
	win.webContents.setWindowOpenHandler(({ url }) => {
		if (url.startsWith('https:')) shell.openExternal(url)
		return { action: 'deny' }
	})
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	win = null
	if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
	if (win) {
		// Focus on the main window if the user tried to open another
		if (win.isMinimized()) win.restore()
		win.focus()
	}
})

app.on('activate', () => {
	const allWindows = BrowserWindow.getAllWindows()
	if (allWindows.length) {
		allWindows[0].focus()
	} else {
		createWindow()
	}
})

// 响应最小化
ipcMain.on('minimize', () => {
	win?.minimize()
})

// 响应关闭
ipcMain.on('close', () => {
  	win?.close()
})

let ws : RiotWsProtocol | null = null
ipcMain.on('buildWs', (event, arg: string) => {
	ws = new RiotWsProtocol(arg)
	ws.addEventListener('open', () =>  event.reply('built') )
})

ipcMain.handle('subscribe', (e, event: string) => {
	ws?.subscribe(event, (payload: any) => {
		win?.webContents.send(event, JSON.stringify(payload))
	})
	return event
})