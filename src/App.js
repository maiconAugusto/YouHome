import React from 'react';
import Routers from './Router'
import axios from 'axios'
import firebase from 'firebase'

axios.defaults.baseURL = '"https://home-1570137133716.firebaseio.com"'

class App extends React.Component{
  componentDidMount(){
    var firebaseConfig = {
      apiKey: "AIzaSyCEFDiWxkBQOdpBhEUXuaoNNflWbUnYwYE",
      authDomain: "home-1570137133716.firebaseapp.com",
      databaseURL: "https://home-1570137133716.firebaseio.com",
      projectId: "home-1570137133716",
      storageBucket: "home-1570137133716.appspot.com",
      messagingSenderId: "263302751785",
      appId: "1:263302751785:web:c5404628ec07339e131e38"
    };
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
  }
  render(){
    return (
      <Routers/>
    );
  }
}
export default App;

