import React from "react"
import { invoke } from "@tauri-apps/api/tauri"

const App: React.FC = () => {
  async function screen() {
    invoke("ocr_command")
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex justify-center items-center">
        <button className="btn flex-1 mx-4 mt-4" onClick={screen}>
          Screen OCR
        </button>
        <button className="btn flex-1 mx-4 mt-4">Clipboard OCR</button>
      </div>
    </div>
  )
}

export default App
