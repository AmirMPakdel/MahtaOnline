import React, { Component } from 'react';
import './myCourses.css';
import { Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import Server from '../Server';
import {getCookie} from '../scripts/cookie';
import Controller from '../Controller';
import ViewPlan from './ViewPlan';
import Spiner from '../components/Loading';

class MyCourses extends Component {
    state = {
        loading:true,
        list : [],
    }

    componentDidMount(){
        window.location.hash = "mycourses";
        let json = {
            token: getCookie("_ca")
        }
        Server.post_request(Server.urls.MY_PLANS, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){

                this.state.list = res.data;
            }else{
                //TODO: error handle
            }
            this.setState(this.state);
        })
    }

    doneLoading = ()=>{
        this.setState({loading:false})
    }

    render() {
        return (
            <div id="mycourses">

                <div id="mycourses_title">{"درس های من"}</div>

                <div className="Breadcrumb_con">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                        <Breadcrumb.Item>{"طرح های من"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                {
                    true?
                    <React.Fragment>
                        
                        <DailyCourses weekly_data={this.state.weekly_data} current_day={this.state.current_day}
                        doneLoading={this.doneLoading}/>
                        
                        <div className="myclass_list_holder">

                            {
                                this.state.list.map((v,i)=>(
                                    <PlanCard key={`pc${i}`} title={v.title} plan={v}/>
                                ))
                            }

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
        loading_end:false,
        fill_per:17.55, // + 10.3
        day_per:10.2, // + 10.3
        days:["شنبه","یکشنبه","دوشنبه","سه شنبه","چهارشنبه","پنجشنبه","جمعه"],
        currentDay:0,
        weekly_data:{},
        current_day_object:[],
    }

    componentDidMount(){
        let json = {
            token: getCookie("_ca")
        }
        Server.post_request(Server.urls.MY_COURSE_BY_DAY, json, (res)=>{
                
            if(res.result_code == Server.ResultCode.SUCCESS){

                this.state.weekly_data = res.data;
                this.state.current_day_object = this.state.weekly_data["شنبه"];
                this.state.loading_end = true;
                this.setState(this.state, this.props.doneLoading);

            }else{
                //TODO: error handle
            }
        })
    }

    next_day=()=>{

        if(this.state.currentDay != 6 && this.state.loading_end){
            this.state.currentDay += 1;
            this.state.current_day_object = 
            this.state.weekly_data[this.state.days[this.state.currentDay]];
            this.state.fill_per += 10.3
            this.state.day_per += 10.3;
            this.setState(this.state);
        }
    }

    prev_day=()=>{
        if(this.state.currentDay != 0 && this.state.loading_end){
            this.state.currentDay -= 1;
            this.state.current_day_object = 
            this.state.weekly_data[this.state.days[this.state.currentDay]];
            this.state.fill_per -= 10.3;
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
                <img className="daily_courses_selector_img" onClick={this.next_day} style={{transform:"rotateZ(180deg)"}} src={Server.img_png("select_right")}/>
                
                <div className="daily_courses_selector_fill" style={fill_s}/>
                <div className="daily_courses_selector_day" style={day_s}>{this.state.days[this.state.currentDay]}</div>

                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>
                <div className="daily_courses_selector_line"/>

                <img className="daily_courses_selector_img" onClick={this.prev_day} src={Server.img_png("select_right")}/>
            </div>

                <div className="daily_courses_list_con">
                    
                    {
                        this.state.current_day_object.length == 0 && this.state.loading_end?
                        <div style={{marginTop:"3rem", fontSize:'1.2rem', fontWeight:"bold"}}>
                            {"کلاسی برگزار نمی شود"}</div>:null
                    }
                    {
                        this.state.current_day_object.map((v,i)=>(
                            <DailyListCard key={`dlc${i}`} data={v}/>
                        ))
                    }

                </div>


        </div>
        )
    }
}

function DailyListCard(props){
    console.log(props.data);
    
    return(
        <div className="daily_list_card_con">

            <div style={{display:'flex', height:"2.8rem"}}>
                <div className="daily_list_card_title">{props.data.title}</div>
                <div className="daily_list_card_dot">&#8226;</div>
            </div>
            <div style={{display:'flex'}}>
                
                <div className="daily_list_card_time">
                    {"از ساعت "}<span style={{direction:"ltr"}}>{props.data.start_hour+":"+props.data.start_min}</span>
                    <br/>
                    {"تا ساعت "}<span style={{direction:"ltr"}}>{props.data.finish_hour+":"+props.data.finish_min}</span>
                </div>
                <img className="daily_list_card_img" src={Server.img_png("time")}/>
            </div>

        </div>
    )
}

class PlanCard extends Component{

    onClick = ()=>{
        Controller.setPage(<ViewPlan plan={this.props.plan} owned={true}/>, 2)
    }

    render(){
    return(
        <div className="view_courses_card_con" style={{width:"15rem", height:"auto"}}>

            <img className="view_courses_card_img" src={Server.urls.DBFILE+this.props.plan.cover}/>

            <div className="view_courses_card_title" style={{marginBottom:'2rem', marginTop:'1.4rem'}}>
                {this.props.title}</div>
                
            {/* <div className="view_courses_card_sub">{"رشته"+ " : "+ "تجربی"}</div>
            <div className="view_courses_card_sub">{"پایه"+ " : "+ "تجربی"}</div> */}
            {/* <div className="view_courses_card_sub">{"قیمت"+ " : "+ "450000"}</div> */}

            <div className="view_courses_card_btn_con">
                <div className="view_courses_card_right" style={{width:'100%'}} 
                onClick={this.onClick}>{"ورود به طرح"}</div>
            </div>

        </div>
    )}
}