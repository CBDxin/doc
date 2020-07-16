import React, { useRef, useEffect } from "react";
import {useForceUpdate} from "./UseFroceUpdate";

function isFunction(x) {
	return typeof x === "function";
}

const useInstance = inital => {
	const instance = useRef();
	if (instance.current == null) {
		if (inital) {
			instance.current = isFunction(inital) ? inital() : inital;
		} else {
			instance.current = {};
		}
	}

	return instance.current;
};

export default () => {
	const inst = useInstance({ count: 1 });
	const update = useForceUpdate();
	useEffect(() => {
		const timer = setInterval(() => {
      //会更改，但不会触发渲染
			inst.count++;
    }, 1000);
    
    return ()=>{
      clearInterval(timer);
    }
  }, []);
  
  return(
    <>
      <div>
        {inst.count}
        <button onClick={update}>update</button>
      </div>
    </>
  )
};
