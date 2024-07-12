import { getOverview } from "@/api/analyze"
import { getProfile, login, verify } from "@/api/user"
import { useLocalStorageState, useRequest } from "ahooks"
import React from "react"
import toast from "react-hot-toast"

const User: React.FC = () => {
  const [accessToken, setAccessToken] = useLocalStorageState<
    string | undefined
  >("accessToken", {
    serializer: (v) => v ?? "",
    deserializer: (v) => v,
  })

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [verifyCode, setVerifyCode] = React.useState("")

  const [step, setStep] = React.useState<"login" | "verify">("login")

  const { loading: loginLoading, runAsync: loginRunAsync } = useRequest(login, {
    manual: true,
  })

  const { loading: verifyLoading, runAsync: verifyRunAsync } = useRequest(
    verify,
    {
      manual: true,
    }
  )

  const { loading: getProfileLoading, data: profile } = useRequest(getProfile, {
    ready: !!accessToken,
  })
  const { loading: getOverviewLoading, data: overview } = useRequest(
    getOverview,
    {
      ready: !!accessToken,
    }
  )

  const clickLogin = async () => {
    if (!email) {
      toast.error("请输入邮箱")
      return
    }
    if (email.indexOf("@") === -1) {
      toast.error("请输入正确的邮箱")
      return
    }
    if (!password) {
      toast.error("请输入密码")
      return
    }

    const { data } = await loginRunAsync({ email, password })

    if (data?.type === "login") {
      toast.success("登陆成功")
      setAccessToken(data.accessToken)
      return
    }
    if (data?.type === "verify") {
      setStep("verify")
      return
    }
  }

  const exitLogin = () => {
    setStep("login")
    setAccessToken(undefined)
  }

  const clickVerify = async () => {
    const { data } = await verifyRunAsync({ email, token: verifyCode })
    setAccessToken(data.accessToken)
    toast.success("验证成功")
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col items-center h-full">
        {!!accessToken && (
          <>
            <div className="px-6 py-4">
              <div className="w-28 h-28 rounded-full bg-neutral p-2">
                <div className="avatar">
                  <div className="w-24 h-24">
                    <img src="/face-kiss.png" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              {profile?.data?.email}
              <button
                className="btn btn-neutral btn-xs ml-2 btn-outline"
                onClick={exitLogin}
              >
                退出登陆
              </button>
            </div>
            <div className="stats shadow">
              <div className="stat place-items-center">
                <div className="stat-title">今日调用次数</div>
                {getOverviewLoading ? (
                  <span className="loading loading-ring loading-sm"></span>
                ) : (
                  <div className="stat-value">{overview?.data?.usageCount}</div>
                )}
                <div className="stat-desc">调用 GPT 次数</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">今日消耗点数</div>
                {getOverviewLoading ? (
                  <span className="loading loading-ring loading-sm"></span>
                ) : (
                  <div className="stat-value">
                    {Number(overview?.data?.costPoints)?.toFixed(2)}
                  </div>
                )}
                <div className="stat-desc">保留两位小数</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">剩余点数</div>
                {getProfileLoading ? (
                  <span className="loading loading-ring loading-sm"></span>
                ) : (
                  <div className="stat-value">{profile?.data?.points}</div>
                )}
                <div className="stat-desc">1RMB = 10 点</div>
              </div>
            </div>
          </>
        )}
        {!!!accessToken && (
          <div className="hero">
            <div className="hero-content flex-col">
              <div className="text-center text-left">
                <h1 className="text-5xl font-bold">Login now!</h1>
                <p className="py-6">
                  一款多平台翻译软件，支持OCR识别翻译，并且内置GPT
                  翻译服务，努力成为您最好的办公助手！
                </p>
              </div>
              <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <div className="card-body">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="email"
                      className="input input-bordered"
                      disabled={step === "verify"}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {step === "login" && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        placeholder="password"
                        className="input input-bordered"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  )}
                  {step === "verify" && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">验证码</span>
                      </label>
                      <input
                        type="password"
                        placeholder="请输入邮箱收到的验证码"
                        className="input input-bordered"
                        required
                        onChange={(e) => setVerifyCode(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="form-control mt-6">
                    {step === "login" && (
                      <button className="btn btn-neutral" onClick={clickLogin}>
                        {loginLoading ? (
                          <span className="loading loading-spinner"></span>
                        ) : null}
                        登陆 / 注册
                      </button>
                    )}
                    {step === "verify" && (
                      <button
                        className="btn btn-neutral"
                        onClick={clickVerify}
                        disabled={!verifyCode}
                      >
                        {verifyLoading ? (
                          <span className="loading loading-spinner"></span>
                        ) : null}
                        验证邮箱
                      </button>
                    )}
                    <label className="label">
                      <p className="label-text-alt">首次登陆将会自动注册</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default User
