import React, { useState, useCallback } from "react";

//模拟setState

const useSetState = initalState => {
	const [_state, _setState] = useState(initalState);
	const setState = useCallback(state => {
		_setState(prev => {
			let nextState = state;
			if (typeof state === "function") {
				//相当于接收回调函数
				nextState = state(prev);
			}

			return { ...prev, ...nextState };
		});
	}, []);

	return [_state, setState];
};

export default () => {
	const [state, setState] = useSetState({ age: 0, name: "春花" });

	const incrementAge = () => {
		setState(prev => ({ age: prev.age + 1 }));
	};

	return (
		<>
			<div onClick={incrementAge}>
				{state.age}
				{state.name}
			</div>
		</>
	);
};
