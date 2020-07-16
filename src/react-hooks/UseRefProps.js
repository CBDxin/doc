import React, { useRef, useCallback, useState, useEffect } from "react";

const useRefProps = props => {
	const ref = useRef(props);
	ref.current = props;
	return ref;
};

let Child = props => {
	const propsRef = useRefProps(props);

	useEffect(() => {
		console.log("useEffect", props);
	});

	const handleClick = useCallback(() => {
		const { onClick } = propsRef.current;
		if (onClick) {
			onClick();
		}
		console.log("ref", propsRef.current);
		console.log("props", props);

		// props.onClick();
		// console.log(props);
	}, []);

	return (
		<>
			{props.a}
			{propsRef.current.a}
			<button onClick={handleClick}>Click</button>
		</>
	);
};

export default () => {
	let [a, setA] = useState(0);
	return (
		<>
			<Child a={a} onClick={() => setA(a => a + 1)}></Child>
		</>
	);
};
