import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';

import { firebaseConfig } from './firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();


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

  function deleteTask(e){
    let ogInnerHTML = e.target.parentNode.innerHTML;
    let indexToCutTo = ogInnerHTML.indexOf("<button");
    let slicedInnerHTML = ogInnerHTML.slice(0, indexToCutTo);

    props.handleClick(slicedInnerHTML);
  }

  let arr = props.data;
  let listItems = arr.map(val => <li className="">{val}<button onClick={deleteTask}>X</button></li>);


  return <div className="list">

    <ul>{listItems}</ul>

  </div>

}

let mainOn = false;

function Main(){
  
  mainOn = true;


  let [tasks, setTasks] = useState([]);

  let docRef = firestore.collection("users").doc(auth.currentUser.uid);

  function setFirebaseValues(data){
    setTasks(data);
  }

  useEffect(() => {
    docRef.get().then(doc => {
      if(doc.exists){
        console.log("Exists!");
        docRef.get().then(data => setFirebaseValues(data.data().tasks));
      } else {
        docRef.set({tasks:[]});
        docRef.get().then(data => setFirebaseValues(data.data().tasks));
      }
    })
  },[mainOn])


  function addTasks(addition){
    setTasks([...tasks, addition])
    docRef.update({tasks:[...tasks, addition]})
  }

  function removeTasks(subtraction){
    let copiedArray = [...tasks];
    let indexToDelete = copiedArray.indexOf(subtraction);

    
    copiedArray.splice(indexToDelete, 1);
    docRef.update({tasks:copiedArray});
    setTasks(copiedArray);
  }
  

  return <div className="container">

    <h1>ToDo List</h1>

    <AddTaskForm handleSubmit={addTasks}/>
    <br />
    <TaskList data={tasks} handleClick={removeTasks}/>
    <br/>
    <SignOut/>

  </div>
  

}

function SignIn(){

  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }

  return <div id="signIn">
      <button onClick={signInWithGoogle}>Sign In With Google</button>
  </div>

}


function SignOut(){
  return auth.currentUser && (
      <button id="signOut" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function App(){

  const [user] = useAuthState(auth);

  return <div>
    {user ? <Main/> : <SignIn/>}
  </div>
}


let el = <App />

ReactDOM.render(el, document.getElementById('root'));
