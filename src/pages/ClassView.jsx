import React, { Component } from 'react';
import './classView.css'
import Server from '../Server';
import {Breadcrumb, Spin, Modal} from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import PlansList from "./PlansList";
import CategoryList from './CategoryList';
import ViewPlan from './ViewPlan';
import Controller from '../Controller';
import MyCourses from './MyCourses';
import VideoContainer from '../components/VideoContainer';
import { getCookie } from '../scripts/cookie';

export default class ClassView extends Component {

    state = {
        modal_visible:false,
        modal_title:"",
        classModal:null,
    }
    
    componentDidMount(){
        window.location.hash = "classview";
        window.addEventListener("hashchange", this.onHashChange);
    }

    componentWillUnmount(){
        window.removeEventListener("hashchange", this.onHashChange);
    }

    onHashChange = ()=>{
        if(window.location.hash == "#viewplan"){
            this.BackToViewPlan();
        }
    }

    BackToViewPlanList = ()=>{
        Controller.setPage(
            <div id="course_list">
            <PlansList category={this.props.category}/>
            </div>
            , 1
        )
    }

    BackToCategoryList = ()=>{
        Controller.setPage(
            <CategoryList/>
            , 1
        )
    }

    BackToViewPlan = ()=>{
        Controller.setPage(
            <ViewPlan plan={this.props.plan} category={this.props.category} owned={this.props.owned}/>
            ,1
        )
    }

    BackToMyCourses = ()=>{
        Controller.setPage(
            <MyCourses/>
            ,2
        )
    }

    onModalCancel = ()=>{
        this.setState({modal_visible:false});
    }

    onShowModal = (jsx, modal_title)=>{

        this.setState({modal_visible:true, classModal:jsx, modal_title});
    }

    render() {
        return (
            <div className="classView_con">

                <div className="classView_title">{this.props.data.title}</div>

                <div className="Breadcrumb_con" style={{paddingRight:"0rem", marginTop:"0.5rem", marginBottom:"-0.3rem"}}>
                <Breadcrumb separator="/">
                    <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                    {
                        this.props.category?
                        <React.Fragment>
                        <Breadcrumb.Item href="#" onClick={this.BackToCategoryList}>{"دسته بندی طرح ها"}</Breadcrumb.Item>
                        <Breadcrumb.Item href="#" onClick={this.BackToViewPlanList}>{"لیست طرح ها"}</Breadcrumb.Item>
                        </React.Fragment>:
                        <React.Fragment>
                        <Breadcrumb.Item href="#" onClick={this.BackToMyCourses}>{"طرح های من"}</Breadcrumb.Item>
                        </React.Fragment>
                    }
                    <Breadcrumb.Item href="#" onClick={this.BackToViewPlan}>{"توضیحات طرح"}</Breadcrumb.Item>
                    <Breadcrumb.Item>{"توضیحات کلاس"}</Breadcrumb.Item>
                </Breadcrumb>
                </div>
                
                {
                    this.props.data.is_online?<GoStream room_url={this.props.data.room_url}/>:null
                }
                
                <ClassInfoSec data={this.props.data}/>

                <SessionSec  data={this.props.data} onShowModal={this.onShowModal} plan_id={this.props.plan.id}/>

                {
                    this.props.data.tests.length?<TestsSec data={this.props.data}/>:null
                }
                {
                    this.props.data.notes.length?<NotesSec list={this.props.data.notes}
                    is_free={this.props.data.is_free} access_denied={this.props.data.access_denied}/>:null
                }

                <Modal title={this.state.modal_title} centered className="class_modal_con" visible={this.state.modal_visible} 
                onCancel={this.onModalCancel} destroyOnClose footer={null}>{this.state.classModal}
                </Modal>

                
                
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
            <div className="goStream_btn" onClick={()=>{
                window.location.href = props.room_url;
            }}>{"ورود به کلاس"}</div>
        </div>
    )
}
const tx = `کلاس در حال برگزاری می‌باشد`

function ClassInfoSec(props){
    let {title,description, teacher, launch_date_year, launch_date_month, launch_date_day, online_day,
        start_hour, start_min, finish_hour, finish_min} = props.data;
    return(
        <div className="ClassViewInfo_con">
            <div className="ClassViewInfo_holder">

                <div className="ClassViewInfo_header_img" style={{backgroundImage:`url(${Server.urls.DBFILE+teacher.avatar})`}}/>

                <div className="ClassViewInfo_header_sec1">

                    <div className="ClassViewInfo_header_sec2">
                        <img className="ClassViewInfo_header_icon" src={Server.img_png("class_info_title")}/>
                        {title}
                    </div>

                    <div className="ClassViewInfo_header_sec2">
                        <img className="ClassViewInfo_header_icon" src={Server.img_png("class_info_teacher")}/>
                        {teacher.first_name + " "+ teacher.last_name}
                    </div>

                    <div className="classInfo_header_sec2">
                        <img className="classInfo_header_icon" src={Server.img_png("class_info_time")}/>
                        {online_day+" ها از ساعت "+ start_hour+":"+start_min+" تا "+finish_hour+":"+finish_min}
                    </div>
                </div>

            </div>
            {
                (description || (teacher.graduation || (teacher.record || (teacher.compilation || teacher.description))))?
                <div className="classInfo_more_info" style={{padding:"2rem", paddingTop:"1rem"}}>

                    <div className="ClassViewInfo_line1"/>
                    
                    {
                        description && <InfoSec title="توضیحات دوره" text={description}/>
                    }
                    {
                        teacher.graduation && <InfoSec title="تحصیلات استاد" text={teacher.graduation}/>
                    }
                    {
                        teacher.record && <InfoSec title="سوابق تحصیل" text={teacher.record}/>
                    }
                    {
                        teacher.compilation && <InfoSec title="تالیفات" text={teacher.compilation}/>
                    }
                    {
                        teacher.description && <InfoSec title="درباره استاد" text={teacher.description}/>
                    }
                
                </div>:null
            }
        </div>
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

class SessionSec extends Component{

    render(){
    return(
        <div className="session_sec_con">

            <div className="classView_sec_title">{"جلسات دوره"}</div>
            <div className="classView_under_title_line"/>
            {
                this.props.data.sessions.map((v,i)=>{
                    return(
                        <SessionRow index={i} onShowModal={this.props.onShowModal} data={v} plan_id={this.props.plan_id} listLength={this.props.data.sessions.length}/>
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

    onVideoConRef = (r)=>{
        this.videoCon = r;
        Controller.class_modal_close = (cb)=>{
            this.videoCon.onClose(cb);
        }
    }

    onSelect=()=>{
        if(this.props.data.is_free || this.props.data.has_access){
            // if(this.state.opened){
            //     this.state.opened = false;
            //     this.content.style.height = 0;
            // }else{
            //     this.state.opened = true;
            //     this.content.style.height = this.wrapper.clientHeight+20+"px";
            // }

            this.props.onShowModal(
                <div className="session_modal_con">
                    <VideoContainer plan_id={this.props.plan_id} ref={this.onVideoConRef} session_id={this.props.data.id}/>
                    
                    <div className="session_content_links_con">
                    {
                        this.props.data.downloadable?
                        <div className="session_video_download_btn" onClick={this.download_video}>{"دانلود ویدیو این جلسه"}</div>:null
                    }
                    {
                        this.props.data.notes?
                        <div className="session_file_download_btn" onClick={this.download_notes}>{"دانلود فایل جزوه این جلسه"}</div>:null
                    }
                    </div>
                    {
                        this.props.data.description?
                        <div className="session_info_con">
                            <div className="sesstion_info_line"/>
                            <div className="session_info_text">{this.props.data.description}</div>
                        </div>:null
                    }
                    {
                        (this.props.data.downloadable || this.props.data.notes)||this.props.data.description?
                        <div style={{marginTop:"3rem"}}/>:null
                    }

                </div>, this.props.data.title
            )
        }
    }

    download_notes = ()=>{
        window.open(Server.urls.DBFILE+this.props.data.notes);
    }

    download_video = ()=>{
        // let json = {token:getCookie("_ca"), plan_id:this.props.plan_id, session_id:this.props.data.id}
        // Server.post_request(Server.urls.SESSION_VIDEO_DOWNLOAD, json, (res)=>{
        //     if(res.result_code == Server.ResultCode.SUCCESS){
        //         window.open(res.data);
        //     }else{
        //         Controller.openNotification(Server.ResultCode2Message(res.result_code),null, "error");
        //     }
        // });
        let token = getCookie("_ca");
        let plan_id = this.props.plan_id;
        let session_id = this.props.data.id;
        window.open(Server.domain+`/api/session/videolink/download/${token}/${plan_id}/${session_id}`);
    }

    render(){

        let line_s = {};
        let row_s = {};
        if(this.props.data.is_free || this.props.data.has_access){
            if(this.props.is_online){
                row_s = {backgroundColor:"rgba(231, 197, 23, 0.6)"};
            }else{
                row_s = {backgroundColor:"rgba(0, 144, 234, 0.35)"};
            }
        }else{
            row_s = {backgroundColor:"rgba(210,210,210)"};
        }
        if(this.props.listLength==1){
            line_s={height:"0rem"}
        }else if(this.props.index == 0){
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
                <div className="session_row_info_con" onClick={this.onSelect} style={row_s}>
                    {
                        this.props.data.has_access || this.props.data.is_free?null:
                        <img className="session_lock" src={Server.img_png("lock")}/>
                    }
                    <div className="session_row_name">
                        {this.props.data.title}
                        {
                            this.props.data.is_online?
                            <div className="session_row_name_sub">{"(درحال برگزاری)"}</div>:null
                        }
                    </div>
                    <div className="session_row_date">
                        <div className={"session_row_show"}>{"مشاهده"}</div>
                        {this.props.data.date_year+"/"+this.props.data.date_month+"/"+this.props.data.date_day}
                        <img className="session_row_img" src={Server.img_png("event")}/>
                    </div>
                    
                </div>
                {
                    // this.props.data.has_access || this.props.data.is_free?
                    // <div className="session_content_con" ref={r=>this.content=r}>
                    //     <div className="session_wrapper" ref={r=>r=this.wrapper=r}>
                    //         <VideoContainer plan_id={this.props.plan_id} session_id={this.props.data.id}/>
                            
                    //         <div className="session_content_links_con">
                    //             {
                    //                 this.props.data.downloadable?
                    //                 <div className="session_video_download_btn" onClick={this.download_video}>{"دانلود ویدیو این جلسه"}</div>:null
                    //             }
                    //             {
                    //                 this.props.data.notes?
                    //                 <div className="session_file_download_btn" onClick={this.download_notes}>{"دانلود فایل جزوه این جلسه"}</div>:null
                    //             }
                    //         </div>
                    //         {
                    //             this.props.data.description?
                    //             <div className="session_info_con">
                    //                 <div className="sesstion_info_line"/>
                    //                 <div className="session_info_text">{this.props.data.description}</div>
                    //             </div>:null
                    //         }
                    //     </div>
                    // </div>:null
                }
            </div>
        </div>
        )
    }
}

class TestsSec extends Component{

    render(){
    return(
        <div className="session_sec_con">

            <div className="classView_sec_title">{"آزمون های دوره"}</div>
            <div className="classView_under_title_line"/>

            {
                
                this.props.data.tests.map((v,i)=>{
                    return(
                        <TestRow index={i} data={v} listLength={this.props.data.tests.length}/>
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
        let row_s = {};
        if(this.props.data.test_access && this.props.data.reached_start_date_time){
            if(this.props.data.passed_finish_date_time){
                row_s.backgroundColor="rgba(0, 144, 234, 0.35)";
            }else{
                row_s.backgroundColor="rgba(66, 245, 117, 0.4)";
            }
        }else{
            row_s.backgroundColor="rgba(210,210,210)";
        }

        let line_s = {};
        if(this.props.listLength==1){
            line_s={height:"0rem"}
        }else if(this.props.index == 0){
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
                <div className="session_row_info_con" style={row_s}>
                    {
                        // this.props.data.test_access?null:
                        // <img className="session_lock" src={Server.img_png("lock")}/>
                    }
                    <div className="session_row_name">
                        {this.props.data.title}
                        {/* <div className="session_row_name_sub">{"(درحال برگزاری)"}</div> */}
                    </div>
                    <div className="session_row_holder">
                        <div className="session_row_date">
                            {this.props.data.start_time}
                            <img className="session_row_img" src={Server.img_png("time")}/>
                        </div>
                        <div className="session_row_holder_space"/>
                        <div className="session_row_date">
                            {this.props.data.start_date}
                            <img className="session_row_img" src={Server.img_png("event")}/>
                        </div>
                    </div>
                    
                </div>
                <div className="session_content_con">
                    <div ref={r=>r=this.wrapper=r}>
                        
                    </div>
                </div>
            </div>
        </div>
    )}
}

class NotesSec extends Component{
    render(){
        return(
            <div className="session_sec_con">

            <div className="classView_sec_title">{"جزوات دوره"}</div>
            <div className="classView_under_title_line"/>
            {
                this.props.list.map((v,i)=>{
                    return(
                        <NoteRow index={i} data={v} is_free={this.props.is_free}
                        access_denied={this.props.access_denied} listLength={this.props.list.length}/>
                    )
                })
            }
        </div>
        )
    }
}

class NoteRow extends Component{

    componentDidMount(){

    }

    render(){
        let row_s = {cursor:"default"};
        if(!this.props.access_denied && !this.props.is_free){
            row_s.backgroundColor="rgba(0, 144, 234, 0.35)";
        }else{
            row_s.backgroundColor="rgba(210,210,210)";
        }
        let line_s = {};
        if(this.props.listLength==1){
            line_s={height:"0rem"}
        }else if(this.props.index == 0){
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
                <div className="session_row_info_con" style={row_s}>
                    <div className="session_row_name">
                        {this.props.data.title}
                    </div>
                    <div className="session_row_holder">
                        <div className="note_download_btn" onClick={()=>{window.open(Server.urls.DBFILE+this.props.data.file)}}>
                            {"دانلود"}
                        </div>
                    </div>
                    
                </div>
                <div className="session_content_con">
                    <div ref={r=>r=this.wrapper=r}>
                        
                    </div>
                </div>
            </div>
        </div>
    )}
}