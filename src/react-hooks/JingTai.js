import React, { useEffect, useState } from "react";

//竟态

export default function () {
	const [time, setTime] = useState(5);
	const [data, setData] = useState("");

	useEffect(() => {
		let didCancel = false;

		async function fetchData() {
			setTimeout(() => {
				if (!didCancel) {
					setData(time);
				}
			}, time * 1000);
		}

		fetchData();

		return () => {
			console.log("over" + time);
			didCancel = true; 
		};
	}, [time]);

	return (
		<>
			{data}
			<button onClick={() => setTime(1)}>click</button>
		</>
	);
}
