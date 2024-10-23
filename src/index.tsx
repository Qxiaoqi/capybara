import React from "react"
import ReactDOM from "react-dom/client"
import { getCurrent } from "@tauri-apps/api/window"
import Index from "./container/App"
import Translator from "./container/Translator"
import Config from "./container/Config"
import { ScreenshotWindow } from './container/Screenshot'

import "./styles.css"
import "./style/tailwind.global.css"

const windowsMap = {
  main: Index,
  translator: Translator,
  config: Config,
  screenshot: ScreenshotWindow,
}

function App() {
  const appWindow = getCurrent()
  const Container = windowsMap[appWindow.label as keyof typeof windowsMap]
  return (
    <React.StrictMode>
      <Container />
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
)
