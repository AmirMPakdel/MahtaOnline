import React, { Component } from "react";
import { Collapse, Input, Form, Button } from "antd";
import "./profile_Upload.css";
import Server from "../Server";
import Controller from '../Controller';
import { getCookie, setCookie } from "../scripts/cookie";
import Axios from "axios";

class Profile_Upload extends Component {
  state = { signinLoading: false, can_continue: false,
    govahi_img:Server.img_png("upload_img"),
    govahi_img_empty:true,
    kartmeli_img:Server.img_png("upload_img"),
    kartmeli_img_empty:true,};

  govahi_eshteghal = null;
  karte_meli = null;

  componentDidMount(){
    let token = getCookie("_ca");
    
    Server.post_request(Server.urls.GET_PROFILE, {token}, (res)=>{
      if(res.result_code == Server.ResultCode.SUCCESS){
        if(res.data.national_card_image){
          this.state.kartmeli_img_empty = false;
          this.state.kartmeli_img = Server.urls.DBFILE+res.data.national_card_image
        }
        if(res.data.enrollment_certificate_image){
          this.state.govahi_img_empty = false;
          this.state.govahi_img = Server.urls.DBFILE+res.data.enrollment_certificate_image;
        }
        this.setState(this.state);
      }
    });
  }

  openFile1 = (e) => {
    this.filePick1.click();
    this.filePick1.onchange = (e)=>{

        let file = e.target.files[0];
        let url = URL.createObjectURL(file);
        let img = new Image();
        img.src = url;
        
        img.onload = ()=>{

            if(file.size < (2*1024*1024)){
                
                let formData = new FormData();
                formData.append("token", getCookie("_ca"));
                formData.append("image", file);
                formData.append("action", "create");
                Axios.post(Server.domain+Server.urls.UPLOAD_NCI, formData).then(res=>{
                  
                  let {data} = res;
                  if(data.result_code == Server.ResultCode.SUCCESS){
                    this.karte_meli = file;
                    this.state.kartmeli_img = img.src;
                    this.state.kartmeli_img_empty =false;
                    this.setState(this.state);
                  }else{
                    Controller.openNotification("خطا در آپلود عکس", null, "error");
                  }
                });

            }else{
                Controller.openNotification("خطای بارگذاری عکس", "عکس انتخابی حجم بالای 2 مگابایت دارد","error")
            }
        };
    }
  };

  openFile2 = (e) => {
    this.filePick2.click();
    this.filePick2.onchange = (e)=>{

        let file = e.target.files[0];
        let url = URL.createObjectURL(file);
        let img = new Image();
        img.src = url;
        
        img.onload = ()=>{

            if(file.size < (2*1024*1024)){
              let formData = new FormData();
                formData.append("token", getCookie("_ca"));
                formData.append("image", file);
                formData.append("action", "create");
                Axios.post(Server.domain+Server.urls.UPLOAD_ECI, formData).then(res=>{
                  
                  let {data} = res;
                  if(data.result_code == Server.ResultCode.SUCCESS){
                    this.govahi_eshteghal = file;
                    this.state.govahi_img = img.src;
                    this.state.govahi_img_empty=false;
                    this.setState(this.state);
                  }else{
                    Controller.openNotification("خطا در آپلود عکس", null, "error");
                  }
                });
                
            }else{
                Controller.openNotification("خطای بارگذاری عکس", "عکس انتخابی حجم بالای 2 مگابایت دارد","error")
            }
        };
    }
  };

  render() {
    let up_img = {height:"inherit",width:"auto", maxWidth:"96%", padding:"0.6rem", borderRadius:"2rem"}
    let govahi_img_style = {};
    let kartmeli_img_style = {};
    if(!this.state.govahi_img_empty){govahi_img_style = {flex:1}}
    if(!this.state.kartmeli_img_empty){kartmeli_img_style = {height:"90%",width:"auto"}}
    return (
      <Collapse
        bordered
        defaultActiveKey={["1"]}
        className="user_info_header_con"
      >
        <Collapse.Panel header={<Header complete={this.props.complete} title={this.props.title} />} key="1">
          <div className="profile_upload_con">
            <div className="profile_upload_sec">
              <div className="profile_upload_title">{tx1}</div>

              <div className="profile_upload_pic_con">
                <img
                  className="profile_upload_nopic"
                  style={!this.state.kartmeli_img_empty?up_img:null}
                  src={this.state.kartmeli_img}
                />

                <div className="profile_upload_addpic_con"
                  onClick={this.openFile1}>
                  {"انتخاب فایل"}
                  <input
                    type="file"
                    id="karte_meli"
                    name="karte_meli"
                    accept="image/png, image/jpeg"
                    ref={(r) => (this.filePick1 = r)}
                    style={{ display: "none" }}
                  />
                  <img
                    className="profile_upload_addicon"
                    src={Server.img_png("upload_add")}
                  />
                </div>
              </div>

              <div className="profile_upload_tx">{tx2}</div>

              <div className="profile_upload_tx">{tx3}</div>
            </div>

            <div className="profile_upload_sec">
              <div className="profile_upload_title">{tx4}</div>

              <div className="profile_upload_pic_con">
                <img
                  className="profile_upload_nopic"
                  style={!this.state.govahi_img_empty?up_img:null}
                  src={this.state.govahi_img}
                />

                <div
                  className="profile_upload_addpic_con"
                  onClick={this.openFile2}
                >
                  {"انتخاب فایل"}
                  <input
                    type="file"
                    id="govahi_eshteghal"
                    name="govahi_eshteghal"
                    accept="image/png, image/jpeg"
                    ref={(r) => (this.filePick2 = r)}
                    style={{ display: "none" }}
                  />
                  <img
                    className="profile_upload_addicon"
                    src={Server.img_png("upload_add")}
                  />
                </div>
              </div>

              <div className="profile_upload_tx">{tx2}</div>

              <div className="profile_upload_tx">{tx3}</div>
            </div>
          </div>
        </Collapse.Panel>
      </Collapse>
    );
  }
}

function Header(props) {
  let header_img = "alert";
  if(props.complete){header_img="done"};
  return (
    <div className="profile_sec_header_con">
      <div />
      <div className="profile_sec_header_title_con">
        <div className="profile_sec_header_title">{props.title}</div>
        <div className="profile_sec_header_line" />
      </div>
      {/* <img className="profile_sec_header_img" src={Server.img_png(header_img)} /> */}
      <img className="profile_sec_header_img"/>
    </div>
  );
}

export default Profile_Upload;

const tx1 = `بارگذاری تصویر کارت ملی`;
const tx2 = `فرمت‌های مجاز: png , jpg, jpeg`;
const tx3 = `حجم مجاز: حداکثر 2 مگابایت`;
const tx4 = `بارگذاری تصویر گواهی اشتغال به تحصیل`;
