import React, { Component } from 'react';
import './profile.css';
import Profile_UserInfo from '../page_parts/Profile_UserInfo';
import Profile_Upload from '../page_parts/Profile_Upload';
import Profile_Password from '../page_parts/Profile_Password';
import {Breadcrumb} from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import Controller from '../Controller';

class Profile extends Component {

    componentDidMount(){

        
    }

    render() {
        let profile_title = "اطلاعات دانش آموزی خود را کامل کنید";
        if(Controller.is_profile_completed){
            profile_title = "اطلاعات شخصی";
        }
        return (
            <div id="profile">
                
                <div id="profile_title">{profile_title}</div>

                <div className="Breadcrumb_con">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                        <Breadcrumb.Item>{"صفحه پروفایل"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div id="profile_holder">
                    
                    <Profile_UserInfo title="اطلاعات تکمیلی" complete={false}/>

                    <div style={{height:"2rem", width:"10rem"}}/>

                    <Profile_Upload  title="ارسال مدارک" complete={false}/>

                    <div style={{height:"2rem", width:"10rem"}}/>

                    <Profile_Password  title="تغییر رمز عبور"/>

                    <div style={{height:"2rem", width:"10rem"}}/>
                    
                </div>
                
            </div>
        )
    }
}

export default Profile
