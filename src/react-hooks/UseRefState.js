import React, { useState, useRef, useCallback } from "react";

let useRefState = initalState => {
	const ins = useRef();

	const [state, setState] = useState(() => {
		const value = typeof initalState === "function" ? initalState() : initalState;
		ins.current = value;
		return value;
	});

	const setValue = useCallback(value => {
		if (typeof value === "function") {
			setState(prev => {
				const finalValue = value(prev);
				ins.current = finalValue;
				return finalValue;
			});
		} else {
			ins.current = value;
			setState(value);
		}
	}, []);

	return [ins, setValue];
};

export default function Counter(){
  const [count, setCount] = useRefState(0);
  const handleIncr = useCallback(()=>{
    setCount(count.current + 1);//可持续更新
  }, []);

  const handleAlert = ()=>{
    setTimeout(()=>{
      alert(count.current)
    }, 5000)
  }

  return (
    <div>
      count：{count.current}
      <button onClick={handleIncr}>+</button>
      <button onClick={handleAlert}> 5秒弹出count值 </button>
    </div>
  )
}
