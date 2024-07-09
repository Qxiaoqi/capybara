import React from "react"
import { writeText } from "@tauri-apps/api/clipboard"
import { listen, Event } from "@tauri-apps/api/event"
import { invoke } from "@tauri-apps/api"
import {
  azureTranslate,
  baiduTranslate,
  tencentTranslate,
} from "@/api/translate"
import { useRequest } from "ahooks"
import CopyIcon from "@/components/Icon/CopyIcon"
import CollapsePanel from "@/components/CollapsePanel"
import TranslateHeader from "./Header"
import toast, { Toaster } from "react-hot-toast"
import PinFillIcon from "@/components/Icon/PinFillIcon"
import PinIcon from "@/components/Icon/PinIcon"
import { appWindow } from "@tauri-apps/api/window"

const Translator: React.FC = () => {
  const [pined, setPined] = React.useState<boolean>(false)

  const [originText, setOriginText] = React.useState("")
  const [text, setText] = React.useState("")
  const [srcSelect, setSrcSelect] = React.useState<string>("auto")
  const [destSelect, setDestSelect] = React.useState<string>("zh")

  const {
    data: baiduData,
    error: baiduError,
    loading: baiduLoading,
    run: runBaidu,
  } = useRequest(
    () =>
      baiduTranslate({
        content: originText?.trim(),
        from: srcSelect,
        to: destSelect,
      }),
    {
      refreshDeps: [originText],
    }
  )

  const {
    data: tencentData,
    error: tencentError,
    loading: tencentLoading,
    run: runTencent,
  } = useRequest(
    () =>
      tencentTranslate({
        content: originText?.trim(),
        from: srcSelect,
        to: destSelect,
      }),
    {
      refreshDeps: [originText],
    }
  )

  const {
    data: azureData,
    error: azureError,
    loading: azureLoading,
    run: runAzure,
  } = useRequest(
    () =>
      azureTranslate({
        content: originText?.trim(),
        from: srcSelect,
        to: destSelect,
      }),
    {
      refreshDeps: [originText],
    }
  )

  React.useEffect(() => {
    // 页面新创建的时候，可能没有初始化成功，所以会将数据存储在 Rust，这里初始化的时候去获取
    invoke("get_last_translate_text").then((text) => {
      if (text) {
        setOriginText(text as string)
        setText(text as string)
      }
    })

    let unlisten: (() => void) | undefined = undefined
    ;(async () => {
      unlisten = await listen("change-text", async (event: Event<string>) => {
        const selectedText = event.payload
        setOriginText(selectedText)
        setText(selectedText)
      })
    })()
    return () => {
      unlisten?.()
    }
  }, [])

  const onTranslateClick = () => {
    if (text === originText) {
      runAzure()
      runBaidu()
      runTencent()
    } else {
      setOriginText(text)
    }
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
      <div className="flex h-[calc(100vh-30px)]">
        <div className="w-6/12 h-full">
          <div className="py-4 pl-4 pr-2 flex flex-col h-full">
            <TranslateHeader
              {...{ srcSelect, destSelect, setSrcSelect, setDestSelect }}
              onTranslateClick={onTranslateClick}
            ></TranslateHeader>
            <textarea
              className="textarea mt-4 p-4 bg-base-200 rounded flex-1 overflow-y-auto border-none text-base focus:outline-none focus:ring-0"
              placeholder="输入文本..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="h-12 bg-neutral rounded-b">
              <div className="flex flex-row-reverse">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    writeText(originText)
                    toast.success("复制成功")
                  }}
                >
                  <CopyIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-6/12 h-full overflow-y-auto">
          <div className="py-4 pl-2 pr-4">
            <CollapsePanel
              title="ChatGPT"
              content={azureError?.message || azureData?.data?.result || ""}
              loading={azureLoading}
            />
            <CollapsePanel
              title="百度翻译"
              content={baiduError?.message || baiduData?.data?.result || ""}
              loading={baiduLoading}
            />
            <CollapsePanel
              title="腾讯翻译"
              content={tencentError?.message || tencentData?.data?.result || ""}
              loading={tencentLoading}
            />
          </div>
        </div>
        <Toaster />
      </div>
    </>
  )
}

export default Translator
