import { useEffect } from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { listen, Event } from "@tauri-apps/api/event"
import "./style/tailwind.global.css"

function App() {
  async function screen() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke("ocr_command")
  }

  useEffect(() => {
    let unlisten: (() => void) | undefined = undefined
    ;(async () => {
      unlisten = await listen("change-text", async (event: Event<string>) => {
        const selectedText = event.payload
        if (selectedText) {
          console.log(selectedText)
        }
      })
    })()
    return () => {
      unlisten?.()
    }
  }, [])

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex justify-center items-center">
        <button className="btn flex-1 mx-4 mt-4" onClick={screen}>
          Screen OCR
        </button>
        <button className="btn flex-1 mx-4 mt-4">Clipboard OCR</button>
      </div>

      {/* <div className="row">
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}

      {/* <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault()
          greet()
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p> */}
    </div>
  )
}

export default App
