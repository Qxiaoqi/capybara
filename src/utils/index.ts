export const debounce = (fn: (...args: any[]) => void, delay = 500) => {
  let timer: NodeJS.Timeout | null = null
  return (...args: any[]) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
