import { getVersion, getName } from "@tauri-apps/api/app"
import { useState, useEffect } from "react"

const useAppInfo = () => {
  const [appVersion, setAppVersion] = useState<string>()
  const [appName, setAppName] = useState<string>()

  useEffect(() => {
    const fetch = async () => {
      try {
        const version = await getVersion()
        const name = await getName()
        setAppVersion(version)
        setAppName(name)
      } catch (error) {}
    }

    fetch()
  }, [])

  return {
    name: appName,
    version: appVersion,
  }
}

export default useAppInfo
