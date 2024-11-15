import React from "react"
import useAppInfo from "@/hooks/useAppInfo"

const About: React.FC = () => {
  const appVersion = useAppInfo()

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col items-center h-full">
        <div className="w-48 h-48 rounded-xl">
          <img src="/logo2.png" className="rounded-xl" />
        </div>
        <h1 className="text-2xl mt-4">
          {appVersion?.name || "CapyAssist"}（内测版）
        </h1>
        <h3 className="text-slate-500	">v{appVersion?.version}</h3>
        <p className="text-base w-8/12 text-center mt-4">
          一款多平台翻译软件，支持 OCR 识别翻译，并且内置 GPT
          翻译服务，努力成为您最好的办公助手!
        </p>
        <p className="text-base w-8/12 text-center mt-4 text-slate-500 text-[14px]">
          (由于内测版本的费用由我承担，因此如果超出限额可能会调用失败，敬请谅解)
        </p>
      </div>
    </div>
  )
}

export default About
