import React, { Component } from 'react';
import {BrowserRouter, Switch,Redirect, Route} from 'react-router-dom';
import './App.css';
import Header from './page_parts/Header';
import Dashboard from './pages/Dashboard';
import 'antd/dist/antd.css';
import { Button, notification, Modal } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Controller from './Controller';
import Server from './Server';
import { addFonts } from './Fonts';
import TransactionResult from './pages/TransactionResult';
import ScoreSheet from './pages/ScoreSheet';

class App extends Component{

  state={
    alert_modal_visible:false,
    alert_modal_info:"",
  }

  componentDidMount(){
    addFonts();
    Controller.openAlertModal = this.openAlertModal;
    Controller.openNotification = openNotification;

    if(window.innerWidth > 1400){
      let rem = ((window.innerWidth * 16) / 1366 );
      document.getElementsByTagName("html")[0].style.fontSize = `${rem}px`;
    }else if(window.innerWidth < 330){
      document.getElementsByTagName("html")[0].style.fontSize = `${12}px`;
    }else if(window.innerWidth < 400){
      document.getElementsByTagName("html")[0].style.fontSize = `${14}px`;
    }

    window.addEventListener("resize", (e)=>{
        if(window.innerWidth > 1400){
            let rem = ((window.innerWidth * 16) / 1366 );
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

  openAlertModal = (info)=>{
    this.setState({alert_modal_info:info, alert_modal_visible:true});
  }

  render(){

    //if(window.location.href == Server.domain+"/"){window.location.href = "/profile"}
    return (
      <div className="App">
        <BrowserRouter>
          <Route exact path={["/","/dashboard","/dashboard/:page"]}>
            <Header/>
            <Dashboard/>
          </Route>
          <Route path="/dashboard/:id/transaction">
            <TransactionResult/>
          </Route>
        </BrowserRouter>

        <Modal title={"توجه"} visible={this.state.alert_modal_visible} footer={null}
        onCancel={()=>{this.setState({alert_modal_visible:false})}}>

          <div className="stream_info_text" style={{direction:"rtl", marginTop:"1rem", fontSize:"1.2rem", color:"#333"}}>
              {this.state.alert_modal_info}</div>
          <div title="ادامه" style={{height:"2.6rem", width:"6rem", backgroundColor:"#0091EA", marginTop:"0.5rem",cursor:"pointer",
          borderRadius:"0.5rem", color:"white", display:"flex",alignItems:"center", justifyContent:"center"}}
          onClick={()=>{this.setState({alert_modal_visible:false})}}>{"ادامه"}</div>
        </Modal>
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