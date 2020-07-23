function useActive(refEl) {
  const [value, setValue] = useState(false)
  useEffect(() => {
    const handleMouseDown = () => {
      setValue(true)
    }
    const handleMouseUp = () => {
      setValue(false)
    }

    // DOM 事件监听
    if (refEl && refEl.current) {
      refEl.current.addEventListener('mousedown', handleMouseDown)
      refEl.current.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      if (refEl && refEl.current) {
        refEl.current.removeEventListener('mousedown', handleMouseDown)
        refEl.current.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [])

  return value
}

function Demo() {
  const elRef = useRef(null)
  const active = useActive(inputRef)

  return (<div ref={elRef}>{active ? "Active" : "Nop"}</div>)
}