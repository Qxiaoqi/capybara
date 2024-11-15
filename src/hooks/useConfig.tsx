import { useCallback, useEffect } from "react"
import { listen, emit } from "@tauri-apps/api/event"
import { store } from "@/utils/store"
import { debounce } from "@/utils"
import { useGetState } from "./useGetState"

export const useConfig = (
  key: string,
  defaultValue: string,
  options: Record<string, any> = {}
) => {
  const [property, setPropertyState, getProperty] = useGetState(null)
  const { sync = true } = options

  // 同步到Store (State -> Store)
  const syncToStore = useCallback(
    debounce((v) => {
      store.set(key, v)
      store.save()
      emit(`${key}_changed`, v)
    }),
    []
  )

  // 同步到State (Store -> State)
  const syncToState = useCallback((v: any) => {
    if (v !== null) {
      setPropertyState(v)
    } else {
      store.get(key).then((v) => {
        if (v === null) {
          setPropertyState(defaultValue)
          store.set(key, defaultValue)
          store.save()
        } else {
          setPropertyState(v)
        }
      })
    }
  }, [])

  const setProperty = useCallback((v: any, forceSync = false) => {
    setPropertyState(v)
    const isSync = forceSync || sync
    isSync && syncToStore(v)
  }, [])

  // 初始化
  useEffect(() => {
    syncToState(null)
    if (key.includes("[")) return
    const unlisten = listen(`${key}_changed`, (e) => {
      syncToState(e.payload)
    })
    return () => {
      unlisten.then((f) => {
        f()
      })
    }
  }, [])

  return [property, setProperty, getProperty]
}
