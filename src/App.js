import React, { useState, memo, useMemo, useCallback, useLayoutEffect, useEffect } from "react";

let i = 0;

let SubCounter = ({ onClick, data }) => {
	console.log("sub render");
	return <button onClick={onClick}>{data.number}</button>;
};

SubCounter = memo(SubCounter);

let useWinSize = () => {
	const [size, setSize] = useState({
		width: document.documentElement.clientWidth,
		height: document.documentElement.clientHeight,
	});

	const onResize = useCallback(() => {
		setSize({
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight,
		});
		console.log(i++);
	}, []);

	useEffect(() => {
		window.addEventListener("resize", onResize);
		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	console.log(size);

	return size;
};

export default function App() {
	console.log("app render");
	const [name, setName] = useState("计数器");
	const [number, setNumber] = useState(0);
	const data = useMemo(() => ({ number, name }), [number, name]);
	const add = useCallback(() => {
		setNumber(number + 1);
	}, [number]);
	const nothing = () => {
		setNumber(number);
	};

	useEffect(()=>{
		console.log("effect", number);
	}, [name]);

	const size = useWinSize();

	return (
		<div>
			<input type="text" value={name} onChange={e => setName(e.target.value)} />
			<SubCounter data={data} onClick={add}></SubCounter>
			
		</div>
	);
}
