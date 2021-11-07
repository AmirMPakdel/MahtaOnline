import React, { Component } from 'react';
import './streams.css';
import { Breadcrumb, Modal, Button, Checkbox } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import Server from '../Server';
import Spiner from '../components/Loading';
import { getCookie, setCookie } from '../scripts/cookie';

class Streams extends Component {
    state={
        loading:true,
        streams:[],
        no_stream:true,
        modal_visible:false,
    }

    componentDidMount(){
        this.getStreams();
    }
    
    getStreams = ()=>{
        let json = {token:getCookie("_ca")}
        Server.post_request(Server.urls.ONLINE_STREAMS, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                if(res.data){
                    this.state.streams = res.data;
                    this.state.no_stream = false;
                    this.setState(this.state);
                }
            }
            this.state.loading = false;
            this.setState(this.state);
        });
    }

    onModalNext = ()=>{
    }

    onModalCheck = (e)=>{
        if(e.target.checked){
            setCookie("stream_check", true, 9999);
        }else{
            setCookie("stream_check", false, 9999);
        }
    }

    showModal = (onModalNext)=>{
        
        this.onModalNext = ()=>{
            this.setState({modal_visible:false}, onModalNext)
        };

        this.setState({modal_visible:true})
    }

    onModalCancel=()=>{
        this.setState({modal_visible:false})
    }

    render() {
        if(this.state.loading){

            return(<div id="streams"><Spiner/></div>)

        }else{

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
                        this.state.no_stream?
                        <div id="streams_holder">
    
                            <div className="streams_alert_card_con">
                                <div className="streams_alert_lable"/>
                                <div className="streams_alert_text">{tx}</div>
                            </div>
    
                        </div>:
                        
                        <React.Fragment>
                            {
                                this.state.streams.map((v, i)=>(
                                    <StreamCard key={`${i}`} data={v} showModal={this.showModal}/>
                                ))
                            }
                        </React.Fragment>
                    }

                    <Modal title={"توجه"} visible={this.state.modal_visible} onCancel={this.onModalCancel}
                        footer={null}>
                        <div className="stream_info_text" style={{direction:"rtl", marginTop:"1rem", fontSize:"1.2rem", color:"#333"}}>
                        {" - "+"برای ورود به کلاس از کدملی خودتان هم به عنوان نام کاربری و هم رمزعبور استفاده کنید"}</div>
                        
                        <div className="stream_info_text" style={{direction:"rtl", marginTop:"0.5rem", fontSize:"1.2rem", color:"#333"}}>
                            {" - "+"اگر در جلسه رایگان شرکت میکنید از گزینه ورود مهمان استفاده کنید"}</div>
                    
                        <div style={{marginTop:"1.5rem", width:"100%", display:"flex", flexDirection:"row-reverse"}}>
                        <Checkbox style={{marginLeft:"0.5rem"}} onChange={this.onModalCheck}/>
                        {"عدم نمایش دوباره"}
                        </div>

                        <div title="ادامه" style={{height:"2.6rem", width:"6rem", backgroundColor:"#0091EA", marginTop:"-1rem",cursor:"pointer",
                        borderRadius:"0.5rem", color:"white", display:"flex",alignItems:"center", justifyContent:"center"}}
                        onClick={this.onModalNext}>{"ادامه"}</div>
                    </Modal>
                </div>
            )
        }
    }
}

export default Streams

const tx = `در حال حاضر کلاس آنلاینی برای شما وجود ندارد`

class StreamCard extends Component{

    onEnter=()=>{
        if(getCookie("stream_check")=="true"){
            
            window.open(this.props.data.room_url);

        }else{

            this.props.showModal(()=>{
                window.open(this.props.data.room_url);
            })
        }
    }

    render(){
        let image = `url(${Server.urls.DBFILE+this.props.data.teacher_avatar})`
        if(!this.props.data.teacher_avatar){
            image = `url(${Server.urls.FILE+"empty_stream.png"})`
        }
    return(
        <div className="stream_card_con">

            <div className="stream_card_sec">

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_info_title")}/>
                    <div className="stream_card_text">{this.props.data.course_title}</div>
                </div>

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_info_teacher")}/>
                    <div className="stream_card_text">{this.props.data.teacher_name}</div>
                </div>

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_session")}/>
                    <div className="stream_card_text">{this.props.data.session_title}</div>
                </div>

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_info_time")}/>
                    <div className="stream_card_text">{"از ساعت"+" "+this.props.data.start_min + " : "+this.props.data.start_hour}</div>
                </div>

                <div className="stream_card_row">
                    <img className="stream_card_icon" src={Server.img_png("class_info_time")}/>
                    <div className="stream_card_text">{"تا ساعت"+" "+this.props.data.finish_min + " : "+this.props.data.finish_hour}</div>
                </div>

            </div>

            <div className="stream_card_img" style={{backgroundImage:image}}/>

            <div className="stream_card_button" onClick={this.onEnter}>{"ورود به جلسه"}</div>
        </div>
    )
    }
}