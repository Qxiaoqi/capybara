import axios from "axios"
import toast from "react-hot-toast"

let hasShownTokenError = false

const LIVE_URL = "http://49.232.218.10:3001/api/"
const DEV_URL = "http://localhost:3000/api/"

const request = axios.create({
  baseURL: LIVE_URL,
})

request.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken")
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    return response?.data
  },
  (error) => {
    if (error?.response?.data) {
      const errorMessage = error?.response?.data?.message
      if (errorMessage === "Invalid password") {
        toast.error("密码错误")
      } else if (errorMessage === "Invalid verification token") {
        toast.error("验证码错误")
      } else if (errorMessage === "Token not found") {
        if (!hasShownTokenError) {
          toast("请先登录", { icon: "🔒" })
          hasShownTokenError = true
          setTimeout(() => {
            hasShownTokenError = false
          }, 4000) // 重置状态，防止重复提示
        }
      } else if (errorMessage === "Token invalid") {
        toast("登录失效，请重新登录", { icon: "🔒" })
      } else if (errorMessage === "User not found") {
        toast.error("用户不存在")
      } else if (errorMessage === "Points not enough") {
        toast("点数不足，请充值", { icon: "💰" })
      } else if (errorMessage === "Email already verified") {
        toast.error("邮箱已经验证")
      } else {
        toast.error(errorMessage)
      }
      return Promise.reject(error?.response?.data)
    }
    toast.error(error?.message || "请求失败")
    return Promise.reject(error)
  }
)

export default request
