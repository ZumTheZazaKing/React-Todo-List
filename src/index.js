import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';


function AddTaskForm(props){

  let [value, setValue] = useState("");

  function handleChange(e){

    setValue(e.target.value);

  }

  return <div className="form">

    <form onSubmit={e => {props.handleSubmit(value); setValue(""); e.preventDefault()}}>

      <input type="text" value={value} onChange={handleChange} required/>
      <input type="submit" value="+"/>

    </form>

  </div>

}


function TaskList(props){

  let arr = props.data;
  let listItems = arr.map(val => <li>{val}</li>)

  return <div className="list">

    <ul>{listItems}</ul>

  </div>

}



function App(){

  let [tasks, setTasks] = useState([]);


  function changeTasks(addition){

    setTasks([...tasks, addition])

  }

  return <div className="container">

    <h1>ToDo List</h1>

    <AddTaskForm handleSubmit={changeTasks}/>
    <br />
    <TaskList data={tasks}/>

  </div>

}


let el = <App />

ReactDOM.render(el, document.getElementById('root'));

export default 'style';
