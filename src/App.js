import React, { Component } from 'react';
import {BrowserRouter, Switch,Redirect, Route} from 'react-router-dom';
import './App.css';
import Header from './page_parts/Header';
import Dashboard from './pages/Dashboard';
import 'antd/dist/antd.css';
import { Button, notification } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Controller from './Controller';
import Server from './Server';
import cookie from './scripts/cookie';

class App extends Component{

  componentDidMount(){
    //cookie.setCookie("_ca", "e6a0b9906d8aa959c41c6a0c4976636b", 1)

    Controller.openNotification = openNotification;

    if(window.innerWidth > 1400){
      let rem = ((window.innerWidth * 16) / 1200 );
      document.getElementsByTagName("html")[0].style.fontSize = `${rem}px`;
    }else if(window.innerWidth < 330){
      document.getElementsByTagName("html")[0].style.fontSize = `${12}px`;
    }else if(window.innerWidth < 400){
      document.getElementsByTagName("html")[0].style.fontSize = `${14}px`;
    }

    window.addEventListener("resize", (e)=>{
        if(window.innerWidth > 1400){
            let rem = ((window.innerWidth * 16) / 1200 );
            document.getElementsByTagName("html")[0].style.fontSize = `${rem}px`;
        }else if(window.innerWidth < 330){
          document.getElementsByTagName("html")[0].style.fontSize = `${12}px`;
        }else if(window.innerWidth < 400){
          document.getElementsByTagName("html")[0].style.fontSize = `${14}px`;
        }else{
          document.getElementsByTagName("html")[0].style.fontSize = `${16}px`;
        }
    });
  }

  render(){

    //if(window.location.href == Server.domain+"/"){window.location.href = "/profile"}
    return (
      <div className="App">
        <BrowserRouter>
          
          <Switch>

            <Route exact path='/'>
              <Header/>
              <Dashboard/>
            </Route>

          </Switch>

        </BrowserRouter>

      </div>
    );
  }
}


export default App;

/**
 * 
 * @param {String} title 
 * @param {String} description 
 * @param {["error"|"success"|"alert"]} icon
 */
const openNotification = (title, description, icon) => {
  if(icon=="error"){icon=<ExclamationCircleOutlined style={{ color: '#ff0800' }}/>}
  if(icon=="success"){icon=<CheckCircleOutlined style={{ color: '#00c957' }}/>}
  if(icon=="alert"){icon=<ExclamationCircleOutlined style={{ color: '#ffbb00' }}/>}
  notification.open({
    message: title,
    duration:5,
    description,
    icon,
  });
};