import { Checkbox, ConfigProvider } from "antd";
import React, { Component } from "react";
import "./MyTestFilterDialog.css";
import {Radio} from 'antd'

export default class MyTestFilterDialog extends Component {

    constructor(props){
        super(props);
        this.state = {
            running_tests:true,
            free_tests:true,
            remaining_tests:true,
            taken_tests:true,
            from_day:"",
            from_month:"",
            from_year:"",
            to_day:"",
            to_month:"",
            to_year:"",
            SelectedCourse:0,
        }

        if(props.data){
            this.state = Object.assign({},props.data);
        }
    }

    onCourseChange = (e)=>{
        this.setState({SelectedCourse:e.target.value});
    }

    onDateChange = (key, value)=>{
        if(!isNaN(Number(value))){
            let obj={};
            obj[key]=value;
            this.setState(obj)
        }
    }

    onTypeChange = (key, value)=>{
        let obj={};
        obj[key]=value;
        this.setState(obj)
    }
    
    render(){
        return(
            <div id="mtest_flt_dlg_con">

                <div id="mtest_flt_dlg_wrapper">
                    <ConfigProvider direction="rtl">

                    <div className={"mtest_flt_dlg_title"}>{"تاریخ آزمون"}</div>

                    <div id="mtest_flt_dlg_date_con">
                        {"از تاریخ"}
                        <input className="mtest_flt_dlg_input_day" placeholder={"روز"}
                        onChange={e=>this.onDateChange("from_day", e.target.value)}
                        value={this.state.from_day}/>
                        {"/"}
                        <input className="mtest_flt_dlg_input_day" placeholder={"ماه"}
                        onChange={e=>this.onDateChange("from_month", e.target.value)}
                        value={this.state.from_month}/>
                        {"/"}
                        <input className="mtest_flt_dlg_input_year" placeholder={"سال"}
                        onChange={e=>this.onDateChange("from_year", e.target.value)}
                        value={this.state.from_year}/>
                        
                    </div>

                    <div id="mtest_flt_dlg_date_con">
                        {"تا تاریخ"}
                        <input className="mtest_flt_dlg_input_day" placeholder={"روز"}
                        onChange={e=>this.onDateChange("to_day", e.target.value)}
                        value={this.state.to_day}/>
                        {"/"}
                        <input className="mtest_flt_dlg_input_day" placeholder={"ماه"}
                        onChange={e=>this.onDateChange("to_month", e.target.value)}
                        value={this.state.to_month}/>
                        {"/"}
                        <input className="mtest_flt_dlg_input_year" placeholder={"سال"}
                        onChange={e=>this.onDateChange("to_year", e.target.value)}
                        value={this.state.to_year}/>
                    </div>

                    <div style={{marginTop:"0.5rem"}}/>

                    <div className={"mtest_flt_dlg_title"}>{"نوع آزمون"}</div>

                    <Checkbox onChange={(e)=>this.onTypeChange("running_tests", e.target.checked)} 
                    checked={this.state.running_tests} >{"درحال برگزاری"}</Checkbox>

                    <Checkbox onChange={(e)=>this.onTypeChange("free_tests", e.target.checked)} 
                    checked={this.state.free_tests}>{"آزمون های شناور"}</Checkbox>

                    <Checkbox onChange={(e)=>this.onTypeChange("remaining_tests", e.target.checked)} 
                    checked={this.state.remaining_tests}>{"آزمون های باقی مانده"}</Checkbox>

                    <Checkbox onChange={(e)=>this.onTypeChange("taken_tests", e.target.checked)}
                    checked={this.state.taken_tests}>{"آزمون های برگزار شده"}</Checkbox>

                    <div style={{marginTop:"1rem"}}/>

                    <div className={"mtest_flt_dlg_title"}>{"دروه ها"}</div>

                    <Radio.Group onChange={this.onCourseChange} value={this.state.SelectedCourse}>
                        <Radio value={0}>{"همه دوره ها"}</Radio>
                        {
                        this.props.myCourses.map((v,i)=>(
                            <div key={`${i}`}>
                                <Radio  value={v.id}>{v.title}</Radio>
                            </div>
                        ))
                        }
                    </Radio.Group>

                    </ConfigProvider>

                </div>

            </div>
        )
    }
}