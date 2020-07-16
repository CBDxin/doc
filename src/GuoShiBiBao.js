import React, { useEffect } from "react";

export default () => {
	useEffect(() => {
		function createIncrement(i) {
			let value = 0;
			function increment() {
				value += i;
        let message = `Current value is ${value}`;
        console.log('=====',message, value);
				return function logValue() {
          message = `${message} ${value}`
					console.log(message, value);
				};
      }

			return increment;
    }
    
    const inc = createIncrement(1);
    const log = inc();
    console.log(log)
    inc()();
    inc()();
    log();
  }, []);
  
  return(
    <div></div>
  )
};
