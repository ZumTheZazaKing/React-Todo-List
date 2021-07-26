import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';


function App(){
  return <div>
    <h1>Hello!</h1>
  </div>
}


let el = <App />

ReactDOM.render(el, document.getElementById('root'));

export default 'style';
