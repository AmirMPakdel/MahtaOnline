import React, { Component } from 'react'
import './classInfo_card.css';
import {Collapse} from 'antd';
import Server from '../Server';
import ClassInfo_sessions from './ClassInfo_sessions';
import ClassInfo_tests from './ClassInfo_tests';
import Controller from '../Controller';
import ClassView from '../pages/ClassView';

export default class ClassInfo_card extends Component {

    onSelect = ()=>{
        
        Controller.setPage(
            <ClassView data={this.props.data} category={this.props.category} owned={this.props.owned}
            plan={this.props.plan}/>
        )
    }

    render() {

        let a = ['1'];
        let collapsed = true;

        // if(this.props.collapsed){
        //     a = ['1'];
        //     collapsed = true;
        // }

        let {  description, teacher } = this.props.data;

        return (
            <div className="classInfo_card_wrapper" onClick={this.onSelect}>
                <Header data={this.props.data} collapsed={true}/>
            </div>
            // <Collapse bordered defaultActiveKey={a} className="classInfo_card">
            //     <Collapse.Panel header={<Header data={this.props.data} onClick={this.onSelect} collapsed={true}/>} className="classInfo_card_header">

            //         <div className="classInfo_more_info">

            //             {
            //                 description && <InfoSec title="توضیحات دوره" text={description}/>
            //             }
            //             {
            //                 teacher.graduation && <InfoSec title="تحصیلات استاد" text={teacher.graduation}/>
            //             }
            //             {
            //                 teacher.record && <InfoSec title="سوابق تحصیل" text={teacher.record}/>
            //             }
            //             {
            //                 teacher.compilation && <InfoSec title="تالیفات" text={teacher.compilation}/>
            //             }
            //             {
            //                 teacher.description && <InfoSec title="درباره استاد" text={teacher.description}/>
            //             }
                        
            //         </div>

            //         <div className="classInfo_sessions_info">
            //             <ClassInfo_sessions/>
            //             <ClassInfo_tests/>
            //         </div>

            //     </Collapse.Panel>
            // </Collapse>
        )
    }
}

function Header(props){

    let {title, teacher, launch_date_year, launch_date_month, launch_date_day, online_day,
        start_hour, start_min, finish_hour, finish_min} = props.data;

    return(
        <React.Fragment>

            <div className="classInfo_header_img" style={{backgroundImage:`url(${Server.urls.DBFILE+teacher.avatar})`}}/>

            <div className="classInfo_header_sec1">

                <div className="classInfo_header_sec2">
                    <img className="classInfo_header_icon" src={Server.img_png("class_info_title")}/>
                    {title}
                </div>

                <div className="classInfo_header_sec2">
                    <img className="classInfo_header_icon" src={Server.img_png("class_info_teacher")}/>
                    {teacher.first_name + " "+ teacher.last_name}
                </div>

                <div className="classInfo_header_sec2">
                    <img className="classInfo_header_icon" src={Server.img_png("class_info_date")}/>
                    {"شروع از "+launch_date_year+"/"+launch_date_month+"/"+launch_date_day}
                </div>

                <div className="classInfo_header_sec2">
                    <img className="classInfo_header_icon" src={Server.img_png("class_info_time")}/>
                    {online_day+" ها از ساعت "+ start_hour+":"+start_min+" تا "+finish_hour+":"+finish_min}
                </div>

                <div hidden={!props.collapsed} className="classInfo_header_more">{"مشاهده جلسات کلاس"}</div>

            </div>

        </React.Fragment>
    )
}

function InfoSec(props){
    return(
        <div className="classInfo_card_info_sec">
            <div className="classInfo_card_info_title">{props.title}</div>
            <div className="classInfo_card_info_sub">{props.text}</div>
        </div>
    )
}