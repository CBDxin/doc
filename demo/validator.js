import React, { useState } from 'react';
import { Input } from 'antd';


export default function useInput(props) {
  const { value, onChange } = props;

  const [_value, setValue] = useState(value);
  const [_errorMessage, setErrorMessage] = useState('');

  const _onChange = (e) => {
    const {errorMessage, validator} = props;
    const inputValue = e.target.value;
    setValue(inputValue);
    if(validator && !validator(inputValue)){
      setErrorMessage(errorMessage);
    }else{
      setErrorMessage('');
    }

    if(onChange){
      onChange(e);
    }
  }


  return (
    <div className={`validator-input ${_errorMessage ? "has-error" : ""}`}>
      <Input {...props} value={_value} onChange={_onChange} />
      {_errorMessage && <span className="error-message">{_errorMessage}</span>}
    </div>
  )
}