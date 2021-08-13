import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

import { firebaseConfig } from './firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';


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

  function crossOut(e){
    !e.target.className ? e.target.className = "crossOut" : e.target.className = "";
  }

  function deleteTask(e){
    let ogInnerHTML = e.target.parentNode.innerHTML;
    let indexToCutTo = ogInnerHTML.indexOf("<button");
    let slicedInnerHTML = ogInnerHTML.slice(0, indexToCutTo);

    props.handleClick(slicedInnerHTML);
  }

  let arr = props.data;
  let listItems = arr.map(val => <li className="" onClick={crossOut}>{val}<button onClick={deleteTask}>X</button></li>);


  return <div className="list">

    <ul>{listItems}</ul>

  </div>

}



function Main(){

  let [tasks, setTasks] = useState(JSON.parse(localStorage.getItem("tasks")) || []);

  localStorage.setItem("tasks", JSON.stringify(tasks));


  function addTasks(addition){
    setTasks([...tasks, addition])
  }

  function removeTasks(subtraction){
    let copiedArray = [...tasks];
    let indexToDelete = copiedArray.indexOf(subtraction);

    copiedArray.splice(indexToDelete, 1);
    setTasks(copiedArray);
  }
  

  return <div className="container">

    <h1>ToDo List</h1>

    <AddTaskForm handleSubmit={addTasks}/>
    <br />
    <TaskList data={tasks} handleClick={removeTasks}/>

  </div>

}


function App(){
  return <Main/>
}


let el = <App />

ReactDOM.render(el, document.getElementById('root'));
