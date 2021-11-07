import React, { Component } from 'react';
import './myTests.css';
import { Breadcrumb, Modal } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import Server from '../Server';
import TestView from './TestView';
import { getCookie } from '../scripts/cookie';
import Spiner from '../components/Spiner';
import Controller from '../Controller';
import ScoreSheet from './ScoreSheet';
import MyTestFilterDialog from '../components/MyTestFilterDialog';

class mytests extends Component {
    
    state = {
        loading:true,
        free_tests:[],
        remaining_tests:[],
        running_tests:[],
        taken_tests:[],
        no_tests:true,

        testModalVisible:false,
        testModalTitle:"",
        test_id:null,

        testFilterDialogVisible:false,
        myCourseList:[],
        filterDialogData:null,

    }

    componentDidMount(){
        window.location.hash="mytests";
        this.getMyTests();
        // auto refresh the list
        this.interval = setInterval(()=>{
            if(!this.state.testFilterDialogVisible){
                this.onFilter();
            }
        }, 45000);

        this.interval2 = setInterval(()=>{
            if(!this.state.testFilterDialogVisible){
                document.getElementsByTagName("body")[0].style.overflowY="auto";
            }
        },1000)
    }

    componentWillUnmount(){
        clearInterval(this.interval);
        clearInterval(this.interval2);
    }

    getMyTests = ()=>{

        let json = {token:getCookie("_ca")}

        Server.post_request(Server.urls.GET_MY_TESTS, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                this.state.free_tests = res.data.free_tests;
                this.state.remaining_tests = res.data.remaining_tests;
                this.state.running_tests = res.data.running_tests;
                this.state.taken_tests = res.data.taken_tests;
                this.state.loading = false;
                if(this.state.free_tests.length)this.state.no_tests=false;
                if(this.state.remaining_tests.length)this.state.no_tests=false;
                if(this.state.running_tests.length)this.state.no_tests=false;
                if(this.state.taken_tests.length)this.state.no_tests=false;
                this.setState(this.state);
            }

            this.getMyCourseList();
        })
    }

    getMyCourseList = ()=>{

        let json = {token:getCookie("_ca")}

        Server.post_request("/api/student/courses/filter", json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                this.setState({myCourseList : res.data});
            }
        })
    }

    filterAndShow = (fd)=>{
        this.state.filterDialogData=fd;
        let json = {token:getCookie("_ca")}
        if(fd.SelectedCourse){
            json["course_id"]=fd.SelectedCourse;
        }
        if(fd.from_day<=31 && fd.from_day>0 && fd.from_month<=12 && fd.from_month>0 && fd.from_year>1397){
            json["date_from"]=fd.from_year+"-"+fd.from_month+"-"+fd.from_day;
        }
        if(fd.to_day<=31 && fd.to_day>0 && fd.to_month<=12 && fd.to_month>0 && fd.to_year>1397){
            json["date_to"]=fd.to_year+"-"+fd.to_month+"-"+fd.to_day;
        }
        Server.post_request(Server.urls.GET_MY_TESTS, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                if(fd.running_tests){
                    this.state.free_tests = res.data.free_tests;
                }else{
                    this.state.free_tests = [];
                }
                if(fd.remaining_tests){
                    this.state.remaining_tests = res.data.remaining_tests;
                }else{
                    this.state.remaining_tests = [];
                }
                if(fd.running_tests){
                    this.state.running_tests = res.data.running_tests;
                }else{
                    this.state.running_tests = [];
                }
                if(fd.taken_tests){
                    this.state.taken_tests = res.data.taken_tests;
                }else{
                    this.state.taken_tests = [];
                }
                this.state.loading = false;
                if(this.state.free_tests.length)this.state.no_tests=false;
                if(this.state.remaining_tests.length)this.state.no_tests=false;
                if(this.state.running_tests.length)this.state.no_tests=false;
                if(this.state.taken_tests.length)this.state.no_tests=false;
                this.setState(this.state);
            }
        })
    }


    onTestSelect = (type, test_id, test_title)=>{

        this.setState({testModalVisible:true,testModalTitle:test_title, selectedTestId:test_id});
    }

    onTestModalOk = ()=>{

        Controller.setPage(<TestView test_id={this.state.selectedTestId} test_title={this.state.testModalTitle}/>, 5);
    }

    onTestModalCancel = ()=>{
        this.setState({testModalVisible:false});
    }

    onFilter = (show_loading=false)=>{
        let fd = {};
        if(this.filterDialog){
            fd = Object.assign({}, this.filterDialog.state);
        }else if(this.state.filterDialogData){
            fd = this.state.filterDialogData;
        }else{
            fd={
                running_tests:true,free_tests:true,remaining_tests:true,
                taken_tests:true,from_day:"",from_month:"",from_year:"",
                to_day:"",to_month:"",to_year:"",SelectedCourse:0,
            }
        }
        document.getElementsByTagName("body")[0].style.overflowY="auto";
        this.setState({testFilterDialogVisible:false, loading:show_loading},()=>
        {
            document.getElementsByTagName("body")[0].style.overflowY="auto";
            this.filterAndShow(fd);
        });
    }

    onShowFilterModal = ()=>{
        document.getElementsByTagName("body")[0].style.overflowY="hidden";
        this.setState({testFilterDialogVisible:true},
            ()=>{
                document.getElementsByTagName("body")[0].style.overflowY="hidden";
            })
    }

    onHideFilterModal = ()=>{
        document.getElementsByTagName("body")[0].style.overflowY="auto";
        this.setState({testFilterDialogVisible:false},
            ()=>{
                document.getElementsByTagName("body")[0].style.overflowY="auto";
            })
    }

    render() {

        if(this.state.loading){
            return(<Spiner/>);
        }else{
            return (
                <div id="mytests">
                        
                    <div id="mytests_title">{"آزمون های من"}</div>

                    <div className="Breadcrumb_con">
                        <Breadcrumb separator="/">
                            <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                            <Breadcrumb.Item>{"آزمون های من"}</Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    {
                        this.state.no_tests?
                        <div id="mytests_holder">
                            <div className="mytests_alert_card_con">
                                <div className="mytests_alert_lable"/>
                                <div className="mytests_alert_text">{tx}</div>
                            </div>
                        </div>:
                        <React.Fragment>

                        <div id="mytexts_filter_sec">

                            <div id="mytexts_filter_btn" onClick={this.onShowFilterModal}>{"اعمال فیلتر"}</div>

                        </div>

                        {
                            this.state.running_tests.length?
                            <React.Fragment>
                                <div className="myTest_part_title">{"درحال برگزاری"}</div>
                                {
                                    this.state.running_tests.map((v,i)=>(
                                        <OnGoingTest key={`${i}`} data={v} onTestSelect={this.onTestSelect}/>
                                    ))
                                }
                                <div className="myTest_space1"/>
                            </React.Fragment>:null
                        }
                        {
                            this.state.free_tests.length?
                            <React.Fragment>
                                <div className="myTest_part_title">{"آزمون های شناور"}</div>
                                {
                                    this.state.free_tests.map((v,i)=>(
                                        <FloatingTest key={`${i}`} data={v} onTestSelect={this.onTestSelect}/>
                                    ))
                                }
                                <div className="myTest_space1"/>
                            </React.Fragment>:null
                        }
                        {
                            this.state.remaining_tests.length?
                            <React.Fragment>
                                <div className="myTest_part_title">{"آزمون های باقی مانده"}</div>
                                {
                                    this.state.remaining_tests.map((v,i)=>(
                                        <UpcommingTest key={`${i}`} data={v} onTestSelect={this.onTestSelect}/>
                                    ))
                                }
                                <div className="myTest_space1"/>
                            </React.Fragment>:null
                        }
                        {
                            this.state.taken_tests.length?
                            <React.Fragment>
                                <div className="myTest_part_title">{"آزمون های برگزار شده"}</div>
                                {
                                    this.state.taken_tests.map((v,i)=>(
                                        <CompeletedTest key={`${i}`} data={v} onTestSelect={this.onTestSelect}/>
                                    ))
                                }
                            </React.Fragment>:null
                        }
                        {
                            (!this.state.taken_tests.length && !this.state.remaining_tests.length
                                && !this.state.free_tests.length && !this.state.running_tests.length)?
                                <div id="myTest_part_no_test">{"!هیچ آزمونی یافت نشد"}</div>:null
                        }
                        </React.Fragment>
                    }

                    <Modal okText="ورود آزمون" cancelText="فعلا نه" title={this.state.testModalTitle} 
                    visible={this.state.testModalVisible} onOk={this.onTestModalOk} onCancel={this.onTestModalCancel}>

                        <p style={{direction:"rtl"}}>{"درصورت شروع آزمون، ثانیه شمار شروع به شمردن میکند و با ترک آزمون  یا قطع اتصال به اینترنت متوقف نمی شود."}</p>
                        <p style={{direction:"rtl"}}>{"دفترچه سوالات در بالای صفحه آزمون قابل دانلود می باشد."}</p>
                        <p style={{direction:"rtl"}}>{"درصورت وقوع هر گونه مشکل میتوانید دوباره به آزمون برگردید."}</p>
                        <p style={{direction:"rtl"}}>{"برای اطمینان از ثبت پاسخ ها، بعد از اتمام بر دکمه ثبت پاسخنامه و خروج کلیک نمایید."}</p>

                    </Modal>

                    <Modal centered title={"اعمال فیلتر برای نمایش لیست آزمون ها"} onCancel={this.onHideFilterModal}
                    visible={this.state.testFilterDialogVisible} cancelText={"بستن"} okText={"اعمال فیلتر"}
                    onOk={()=>this.onFilter(true)}>

                        <MyTestFilterDialog ref={r=>this.filterDialog=r} myCourses={this.state.myCourseList}
                        data={this.state.filterDialogData}/>

                    </Modal>
                
                </div>
            )
        }
    }
}

export default mytests
const tx = `شما هیچ آزمون فعالی ندارید`

function TestCard_InfoSec(props){
    let s = {};
    if(props.underline){
        s = {borderBottom:"0.1rem solid "+props.underline_color}
    }
    return(
        <div className="myTest_card_info_row" style={s}>
            <img className="myTest_card_info_img" src={Server.img_png(props.icon)}/>
            <div className="myTest_card_info_text">{props.info}</div>
        </div>
    )
}

class OnGoingTest extends Component{

    onClick = ()=>{
        if(this.props.data.test_access){
            this.props.onTestSelect("ongoing", this.props.data.id, this.props.data.title);
        }else if(this.props.data.passed_finish_date_time){
            Controller.openNotification("مهلت انجام آزمون به سر رسیده است", null, "alert")
        }else if(!this.props.data.reached_start_date_time){
            Controller.openNotification("آزمون هنوز شروع نشده است", null, "alert")
        }else if(!this.props.data.test_course_access){
            Controller.openNotification("عدم دسترسی به کلاس مربوط به این آزمون", null, "alert")
        }else if(!this.props.data.test_access){
            Controller.openNotification("عدم اجازه برای دسترسی به آزمون", null, "error")
        }else{
            this.props.onTestSelect("ongoing", this.props.data.id, this.props.data.title);
        }
    }

    render(){
        let con_s = {borderColor:"gold"}
        let btn_s = {backgroundColor:"gold", color:"black"}
    return(
        <div className="myTest_card_con" style={con_s}>

            <div className="myTest_card_title">{this.props.data.title}</div>

            <div className="myTest_card_info_con">
                {
                    this.props.data.start_date?
                    <TestCard_InfoSec icon="test_start_date" underline_color="gold"
                    info={"تاریخ شروع آزمون : "+ this.props.data.start_date} underline/>:null
                }
                {
                    this.props.data.start_time?
                    <TestCard_InfoSec icon="class_info_time" underline_color="gold"
                    info={"ساعت شروع آزمون : "+ this.props.data.start_time} underline/>:null
                }
                {
                    this.props.data.finish_date?
                    <TestCard_InfoSec icon="test_end_date" underline_color="gold"
                    info={"تاریخ پایان مهلت آزمون : "+ this.props.data.finish_date} underline/>:null
                }
                {
                    this.props.data.finish_time?
                    <TestCard_InfoSec icon="class_info_time" underline_color="gold"
                    info={"ساعت پایان مهلت آزمون : "+ this.props.data.finish_time} underline/>:null
                }
                {
                    this.props.data.duration?
                    <TestCard_InfoSec icon="test_time" underline_color="gold"
                    info={"زمان امتحان : "+`${Math.floor(this.props.data.duration/60)}دقیقه`} underline/>:null
                }            
                {
                    this.props.data.has_negative_score?
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی دارد"}/>:
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی ندارد"}/>
                }
            </div>

            <div className="myTest_card_button" onClick={this.onClick} 
            style={btn_s}>{"ورود به آزمون"}</div>
        </div>
    )
    }
}

class FloatingTest extends Component{

    onClick=()=>{
        if(this.props.data.test_access){
            this.props.onTestSelect("floating", this.props.data.id, this.props.data.title);
        }else if(this.props.data.passed_finish_date_time){
            Controller.openNotification("مهلت انجام آزمون به سر رسیده است", null, "alert")
        }else if(!this.props.data.reached_start_date_time){
            Controller.openNotification("آزمون هنوز شروع نشده است", null, "alert")
        }else if(!this.props.data.test_course_access){
            Controller.openNotification("عدم دسترسی به کلاس مربوط به این آزمون", null, "alert")
        }else if(!this.props.data.test_access){
            Controller.openNotification("عدم اجازه برای دسترسی به آزمون", null, "error")
        }else{
            this.props.onTestSelect("floating", this.props.data.id, this.props.data.title);
        }
    }

    render(){
        let con_s = {borderColor:"#0091EA"}
        let btn_s = {backgroundColor:"#0091EA", color:"white"}
    return(
        <div className="myTest_card_con" style={con_s}>

            <div className="myTest_card_title">{this.props.data.title}</div>

            <div className="myTest_card_info_con">
                {
                    this.props.data.start_date?
                    <TestCard_InfoSec icon="test_start_date" underline_color="#0091EA"
                    info={"تاریخ شروع آزمون : "+ this.props.data.start_date} underline/>:null
                }
                {
                    this.props.data.start_time?
                    <TestCard_InfoSec icon="class_info_time" underline_color="#0091EA"
                    info={"ساعت شروع آزمون : "+ this.props.data.start_time} underline/>:null
                }
                {
                    this.props.data.finish_date?
                    <TestCard_InfoSec icon="test_end_date" underline_color="#0091EA"
                    info={"تاریخ پایان مهلت آزمون : "+ this.props.data.finish_date} underline/>:null
                }
                {
                    this.props.data.finish_time?
                    <TestCard_InfoSec icon="class_info_time" underline_color="#0091EA"
                    info={"ساعت پایان مهلت آزمون : "+ this.props.data.finish_time} underline/>:null
                }
                {
                    this.props.data.duration?
                    <TestCard_InfoSec icon="test_time" underline_color="#0091EA"
                    info={"زمان امتحان : "+`${Math.floor(this.props.data.duration/60)}دقیقه`} underline/>:null
                }
                {
                    this.props.data.has_negative_score?
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی دارد"}/>:
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی ندارد"}/>
                }
                
            </div>

            <div className="myTest_card_button" onClick={this.onClick} 
            style={btn_s}>{"ورود به آزمون"}</div>
        </div>
    )
    }
}

class UpcommingTest extends Component{
    render(){
        let con_s = {borderColor:"gray"}
    return(
        <div className="myTest_card_con" style={con_s}>

            <div className="myTest_card_title">{this.props.data.title}</div>

            <div className="myTest_card_info_con">
                {
                    this.props.data.start_date?
                    <TestCard_InfoSec icon="test_start_date" underline_color="gray"
                    info={"تاریخ شروع آزمون : "+ this.props.data.start_date} underline/>:null
                }
                {
                    this.props.data.start_time?
                    <TestCard_InfoSec icon="class_info_time" underline_color="gray"
                    info={"ساعت شروع آزمون : "+ this.props.data.start_time} underline/>:null
                }
                {
                    this.props.data.finish_date?
                    <TestCard_InfoSec icon="test_end_date" underline_color="gray"
                    info={"تاریخ پایان مهلت آزمون : "+ this.props.data.finish_date} underline/>:null
                }
                {
                    this.props.data.finish_time?
                    <TestCard_InfoSec icon="class_info_time" underline_color="gray"
                    info={"ساعت پایان مهلت آزمون : "+ this.props.data.finish_time} underline/>:null
                }
                {
                    this.props.data.duration?
                    <TestCard_InfoSec icon="test_time" underline_color="gray"
                    info={"زمان امتحان : "+`${Math.floor(this.props.data.duration/60)}دقیقه`} underline/>:null
                }
                {
                    this.props.data.has_negative_score?
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی دارد"}/>:
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی ندارد"}/>
                }
            </div>
        </div>
    )}
}

class CompeletedTest extends Component{

    onScores = ()=>{
        if(!this.props.data.has_taken){
            Controller.openNotification("شما این آزمون را نداده اید", null, "alert")
        }else{
            Controller.setPage(<ScoreSheet id={this.props.data.id} title={this.props.data.title}/>)
        }
    }

    onAnswers = ()=>{
        let json = {test_id:this.props.data.id}
        Server.post_request(Server.urls.TESTS_ANSWERS, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){

                window.open(Server.urls.DBFILE+res.data);

            }else{
                Controller.openNotification(Server.ResultCode2Message(res.result_code), null, "alert")
            }
        })
    }

    render(){
        let con_s = {borderColor:"#00C853"}
        let btn_s = {backgroundColor:"#00C853", color:"white"}
    return(
        <div className="myTest_card_con" style={con_s}>

            <div className="myTest_card_title">{this.props.data.title}</div>

            <div className="myTest_card_info_con">
                {
                    this.props.data.start_date?
                    <TestCard_InfoSec icon="test_start_date" underline_color="gray"
                    info={"تاریخ شروع آزمون : "+ this.props.data.start_date} underline/>:null
                }
                {
                    this.props.data.duration?
                    <TestCard_InfoSec icon="test_time" underline_color="#00C853"
                    info={"زمان امتحان : "+`${Math.floor(this.props.data.duration/60)}دقیقه`} underline/>:null
                }
                {
                    this.props.data.result_access_date?
                    <TestCard_InfoSec icon="test_start_date" underline_color="#00C853"
                    info={"تاریخ نتایج آزمون : "+ this.props.data.result_access_date} underline/>:null
                }
                {
                    this.props.data.result_access_time?
                    <TestCard_InfoSec icon="class_info_time" underline_color="#00C853"
                    info={"ساعت نتایج آزمون : "+ this.props.data.result_access_time} underline/>:null
                }
                {
                    this.props.data.has_negative_score?
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی لحاظ شده"}/>:
                    <TestCard_InfoSec icon="test_info" info={"نمره منفی لحاظ نشده"}/>
                }
                </div>
                <div className="myTest_card_button" style={btn_s}>
                <div className="myTest_card_button2" onClick={this.onAnswers}>{"پاسخ نامه"}</div>
                <div className="myTest_card_button1" onClick={this.onScores}>{"مشاهده کارنامه"}</div>
            </div>
        </div>
    )
    }
}