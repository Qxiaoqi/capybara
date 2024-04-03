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
import CopyIcon from "@/components/CopyIcon"
import CollapsePanel from "@/components/CollapsePanel"
import TranslateHeader from "./Header"

const Translator: React.FC = () => {
  const [originText, setOriginText] = React.useState("")
  const [text, setText] = React.useState("")
  const [srcSelect, setSrcSelect] = React.useState<string>("auto")
  const [destSelect, setDestSelect] = React.useState<string>("zh")

  const {
    data: baiduData,
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
      ready: !!originText,
    }
  )

  const {
    data: tencentData,
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
      ready: !!originText,
    }
  )

  const {
    data: azureData,
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
      ready: !!originText,
    }
  )

  React.useEffect(() => {
    // 页面新创建的时候，可能没有初始化成功，所以会将数据存储在 Rust，这里初始化的时候去获取
    invoke("get_last_ocr_text").then((text) => {
      if (text) {
        setOriginText(text as string)
        setText(text as string)
      }
    })

    let unlisten: (() => void) | undefined = undefined
    ;(async () => {
      unlisten = await listen("change-text", async (event: Event<string>) => {
        const selectedText = event.payload
        if (selectedText) {
          setOriginText(selectedText)
          setText(selectedText)
        }
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
    <div className="flex h-full">
      <div className="w-6/12 h-full">
        <div className="py-4 pl-4 pr-2 flex flex-col h-full">
          <TranslateHeader
            {...{ srcSelect, destSelect, setSrcSelect, setDestSelect }}
            onTranslateClick={onTranslateClick}
          ></TranslateHeader>
          <textarea
            className="textarea mt-4 p-4 bg-base-200 rounded flex-1 overflow-y-auto border-none text-base focus:outline-none focus:ring-0"
            placeholder="Bio"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div className="h-12 bg-neutral rounded-b">
            <div className="flex flex-row-reverse">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  writeText(originText)
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
            content={azureData?.data?.result || ""}
            loading={azureLoading}
          />
          <CollapsePanel
            title="百度翻译"
            content={baiduData?.data?.result || ""}
            loading={baiduLoading}
          />
          <CollapsePanel
            title="腾讯翻译"
            content={tencentData?.data?.result || ""}
            loading={tencentLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default Translator
