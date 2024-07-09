import React from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { appWindow } from "@tauri-apps/api/window"
import ScreenshotIcon from "@/components/Icon/ScreenshotIcon"
import SettingIcon from "@/components/Icon/SettingIcon"
import CloseIcon from "@/components/Icon/CloseIcon"
import InputIcon from "@/components/Icon/InputIcon"
import ClipboardIcon from "@/components/Icon/ClipboardIcon"
import PinIcon from "@/components/Icon/PinIcon"
import PinFillIcon from "@/components/Icon/PinFillIcon"
import { useLocalStorageState, useRequest } from "ahooks"
import { getProfile } from "@/api/user"

const App: React.FC = () => {
  const [accessToken] = useLocalStorageState<string | undefined>(
    "accessToken",
    {
      listenStorageChange: true,
      serializer: (v) => v ?? "",
      deserializer: (v) => v,
    }
  )

  const [pined, setPined] = React.useState<boolean>(false)

  const { loading: getProfileLoading, data: profile } = useRequest(getProfile, {
    ready: !!accessToken,
  })

  async function screen() {
    invoke("ocr_command")
  }

  async function textTranslate() {
    invoke("text_command")
  }

  async function clipboard() {
    invoke("clipboard_command")
  }

  async function openConfig() {
    invoke("open_config_command")
  }

  return (
    <>
      <div
        className="fixed top-[0px] left-[5px] right-[5px] h-[35px]"
        data-tauri-drag-region="true"
      />
      <div className="h-[30px] flex flex-row-reverse mr-[5px]">
        <label className="swap">
          <input
            type="checkbox"
            className="shadow-none"
            checked={pined}
            onChange={(value) => {
              const checked = value.target.checked
              setPined(checked)
              appWindow.setAlwaysOnTop(checked)
            }}
          />
          <PinFillIcon className="swap-on" />
          <PinIcon className="swap-off" />
        </label>
      </div>
      <div className="flex flex-col justify-between h-[calc(100vh-30px)] bg-white">
        <div className="p-4 bg-white">
          <div className="flex items-center mb-4 justify-between">
            <div className="flex items-center">
              {!!accessToken ? (
                <>
                  <div className="badge badge-neutral font-bold">已登陆</div>
                  {getProfileLoading ? (
                    <span className="loading loading-ring loading-sm"></span>
                  ) : (
                    <span className="font-bold ml-2">
                      {profile?.data?.email}
                    </span>
                  )}
                </>
              ) : (
                <div
                  className="badge badge-ghost font-bold cursor-pointer"
                  onClick={openConfig}
                >
                  未登陆
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center mb-4">
            <div
              className="rounded flex-1 mr-2 cursor-pointer border-gray-200 border-4 border-dashed flex flex-col items-center p-4"
              onClick={textTranslate}
            >
              <div className="mb-2 font-bold flex items-center">
                <InputIcon className="mr-1" />
                文本翻译
              </div>
              <div>
                <kbd className="kbd kbd-sm">Ctrl</kbd> <span>+</span>{" "}
                <kbd className="kbd kbd-sm">D</kbd>
              </div>
            </div>
            <div
              className="rounded flex-1 mr-2 cursor-pointer border-gray-200 border-4 border-dashed flex flex-col items-center p-4"
              onClick={clipboard}
            >
              <div className="mb-2 font-bold flex items-center">
                <ClipboardIcon className="mr-1" />
                剪贴板翻译
              </div>
              <div>
                <kbd className="kbd kbd-sm">Ctrl</kbd> <span>+</span>{" "}
                <kbd className="kbd kbd-sm">A</kbd>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div
              className="rounded flex-1 mr-2 cursor-pointer border-gray-200 border-4 border-dashed flex flex-col items-center p-4"
              onClick={screen}
            >
              <div className="mb-2 font-bold flex items-center">
                <ScreenshotIcon className="mr-1" />
                截图 OCR 翻译
              </div>
              <div>
                <kbd className="kbd kbd-sm">Ctrl</kbd> <span>+</span>{" "}
                <kbd className="kbd kbd-sm">S</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="h-12 rounded flex items-center p-4 justify-between border-t-base-200 border-t-2 bg-white">
          <div
            className="flex items-center cursor-pointer"
            onClick={openConfig}
          >
            <SettingIcon />
            <span className="pl-1">设置</span>
          </div>
          <div className="flex items-center">
            <div
              className="cursor-pointer"
              onClick={() => appWindow.minimize()}
            >
              <CloseIcon />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
