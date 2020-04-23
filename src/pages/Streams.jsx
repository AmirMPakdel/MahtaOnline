import React, { Component } from 'react';
import './streams.css';
import { Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import Server from '../Server';

class Streams extends Component {
    state={
        list:[{}, {},{}]
    }

    render() {
        return (
            <div id="streams">
                <div id="streams_title">{"پخش زنده"}</div>
                <div className="Breadcrumb_con">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                        <Breadcrumb.Item>{"پخش زنده"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                {
                    false?
                    <div id="streams_holder">

                        <div className="streams_alert_card_con">
                            <div className="streams_alert_lable"/>
                            <div className="streams_alert_text">{tx}</div>
                        </div>

                    </div>:

                    this.state.list.map((v,i)=>{
                        return(
                            <StreamCard/>
                        )
                    })
                }
                
                
            </div>
        )
    }
}

export default Streams

const tx = `در حال حاضر کلاس آنلاینی برای شما وجود ندارد`

class StreamCard extends Component{
    render(){
        let image = `url(${Server.img_png("view_course_card")})`
    return(
        <div className="stream_card_con">

            <div className="stream_card_sec">

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_info_title")}/>
                    <div className="stream_card_text">{"شیمی"}</div>
                </div>

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_info_teacher")}/>
                    <div className="stream_card_text">{"استاد نصیری فرد"}</div>
                </div>

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_session")}/>
                    <div className="stream_card_text">{"جلسه یازدهم"}</div>
                </div>

            </div>

            <div className="stream_card_img" style={{backgroundImage:image}}/>

            <div className="stream_card_button">{"ورود به جلسه"}</div>

        </div>
    )
    }
}