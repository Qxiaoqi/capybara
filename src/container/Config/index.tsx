import React from "react"
import { Toaster } from "react-hot-toast"
// import RechargeIcon from "@/components/Icon/RechargeIcon"
import AboutIcon from "@/components/Icon/AboutIcon"
import UserIcon from "@/components/Icon/UserIcon"
import MenuItem from "@/components/MenuItem"
import KeyboardIcon from "@/components/Icon/KeyboardIcon"
import WinCloseIcon from "@/components/Icon/WinCloseIcon"
import { appWindow } from "@tauri-apps/api/window"
import { osType } from "@/utils/env"
import About from "./About"
import User from "./User"
import Keyboard from "./Keyboard"

// import Recharge from "./Recharge"

const MenuList = [
  {
    id: "personal",
    title: "个人信息",
    icon: UserIcon,
  },
  // {
  //   id: "recharge",
  //   title: "点数充值",
  //   icon: RechargeIcon,
  // },
  {
    id: "setting",
    title: "热键设置",
    icon: KeyboardIcon,
  },
  {
    id: "about",
    title: "关于应用",
    icon: AboutIcon,
  },
]

const Config: React.FC = () => {
  const [selected, setSelected] = React.useState<string>("personal")

  const handleSelect = (id: string) => {
    setSelected(id)
  }

  return (
    <>
      <div
        className="fixed top-[0px] left-[5px] right-[5px] h-[35px]"
        data-tauri-drag-region="true"
      />
      <div className="pt-[30px] bg-base-200 fixed h-full">
        <ul className="menu bg-base-200 w-56 rounded-box">
          {MenuList.map((item) => (
            <MenuItem
              key={item.id}
              Icon={item.icon}
              title={item.title}
              id={item.id}
              selectedId={selected}
              onClick={handleSelect}
            />
          ))}
        </ul>
      </div>
      <div className="ml-56 h-full">
        {osType === 'Windows_NT' && (
          <div className={`h-[30px] absolute top-0 right-0 px-1 flex items-center mr-[5px] justify-end bg-transparent`}>
            <div className="relative cursor-pointer" onClick={() => {
              appWindow.close()
            }}>
              <WinCloseIcon />
            </div>
          </div>
        )}
        <div className="navbar bg-base-100">
          <a className="btn btn-ghost text-xl">
            {MenuList.find((item) => item.id === selected)?.title}
          </a>
        </div>
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          {selected === "personal" && <User />}
          {selected === "setting" && <Keyboard />}
          {selected === "about" && <About />}
          {/* {selected === "recharge" && <Recharge />} */}
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default Config
