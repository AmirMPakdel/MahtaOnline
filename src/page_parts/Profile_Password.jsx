import React, { Component } from 'react'
import './profile_Password.css';
import {Collapse, Input, Form, Button} from 'antd';
import Server from '../Server';
import {InputValidator} from '../scripts/Validator';
import Controller from '../Controller';
import { getCookie } from '../scripts/cookie';

class Profile_Password extends Component {
    state={signinLoading:false, can_continue:false,
        current_password_stat:"",password_stat:"", re_password_stat:"",}

    current_password = "";
    password = "";
    re_password = "";

    onCurrentPassword = (e)=>{
        this.current_password = e.target.value;
        if(InputValidator.valid_password(this.current_password)){
            this.state.current_password_stat = "valid";
        }else{
            this.state.current_password_stat = "error";
        }
        this.check_continue();
        this.setState(this.state);
    }

    onPassword = (e)=>{
        this.password = e.target.value;
        if(InputValidator.valid_password(this.password)){
            this.state.password_stat = "valid";
        }else{
            this.state.password_stat = "error";
        }
        if(this.re_password == this.password){
            this.state.re_password_stat = "valid";
        }else{
            this.state.re_password_stat = "error";
        }
        if(!this.re_password){this.state.re_password_stat = ""}
        this.check_continue();
        this.setState(this.state);
    }

    onRePassword = (e)=>{
        this.re_password = e.target.value;
        if(this.re_password == this.password){
            this.state.re_password_stat = "valid";
        }else{
            this.state.re_password_stat = "error";
        }
        this.check_continue();
        this.setState(this.state);
    }

    check_continue = ()=>{
        if(this.state.current_password_stat != "valid")return;
        if(this.state.password_stat != "valid")return;
        if(this.state.re_password_stat != "valid")return;
        this.state.can_continue = true;
    }

    complete = ()=>{

        let data = {old_password:this.current_password, new_password:this.password}
        data.token = getCookie("_ca");

        Server.post_request(Server.urls.CHANGE_PASSWORD, data, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                Controller.openNotification("رمز عبور با موفقیت تغییر کرد", null, "success");
            }else{
                Controller.openNotification("رمز عبور اشتباه است", null, "error");
            }
        });
    }

    render() {
        return (
        <Collapse bordered defaultActiveKey={['1']} className="user_info_header_con">
            <Collapse.Panel header={<Header title={this.props.title}/>} key="1">

                <Form.Item hasFeedback  validateStatus={this.state.current_password_stat}>
                    <Input placeholder="رمز عبور فعلی" onChange={this.onCurrentPassword} className="user_info_input"/>
                </Form.Item>
                
                <Form.Item hasFeedback  validateStatus={this.state.password_stat}>
                    <Input placeholder="رمز عبور" onChange={this.onPassword} className="user_info_input"/>
                </Form.Item>
                
                <Form.Item hasFeedback  validateStatus={this.state.re_password_stat}>
                    <Input placeholder="تکرار رمز عبور" onChange={this.onRePassword} className="user_info_input"/>
                </Form.Item>

                <Button type="primary" className="user_info_button" onClick={this.complete}
                    loading={this.state.signinLoading} disabled={!this.state.can_continue}>{"تغییر رمز عبور"}</Button>
            
            </Collapse.Panel>
        </Collapse>
    )}
}

function Header(props){
    return(
        <div className="profile_sec_header_con">
            <div/>
            <div className="profile_sec_header_title_con">
                <div className="profile_sec_header_title">{props.title}</div>
                <div className="profile_sec_header_line"/>
            </div>
            <div className="profile_sec_header_img"/>
        </div>
    )
}

export default Profile_Password
