import React from "react"
import { Toaster } from "react-hot-toast"
// import RechargeIcon from "@/components/Icon/RechargeIcon"
import AboutIcon from "@/components/Icon/AboutIcon"
import UserIcon from "@/components/Icon/UserIcon"
import MenuItem from "@/components/MenuItem"
import About from "./About"
import User from "./User"
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
        <div className="navbar bg-base-100">
          <a className="btn btn-ghost text-xl">
            {MenuList.find((item) => item.id === selected)?.title}
          </a>
        </div>
        <div className="h-[calc(100vh-64px)] overflow-y-auto">
          {selected === "personal" && <User />}
          {selected === "about" && <About />}
          {/* {selected === "recharge" && <Recharge />} */}
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default Config
