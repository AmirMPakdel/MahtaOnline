import React, { Component } from 'react';
import {Collapse, Input, Dropdown,Form, Button, Menu, List} from 'antd';
import Server from '../Server';
import {InputValidator, ValidErrors} from '../scripts/Validator';
import {DatePicker} from '../library/react-persian-datepicker-master';
import './profile_UserInfo.css';
import Controller from '../Controller';
import {getCookie} from '../scripts/cookie';

class Profile_UserInfo extends Component {

    state={
        user_data:{},
        signinLoading:false,
        first_name_stat:"", last_name_stat:"", email_stat:"",
        password_stat:"", re_password_stat:"",
        selectedGrade:{id:undefined, title:undefined},
        selectedField:{id:undefined, title:undefined},
        selectedGender:{id:undefined, title:undefined},
        gradeList:[], genderList:[], fieldList:[]
    }

    componentDidMount(){
        
        Controller.getConsts((consts)=>{
            let token = getCookie("_ca");
            this.state.genderList = consts.gender_list;
            this.state.fieldList = consts.field_list;
            this.state.gradeList = consts.grade_list;
            Server.post_request(Server.urls.GET_PROFILE, {token}, (res)=>{
                let data = res.data;
                this.state.user_data = data;
                this.state.selectedField = data.field;
                this.state.selectedGrade = data.grade;
                data.gender?this.state.selectedGender = {id:1,title:"پسر"}: 
                this.state.selectedGender = {id:0,title:"دختر"};
                this.setState(this.state);
            });
        });
    }

    onFirstName = (e)=>{
        this.state.user_data.first_name = e.target.value;
        if(InputValidator.valid_name(e.target.value)){
            this.state.first_name_stat = "valid";
        }else{
            this.state.first_name_stat = "error";
        }
        this.setState(this.state);
    }

    onLastName = (e)=>{
        this.state.user_data.last_name = e.target.value;
        if(InputValidator.valid_name(e.target.value)){
            this.state.last_name_stat = "valid";
        }else{
            this.state.last_name_stat = "error";
        }
        this.setState(this.state);
    }

    onEmail = (e)=>{
        this.state.user_data.email = e.target.value;
        this.setState(this.state);
    }

    onGrade = (s)=>{
        this.state.user_data.grade = s.id;
        this.state.selectedGrade = s;
        this.setState(this.state);
    }

    onField = (s)=>{
        this.state.user_data.field = s.id;
        this.state.selectedField = s;
        this.setState(this.state);
    }

    onGender = (s)=>{
        this.state.user_data.gender = s.key;
        this.state.selectedGender = s;
        this.setState(this.state);
    }

    onBirthdate = (v)=>{
        this.state.user_data.birthdate = v;
        this.setState(this.state);
    }

    onAddress = (e)=>{
        this.state.user_data.address = e.target.value;
        this.setState(this.state);
    }

    onHomePhone = (e)=>{
        this.state.user_data.home_number = e.target.value;
        this.setState(this.state);
    }

    onParentPhone = (e)=>{
        this.state.user_data.parent_phone_number = e.target.value;
        this.setState(this.state);
    }

    validate = ()=>{

        let {first_name, last_name, email, address, home_number, parent_phone_number} = this.state.user_data;
        let gender = this.state.selectedGender;
        let field = this.state.selectedField;
        let grade = this.state.selectedGrade;

        let data = {};
        let valid = true;
        if(!InputValidator.valid_name(first_name)){
            Controller.openNotification(ValidErrors.first_name.title, ValidErrors.first_name.info, "error")
            valid=false;
        }else{data.first_name = first_name}

        if(!InputValidator.valid_name(last_name)){
            Controller.openNotification(ValidErrors.last_name.title, ValidErrors.last_name.info, "error")
            valid=false;
        }else{data.last_name = last_name}

        if(gender.id != 1 && gender.id != 0){
            Controller.openNotification(ValidErrors.gender.title, ValidErrors.gender.info, "error")
            valid=false;
        }else{data.gender = gender.id}

        if(!InputValidator.valid_selection(field, this.state.fieldList)){
            Controller.openNotification(ValidErrors.field.title, ValidErrors.field.info, "error")
            valid=false;
        }else{data.field_id = field.id}

        if(!InputValidator.valid_selection(grade, this.state.gradeList)){
            Controller.openNotification(ValidErrors.grade.title, ValidErrors.grade.info, "error")
            valid=false;
        }else{data.grade_id = grade.id}

        data.email = email;
        data.address = address;
        data.home_number = home_number;
        data.parent_phone_number = parent_phone_number;

        if(valid){this.complete(data)}
    }

    complete = (data)=>{

        data.token = getCookie("_ca");
        Server.post_request(Server.urls.SET_PROFILE, data, (res)=>{
            if(res.result_code == 1000){
                Controller.openNotification("تغییرات با موفقیت انجام شد", null, "success")
            }
        });
    }

    render(){
    return(
        <Collapse bordered defaultActiveKey={['1']} className="user_info_header_con">
            <Collapse.Panel header={<Header complete={this.props.complete} title="اطلاعات تکمیلی"/>} key="1">
                
                <Form.Item hasFeedback  validateStatus={this.state.first_name_stat}>
                    <Input placeholder="نام" onChange={this.onFirstName} 
                    value={this.state.user_data.first_name} className="user_info_input"/>
                </Form.Item>
                
                <Form.Item hasFeedback  validateStatus={this.state.last_name_stat}>
                    <Input placeholder="نام خانوادگی" onChange={this.onLastName} 
                    value={this.state.user_data.last_name} className="user_info_input"/>
                </Form.Item>
                
                <Form.Item hasFeedback  validateStatus={this.state.email_stat}>
                    <Input placeholder="ایمیل" onChange={this.onEmail} 
                    value={this.state.user_data.email}className="user_info_input"/>
                </Form.Item>

                <Register_dropdown selected={this.state.selectedGrade} list={this.state.gradeList}
                title="پایه" onSelect={this.onGrade}/>

                <Register_dropdown selected={this.state.selectedField} list={this.state.fieldList}
                title="رشته" onSelect={this.onField}/>

                <Register_dropdown selected={this.state.selectedGender} list={this.state.genderList}
                title="جنسیت" onSelect={this.onGender}/>

                {/* <DatePicker className="profile_datapicker_input" placeholder="تاریخ تولد"
                value={this.state.user_data.} getDate={this.onBirthdate}/> */}

                <Form.Item hasFeedback  validateStatus={this.state.address_stat}>
                    <Input placeholder="آدرس منزل" onChange={this.onAddress} 
                    value={this.state.user_data.address} className="user_info_input"/>
                </Form.Item>

                <Form.Item hasFeedback  validateStatus={this.state.email_stat}>
                    <Input placeholder="شماره تلفن ثابت" onChange={this.onHomePhone} 
                    value={this.state.user_data.home_number} className="user_info_input"/>
                </Form.Item>

                <Form.Item hasFeedback  validateStatus={this.state.email_stat}>
                    <Input placeholder={"(..."+"شماره همراه ناظر تحصیلی (پدر یا مادر یا"} 
                    onChange={this.onParentPhone} value={this.state.user_data.parent_phone_number} className="user_info_input"/>
                </Form.Item>

                <Button type="primary" className="user_info_button" onClick={this.validate}
                    loading={this.state.signinLoading}>{"تکمیل ثبت نام"}</Button>
            
            </Collapse.Panel>
        </Collapse>
    )}
}

function Header(props){
    let header_img = "alert";
    if(props.complete){header_img="done"};
    return(
        <div className="profile_sec_header_con">
            <div/>
            <div className="profile_sec_header_title_con">
                <div className="profile_sec_header_title">{props.title}</div>
                <div className="profile_sec_header_line"/>
            </div>
            {/* <img className="profile_sec_header_img" src={Server.img_png(header_img)}/> */}
            <img className="profile_sec_header_img"/>
        </div>
    )
}

function Register_dropdown(props){

    /**
     * @param {Array} props.list
     */
    let menu = (
        <Menu style={{borderRadius:"0rem 0rem 1rem 1rem"}}>
            {props.list.map((v, i)=>{
                return(<Menu.Item className="register_dropdown_item" key={`${i}`} 
                onClick={()=>{props.onSelect(v)}}>{v.title}</Menu.Item>)
            })}
        </Menu>
    )

    let selected = props.selected;
    if(!selected){
        selected = {}
    }
    
    return(
        <Dropdown overlay={menu} trigger={['click']}>
            <div className="profile_dropdown">
                {selected.title || props.title}
                <img style={{height:'12px', alignSelf:'center'}} src={Server.img_png("dropdown_icon")}/>
            </div>
            
        </Dropdown>
    )
}

export default Profile_UserInfo
