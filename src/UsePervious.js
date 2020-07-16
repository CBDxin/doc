import React, { useEffect, useRef, useState, useReducer } from "react";

const usePrevious = value => {
  const ref = useRef();
  // let [x, setX] = useState();

  //useEffect会在完成本次渲染结束后才触发
	useEffect(() => {
    console.log("useEffect",value);
    
    // setX(value);
    ref.current = value;
	});

  // return x;
  return ref.current;
};

export default () => {
	let [x, setX] = useState(0);
  let preX = usePrevious(x);
  console.log("prex", preX)

  //与下面代码等价
  // const ref = useRef();
	// useEffect(() => {
  //   console.log("useEffect",x);
    
  //   // setX(value);
  //   ref.current = x;
  // });
  // let preX = ref.current

	return (
		<>
			<div>pre:{preX}</div>
			<div>now:{x}</div>
      <button onClick={()=>setX(x+1)}>+</button>
		</>
	);
};
