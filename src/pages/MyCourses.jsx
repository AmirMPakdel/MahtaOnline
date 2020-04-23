import React, { Component } from 'react';
import './myCourses.css';
import { Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import Server from '../Server';

class MyCourses extends Component {
    state = {
        list : [{}],
    }

    render() {
        return (
            <div id="mycourses">
                <div id="mycourses_title">{"درس های من"}</div>

                <div className="Breadcrumb_con">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                        <Breadcrumb.Item>{"درس های من"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                {
                    this.state.list.length?
                    <React.Fragment>
                        
                        <DailyCourses/>
                        <div className="myclass_list_holder">

                            <PlanCard title="فیزیک"/>
                            <PlanCard title="فیزیک"/>
                            <PlanCard title="فیزیک"/>
                            <PlanCard title="فیزیک"/>

                        </div>

                    </React.Fragment>:
                    <div id="mycourses_holder">

                        <div className="mycourses_alert_card_con">
                            <div className="mycourses_alert_lable"/>
                            <div className="mycourses_alert_text">{tx}</div>
                        </div>

                    </div>
                    
                }
                
            </div>
        )
    }
}

export default MyCourses

const tx = `شما در هیچ دوره ای ثبت نام نکرده اید`

class DailyCourses extends Component{

    state={
        fill_per:17.55, // + 10.3
        day_per:10.2, // + 10.3
        days:["شنبه","یکشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه"],
        currentDay:0,
    }

    next_day=()=>{

        if(this.state.currentDay != 6){
            this.state.currentDay += 1;
            this.state.fill_per += 10.3
            this.state.day_per += 10.3;
            this.setState(this.state);
        }
    }

    prev_day=()=>{
        if(this.state.currentDay != 0){
            this.state.currentDay -= 1;
            this.state.fill_per -= 10.3
            this.state.day_per -= 10.3;
            this.setState(this.state);
        }
    }

    render(){

        let fill_s = {right:`${this.state.fill_per}%`};
        let day_s = {right:`${this.state.day_per}%`};
    
        return(
        <div className="daily_courses_con">

            <div className="daily_courses_title">{"برنامه هفتگی"}</div>
            
            <div className="daily_courses_title_line"/>

            <div className="daily_courses_selector_con">
                <img className="daily_courses_selector_img" onClick={this.prev_day} style={{transform:"rotateZ(180deg)"}} src={Server.img_png("select_right")}/>
                
                <div className="daily_courses_selector_fill" style={fill_s}/>
                <div className="daily_courses_selector_day" style={day_s}>{this.state.days[this.state.currentDay]}</div>

                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>

                <img className="daily_courses_selector_img" onClick={this.next_day} src={Server.img_png("select_right")}/>
            </div>


                <div className="daily_courses_list_con">
                    
                    <DailyListCard/>
                    <DailyListCard/>
                    <DailyListCard/>
                    <DailyListCard/>
                    <DailyListCard/>
                    <DailyListCard/>
                    <DailyListCard/>
                    <DailyListCard/>
                    <DailyListCard/>

                </div>


        </div>
        )
    }
}

function DailyListCard(props){
    return(
        <div className="daily_list_card_con">

            <div style={{display:'flex'}}>
                <div className="daily_list_card_title">{"فیزیک"}</div>
                <div className="daily_list_card_dot"/>
            </div>
            <div style={{display:'flex'}}>
                
                <div className="daily_list_card_time">
                    {"از ساعت "+"10:30"}
                    <br/>
                    {"تا ساعت "+"12:30"}
                </div>
                <img className="daily_list_card_img" src={Server.img_png("time")}/>
            </div>

        </div>
    )
}

function PlanCard(props){

    return(
        <div className="view_courses_card_con" style={{width:"15rem"}} onClick={()=>props.onClick()}>

            <img className="view_courses_card_img" src={Server.img_png("view_course_card")}/>

            <div className="view_courses_card_title">{props.title}</div>
            <div className="view_courses_card_sub">{"رشته"+ " : "+ "تجربی"}</div>
            <div className="view_courses_card_sub">{"پایه"+ " : "+ "تجربی"}</div>
            {/* <div className="view_courses_card_sub">{"قیمت"+ " : "+ "450000"}</div> */}

            <div className="view_courses_card_btn_con">
                <div className="view_courses_card_right" style={{width:'100%'}}>{"ورود به کلاس"}</div>
            </div>

        </div>
    )
}