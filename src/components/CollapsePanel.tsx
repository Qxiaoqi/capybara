import React, { useState } from "react"
import { writeText } from "@tauri-apps/api/clipboard"
import CopyIcon from "./Icon/CopyIcon"
import toast from "react-hot-toast"

interface CollapsePanelProps {
  title: string
  content: string
  loading?: boolean
}

const CollapsePanel: React.FC<CollapsePanelProps> = ({
  title,
  content,
  loading,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false)

  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className="collapse bg-base-200 collapse-arrow rounded mb-4 whitespace-pre-line">
      <input type="checkbox" checked={!collapsed} onChange={toggleCollapse} />
      <div
        className="collapse-title text-xl font-medium"
        onClick={toggleCollapse}
        role="button"
      >
        {title}
        {loading}
      </div>
      <div className="collapse-content">
        {loading ? (
          <div className="flex flex-col gap-4 w-full">
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        ) : (
          <>
            <p>{content}</p>
            {!!content && (
              <div className="flex flex-row-reverse">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    writeText(content)
                    toast.success("复制成功")
                  }}
                >
                  <CopyIcon className="h-5 w-5" color="#000000" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CollapsePanel
