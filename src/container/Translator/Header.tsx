import React from "react"
import SwapIcon from "@/components/Icon/SwapIcon"
import { LANGUAGE } from "@/utils/language"
import toast from "react-hot-toast"

interface HeaderProps {
  srcSelect: string
  destSelect: string
  setSrcSelect: (value: string) => void
  setDestSelect: (value: string) => void
  onTranslateClick: () => void
}

const Header: React.FC<HeaderProps> = ({
  srcSelect,
  destSelect,
  setSrcSelect,
  setDestSelect,
  onTranslateClick,
}) => {
  const onSrcChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSrcSelect(event.target.value)
  }

  const onDestChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDestSelect(event.target.value)
  }

  const handleTranslateClick = () => {
    onTranslateClick()
  }

  const handleSwapClick = () => {
    if (srcSelect === "auto") {
      toast.error("自动检测不支持切换为目标语言")
      return
    }
    const temp = srcSelect
    setSrcSelect(destSelect)
    setDestSelect(temp)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex">
        <select
          className="select select-bordered mr-4"
          onChange={onSrcChange}
          value={srcSelect}
        >
          {LANGUAGE.map((item) => (
            <option key={item.label} value={item.label}>
              {item.name}
            </option>
          ))}
        </select>
        <button className="btn btn-circle" onClick={handleSwapClick}>
          <SwapIcon />
        </button>
        <select
          className="select select-bordered ml-4"
          onChange={onDestChange}
          value={destSelect}
        >
          {LANGUAGE.filter((item) => item.label !== "auto").map((item) => (
            <option value={item.label}>{item.name}</option>
          ))}
        </select>
      </div>
      <div>
        <button className="btn btn-neutral" onClick={handleTranslateClick}>
          翻译
        </button>
      </div>
    </div>
  )
}

export default Header
