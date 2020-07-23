function useDebounce(fn, args, ms = 100, skipMount) {
  const mounted = useRef(false)
  useEffect(() => {
    // 跳过挂载执行
    if (skipMount && !mounted.current) {
      mounted.current = true
      return undefined
    }

    const timer = setTimeout(fn, ms)

    return () => {
      // 如果args变化，先清除计时器
      clearTimeout(timer)
    }
  }, args)
}

// -----------
// EXAMPLE
// -----------
const returnEmptyArray = () => []
function Demo() {
  const [query, setQuery] = useState('')
  const [list, setList] = useState(returnEmptyArray)

  // 搜索
  const handleSearch = async () => {
    setList(await fetchList(query))
  }

  // 当query变化时执行搜索
  useDebounce(handleSearch, [query], 500)

  return (<div>
    <SearchBar value={query} onChange={setQuery} />
    <Result list={list}></Result>
  </div>)
}
