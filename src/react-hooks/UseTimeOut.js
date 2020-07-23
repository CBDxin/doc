function useTimeout(ms) {
  const [ready, setReady] = useState(false)
  const timerRef = useRef()

  const start = useCallback(() => {
    clearTimeout(timerRef.current)
    setReady(true)
    timerRef.current = setTimeout(() => {
      setReady(false)
    }, ms)
  }, [ms])

  const stop = useCallback(() => {
    clearTimeout(timerRef.current)
  }, [])

  useOnUnmount(stop)

  return [ready, start, stop]
}