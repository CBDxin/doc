import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './react-hooks/AMap';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

function useTitle(t) {
  useEffect(() => {
    document.title = t
  }, [t])
}

// --------
// EXAMPLE
// --------
function Demo(props) {
  useTitle(props.isEdit ? '编辑' : '新增')
  // ....
}

