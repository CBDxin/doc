import React, { useState, useRef, useCallback, useReducer, useEffect } from "react";

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

	return [state, setValue, ins];
};

export default function Counter(){
  const [count, setCount, countRef] = useRefState(0);
  const handleIncr = useCallback(()=>{
    setCount(countRef.current + 1);//可持续更新
    //setCount(count + 1)//闭包问题只更新一次
  }, []);

  useEffect(()=>{
    console.log(count)
    return()=>{
      //setCount(countRef.current)
    }
  }, [])

  // useEffect(()=>{
  //   console.log(count)
  // }) 

  return (
    <div>
      {count}
      <button onClick={handleIncr}>+</button>
    </div>
  )
}
