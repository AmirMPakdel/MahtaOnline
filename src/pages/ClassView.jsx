import React, { Component } from 'react';
import './classView.css'
import Server from '../Server';

export default class ClassView extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <div className="classView_con">

                <div className="classView_title">{"کلاس عربی دوازدهم"}</div>
                
                <GoStream/>

                <ClassInfoSec/>

                <SessionSec/>

                <TestsSec/>
                
            </div>
        )
    }
}

function GoStream(props){
    return(
        <div className="goStream_con">
            <div className="streams_alert_card_con">
                <div className="streams_alert_lable"/>
                <div className="streams_alert_text">{tx}</div>
            </div>
            <div className="goStream_btn">{"ورود به کلاس"}</div>
        </div>
    )
}
const tx = `کلاس در حال برگزاری می‌باشد`

function ClassInfoSec(props){
    let {title, teacher, launch_date_year, launch_date_month, launch_date_day, online_day,
        start_hour, start_min, finish_hour, finish_min} = {teacher:{}};
    return(
        <div className="ClassInfoSec_con">

            <div className="ClassViewInfo_header_img" style={{backgroundImage:`url(${Server.img_png("view_course_card")})`}}/>

            <div className="ClassViewInfo_header_sec1">

                <div className="ClassViewInfo_header_sec2">
                    <img className="ClassViewInfo_header_icon" src={Server.img_png("class_info_title")}/>
                    {title}
                </div>

                <div className="ClassViewInfo_header_sec2">
                    <img className="ClassViewInfo_header_icon" src={Server.img_png("class_info_teacher")}/>
                    {"استاد "+teacher.first_name + " "+ teacher.last_name}
                </div>

                <div className="classInfo_header_sec2">
                    <img className="classInfo_header_icon" src={Server.img_png("class_info_time")}/>
                    {online_day+" ها از ساعت "+ start_hour+":"+start_min+" تا "+finish_hour+":"+finish_min}
                </div>
            </div>

        </div>
    )
}

class SessionSec extends Component{

    render(){
        let list = [{},{},{},];
    return(
        <div className="session_sec_con">

            <div className="classView_sec_title">{"جلسات دوره"}</div>
            <div className="classView_under_title_line"/>

            {
                
                list.map((v,i)=>{
                    return(
                        <SessionRow index={i} listLength={list.length}/>
                    )
                })
            }

        </div>
    )
    }
}

class SessionRow extends Component{

    state={opened:false}

    componentDidMount(){

    }

    onSelect=()=>{
        if(this.state.opened){
            this.state.opened = false;
            this.content.style.height = 0;
        }else{
            this.state.opened = true;
            this.content.style.height = this.wrapper.clientHeight+20+"px";
        }
    }

    render(){
        let line_s = {};
    if(this.props.index == 0){
        line_s={top:"1rem"}
    }else if(this.props.index == this.props.listLength-1){
        line_s={bottom:"1rem"}
    }
    return(
        <div className="session_row_con">
            <div className="session_row_right_sec">
                <div className="session_right_line" style={line_s}/>
                <div className="session_right_fill"/>
            </div>
            <div className="session_row_left_sec">
                <div className="session_row_info_con" onClick={this.onSelect}>
                    <img className="session_lock" src={Server.img_png("lock")}/>
                    <div className="session_row_name">
                        {"مشاهده "+"جلسه اول"}
                        <div className="session_row_name_sub">{"(درحال برگزاری)"}</div>
                    </div>
                    <div className="session_row_date">
                        {"1399/02/16"}
                        <img className="session_row_img" src={Server.img_png("event")}/>
                    </div>
                </div>
                <div className="session_content_con" ref={r=>this.content=r}>
                    <div ref={r=>r=this.wrapper=r}>
                        <div className="session_content_video">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
}

class TestsSec extends Component{

    render(){
        let list = [{},{},{},];
    return(
        <div className="session_sec_con">

            <div className="classView_sec_title">{"آزمون های دوره"}</div>
            <div className="classView_under_title_line"/>

            {
                
                list.map((v,i)=>{
                    return(
                        <TestRow index={i} listLength={list.length}/>
                    )
                })
            }

        </div>
    )
    }
}

class TestRow extends Component{

    componentDidMount(){

    }

    render(){
        let line_s = {};
    if(this.props.index == 0){
        line_s={top:"1rem"}
    }else if(this.props.index == this.props.listLength-1){
        line_s={bottom:"1rem"}
    }
    return(
        <div className="session_row_con">
            <div className="session_row_right_sec">
                <div className="session_right_line" style={line_s}/>
                <div className="session_right_fill"/>
            </div>
            <div className="session_row_left_sec">
                <div className="session_row_info_con">
                    <img className="session_lock" src={Server.img_png("lock")}/>
                    <div className="session_row_name">
                        {"آزمون اول"}
                        <div className="session_row_name_sub">{"(درحال برگزاری)"}</div>
                    </div>
                    <div className="session_row_holder">
                        <div className="session_row_date">
                            {"1399/02/16"}
                            <img className="session_row_img" src={Server.img_png("time")}/>
                        </div>
                        <div className="session_row_holder_space"/>
                        <div className="session_row_date">
                            {"1399/02/16"}
                            <img className="session_row_img" src={Server.img_png("event")}/>
                        </div>
                    </div>
                    
                </div>
                <div className="session_content_con">
                    <div ref={r=>r=this.wrapper=r}>
                        <div className="session_content_video">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )}
}