import React, { Component } from "react";
import "./viewPlan.css";
import Server from "../Server";
import ClassInfo_card from "../components/ClassInfo_card";
import {Breadcrumb, Spin} from 'antd';
import {HomeOutlined} from '@ant-design/icons'
import Controller from "../Controller";
import PlansList from "./PlansList";
import CategoryList from './CategoryList';
import Loading from "../components/Loading";

export default class ViewPlan extends Component {

  state = {CourseList:[], off_price:{percent:20}}

  componentDidMount(){
    
    Server.get_request(`/api/plan/${this.props.plan.id}/courses`, (res)=>{

      if(res.result_code == Server.ResultCode.SUCCESS){
        this.state.CourseList = res.data;
        this.setState(this.state);
      }
    })
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

  render() {
    return (
      <React.Fragment>
        <div className="course_info_title">{"تاریخ معاصر ایران"}</div>

        <div className="Breadcrumb_con" style={{paddingRight:"3rem", marginBottom:"1rem"}}>
          <Breadcrumb separator="/">
            <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
            <Breadcrumb.Item href="#" onClick={this.BackToCategoryList}>{"دسته بندی طرح ها"}</Breadcrumb.Item>
            <Breadcrumb.Item href="#" onClick={this.BackToViewPlanList}>{"لیست طرح ها"}</Breadcrumb.Item>
            <Breadcrumb.Item>{"توضیحات طرح"}</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <div className="course_info_top_side">
          <InfoCard/>
            
        </div>

        <div className="course_info_holder">
          <div className="course_info_left_side">
            <InfoCard/>
          </div>

          <div className="course_info_right_side">
            
            {
              this.state.CourseList.length == 0?<Loading glass top="10rem"/>:
              this.state.CourseList.map((v,i)=>{
                let collapsed = true;
                if(this.state.CourseList.length == 1){
                  collapsed = false;
                }
                return(<ClassInfo_card collapsed={collapsed} data={v}/>)
              })
            }

          </div>
        </div>
      </React.Fragment>
    );
  }
}

function PriceSec(props){

  return(
    <div className="course_info_price_sec">
      <div className="course_info_sec1">
        {"قیمت منطقه سه"}
      </div>
      <div className="course_info_sec2">
        <div className="course_info_price_nooff">{"650000"}</div>
        <div className="course_info_price_withoff">{"550000"}</div>
      </div>
    </div>
  )
}

function InfoCard(props){
  return(

    <div className="course_info_left_card">
      <div
        className="course_info_card_img"
        style={{
          backgroundImage: `url(${Server.img_png("view_course_card")})`,
        }}
      />

      <div className="course_info_card_title">
        {"تاریخ معاصر ایران"}
      </div>

      <div className="course_info_card_teacher">{"استاد خمینی"}</div>

      <div className="course_info_card_line" />

      {
        <div className="course_info_card_off">{"تخفیف "+ "%25"}</div>
      }

      <PriceSec price={650000} title="منطقه یک"/>
      <PriceSec price={550000} title="منطقه دو"/>
      <PriceSec price={450000} title="منطقه سه"/>

      <div className="course_info_card_btn">{"ثبت نام دوره"}</div>
    </div>
  )
}