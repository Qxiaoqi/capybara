import React from "react"
import { osType } from "@/utils/env"
import { useConfig } from "@/hooks/useConfig"
import { isRegistered, unregister } from "@tauri-apps/api/globalShortcut"
import toast from "react-hot-toast"
import { invoke } from "@tauri-apps/api"

const keyMap: { [key: string]: string } = {
  Backquote: "`",
  Backslash: "\\",
  BracketLeft: "[",
  BracketRight: "]",
  Comma: ",",
  Equal: "=",
  Minus: "-",
  Plus: "PLUS",
  Period: ".",
  Quote: "'",
  Semicolon: ";",
  Slash: "/",
  Backspace: "Backspace",
  CapsLock: "Capslock",
  ContextMenu: "Contextmenu",
  Space: "Space",
  Tab: "Tab",
  Convert: "Convert",
  Delete: "Delete",
  End: "End",
  Help: "Help",
  Home: "Home",
  PageDown: "Pagedown",
  PageUp: "Pageup",
  Escape: "Esc",
  PrintScreen: "Printscreen",
  ScrollLock: "Scrolllock",
  Pause: "Pause",
  Insert: "Insert",
  Suspend: "Suspend",
}

const Keyboard: React.FC = () => {
  const [inputTranslate, setInputTranslate] = useConfig(
    "hotkey_input_translate",
    ""
  )
  const [ocrTranslate, setOcrTranslate] = useConfig("hotkey_ocr_translate", "")
  const [clipboardTranslate, setClipboardTranslate] = useConfig(
    "hotkey_clipboard_translate",
    ""
  )
  const [selectionTranslate, setSelectionTranslate] = useConfig(
    "hotkey_selection_translate",
    ""
  )

  const keyDown = (e: any, setKey: any) => {
    e.preventDefault()
    if (e.keyCode === 8) {
      setKey("")
    } else {
      let newValue = ""
      if (e.ctrlKey) {
        newValue = "Ctrl"
      }
      if (e.shiftKey) {
        newValue = `${newValue}${newValue.length > 0 ? "+" : ""}Shift`
      }
      if (e.metaKey) {
        newValue = `${newValue}${newValue.length > 0 ? "+" : ""}${
          osType === "Darwin" ? "Command" : "Super"
        }`
      }
      if (e.altKey) {
        newValue = `${newValue}${newValue.length > 0 ? "+" : ""}Alt`
      }
      let code = e.code
      if (code.startsWith("Key")) {
        code = code.substring(3)
      } else if (code.startsWith("Digit")) {
        code = code.substring(5)
      } else if (code.startsWith("Numpad")) {
        code = "Num" + code.substring(6)
      } else if (code.startsWith("Arrow")) {
        code = code.substring(5)
      } else if (code.startsWith("Intl")) {
        code = code.substring(4)
      } else if (/F\d+/.test(code)) {
      } else if (keyMap[code] !== undefined) {
        code = keyMap[code]
      } else {
        code = ""
      }
      setKey(
        `${newValue}${newValue.length > 0 && code.length > 0 ? "+" : ""}${code}`
      )
    }
  }

  const registerHandler = (name: string, key: any) => {
    isRegistered(key).then((res) => {
      if (res) {
        toast.error("热键已注册")
      } else {
        invoke("register_shortcut_by_frontend", {
          name: name,
          shortcut: key,
        }).then(
          () => {
            toast.success("热键设置成功")
          },
          (e) => {
            toast.error(e)
          }
        )
      }
    })
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col items-center h-full">
        <div className="flex items-center mt-6">
          <label className="mr-4 w-32 text-right">文本翻译</label>
          <input
            type="text"
            value={inputTranslate}
            placeholder="按下按键设置快捷键"
            className="input input-bordered"
            required
            onKeyDown={(e) => {
              keyDown(e, setInputTranslate)
            }}
            onFocus={() => {
              unregister(inputTranslate)
              setInputTranslate("")
            }}
          />
          <button
            className="ml-4 btn"
            onClick={() => {
              registerHandler("hotkey_input_translate", inputTranslate)
            }}
          >
            确认
          </button>
        </div>
        <div className="mt-6 flex items-center">
          <label className="mr-4 w-32 text-right">剪贴板翻译</label>
          <input
            type="text"
            value={clipboardTranslate}
            placeholder="按下按键设置快捷键"
            className="input input-bordered"
            required
            onKeyDown={(e) => {
              keyDown(e, setClipboardTranslate)
            }}
            onFocus={() => {
              unregister(clipboardTranslate)
              setClipboardTranslate("")
            }}
          />
          <button
            className="ml-4 btn"
            onClick={() => {
              registerHandler("hotkey_clipboard_translate", clipboardTranslate)
            }}
          >
            确认
          </button>
        </div>
        <div className="flex mt-6 items-center">
          <label className="mr-4 w-32 text-right">截图 OCR 翻译</label>
          <input
            type="text"
            value={ocrTranslate}
            placeholder="按下按键设置快捷键"
            className="input input-bordered"
            required
            onKeyDown={(e) => {
              keyDown(e, setOcrTranslate)
            }}
            onFocus={() => {
              unregister(ocrTranslate)
              setOcrTranslate("")
            }}
          />
          <button
            className="ml-4 btn"
            onClick={() => {
              registerHandler("hotkey_ocr_translate", ocrTranslate)
            }}
          >
            确认
          </button>
        </div>
        <div className="flex mt-6 items-center">
          <label className="mr-4 w-32 text-right">划词翻译</label>
          <input
            type="text"
            value={selectionTranslate}
            placeholder="按下按键设置快捷键"
            className="input input-bordered"
            required
            onKeyDown={(e) => {
              keyDown(e, setSelectionTranslate)
            }}
            onFocus={() => {
              unregister(selectionTranslate)
              setSelectionTranslate("")
            }}
          />
          <button
            className="ml-4 btn"
            onClick={() => {
              registerHandler("hotkey_selection_translate", selectionTranslate)
            }}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  )
}

export default Keyboard
