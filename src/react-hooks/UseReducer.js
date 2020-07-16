import React, { useReducer } from "react";

const initalState = { number: 0 };

const reducer = (state, action) => {
	switch (action.type) {
		case "add":
      return { number: state.number + 1 };
		case "sub":
			return { number: state.number - 1 };
		default:
			throw new Error();
	}
};

export default () => {
  const [state, dispatch] = useReducer(reducer, initalState);
  console.log(state);

	return (
		<>
			<div>
				{state.number}
				<button onClick={()=>dispatch({type:"add"})}>+</button>
				<button onClick={()=>dispatch({type:"sub"})}>-</button>
			</div>
		</>
	);
};
