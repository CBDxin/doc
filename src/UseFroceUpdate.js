import React, { useCallback, useEffect, useState } from 'react';

export let useForceUpdate = ()=>{
  const [x, setX] = useState(0);
  return useCallback(()=>{
    setX(x=>(x+1) % (Number.MAX_SAFE_INTEGER - 1 ));
  }, [])
}

export default ()=>{
  useEffect(()=>{
    console.log("update")
  })

  return(
    <div onClick={useForceUpdate()}>
      点我
    </div>
  )
}