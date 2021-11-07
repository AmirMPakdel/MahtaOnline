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
import { getCookie } from "../scripts/cookie";
import MyCourses from "./MyCourses";
import Purchase from "./Purchase";
import { priceNum } from "../scripts/persianNum";

export default class ViewPlan extends Component {

  constructor(props){
    super(props);
    this.state={
      registered:false, CourseList:[], plan:this.props.plan, off_price:{percent:20}
    }
    if(!this.props.plan){this.state.plan={}}
  }

  componentDidMount(){
    window.location.hash = "viewplan";
    window.addEventListener("hashchange", this.onHashChange);
    this.check_registered(this.get_plan_courses);
  }

  componentWillUnmount(){
    window.removeEventListener("hashchange", this.onHashChange);
  }

  onHashChange = ()=>{
    if(window.location.hash == "#planslist"){
        this.BackToViewPlanList();
    }else if(window.location.hash == "#mycourses"){
      this.BackToMyCourses();
    }
  }

  get_plan_courses = (cb)=>{
    let lp_plan_id=window.localStorage.getItem("lp_plan_id");
    if(lp_plan_id){
      Server.get_request("/api/plan/"+lp_plan_id+"/info", (res)=>{
        if(res.result_code == Server.ResultCode.SUCCESS){
          this.state.plan = res.data;
          let json = {token:getCookie("_ca"),plan_id:this.state.plan.id}
          Server.post_request(Server.urls.GET_PLANS, json, (res)=>{
          if(res.result_code == Server.ResultCode.SUCCESS){
            this.state.CourseList = res.data;
            window.localStorage.removeItem("lp_plan_id");
            this.setState(this.state, cb);
          }else{
            this.setState(this.state, cb);
          }
      })
        }else{
          this.setState(this.state, cb);
        }
      });
    }else{
      if(this.state.plan.id){
        let json = {token:getCookie("_ca"),plan_id:this.state.plan.id}
        Server.post_request(Server.urls.GET_PLANS, json, (res)=>{
          if(res.result_code == Server.ResultCode.SUCCESS){
            this.state.CourseList = res.data;
            this.setState(this.state, cb);
          }else{
            this.setState(this.state, cb);
          }
        })
      }else{
        window.location.href="/dashboard";
      }
    }
  }

  check_registered = (cb)=>{
    let json = {token:getCookie("_ca"), plan_id:this.state.plan.id};
    Server.post_request(Server.urls.CHECK_PLAN_REGISTERED, json, (res)=>{
      if(res.result_code == Server.ResultCode.SUCCESS){
        if(res.data){this.state.registered = true}
        cb();
      }else{
        cb();
      }
    });
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

  BackToMyCourses = ()=>{
    Controller.setPage(
      <MyCourses/>
      ,2
    )
  }

  onBuy = ()=>{
    if(this.state.registered){return};
    if(this.state.CourseList.length==0){return};
    Controller.setPage(<Purchase plan={this.state.plan} category={this.props.category}/>,1);
  }

  free_plan_purchase = (plan_id)=>{
    if(this.state.registered){return};
    let json = {token:getCookie("_ca"), plan_id}
    Server.post_request(Server.urls.PURCHASE_FREE_PLAN, json, (res)=>{
      if(res.result_code == Server.ResultCode.SUCCESS){
        this.state.registered = true;
        this.get_plan_courses(()=>{
          Controller.openNotification("ثبت نام در این دوره رایگان با موفقیت انجام شد",null, "success");
        });
      }else{
        Controller.openNotification(Server.ResultCode2Message(res.result_code),null, "error");
      }
    });
  }

  render() {

    let price = this.state.plan.region_one_price;
    if(Controller.region == 2){price = this.state.plan.region_two_price}else
    if(Controller.region == 3){price = this.state.plan.region_three_price}

    let discount = this.state.plan.discount;

    return (
      <div id="course_list">
        <div className="course_info_title">{this.state.plan.title}</div>

        <div className="Breadcrumb_con" style={{paddingRight:"3rem", marginBottom:"1rem"}}>
          <Breadcrumb separator="/">
            <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
            {
              !this.props.category?
              <Breadcrumb.Item href="#" onClick={this.BackToMyCourses}>{"طرح های من"}</Breadcrumb.Item>
              :<React.Fragment>
              <Breadcrumb.Item href="#" onClick={this.BackToCategoryList}>{"دسته بندی طرح ها"}</Breadcrumb.Item>
              <Breadcrumb.Item href="#" onClick={this.BackToViewPlanList}>{"لیست طرح ها"}</Breadcrumb.Item>
              </React.Fragment>
            }
            <Breadcrumb.Item>{"توضیحات طرح"}</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {
          this.props.owned || this.state.CourseList.length==0?null:
          <div className="course_info_top_side">
            <InfoCard onBuy={this.onBuy} price={price} discount={discount} cover={this.state.plan.cover} registered={this.state.registered}
            title={this.state.plan.title}  plan_id={this.state.plan.id} free_plan_purchase={this.free_plan_purchase}/>
          </div>
        }

        <div className="course_info_holder">
          {
            this.props.owned || this.state.CourseList.length==0?null:
            <div className="course_info_left_side">
            <InfoCard onBuy={this.onBuy} price={price} discount={discount} cover={this.state.plan.cover} registered={this.state.registered}
            title={this.state.plan.title} plan_id={this.state.plan.id} free_plan_purchase={this.free_plan_purchase}/>
            </div>
          }
          <div className="course_info_right_side">
            {
              this.state.CourseList.length == 0?
              <Loading/>:
              this.state.CourseList.map((v,i)=>{
                let collapsed = true;
                if(this.state.CourseList.length == 1){
                  collapsed = false;
                }
                return(<ClassInfo_card collapsed={collapsed} data={v} plan={this.state.plan} owned={this.props.owned}
                  category={this.props.category}/>)
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

function PriceSec(props){

  let title = "قیمت منطقه یک"
  if(Controller.region == 2){title = "قیمت منطقه دو"}else
  if(Controller.region == 3){title = "قیمت منطقه سه"}

  return(
    <div className="course_info_price_sec">
      <div className="course_info_sec1">
        {title}
      </div>
      <div className="course_info_sec2">
        {
          props.discount?
          <div className="course_info_price_nooff">{priceNum(props.price)+" تومان "}</div>:null
        }
        <div className="course_info_price_withoff">
          {priceNum(props.price-(props.price*(props.discount/100)))+" تومان "}</div>
      </div>
    </div>
  )
}

function InfoCard(props){
  
  let register_style = {};
  let free_register_title="ثبت نام دوره رایگان";
  let register_title="ثبت نام دوره";
  if(props.registered){
    register_style = {backgroundColor:"gray", cursor:"default"};
    free_register_title="ثبت نام شده";
    register_title="ثبت نام شده";
  }

  return(

    <div className="course_info_left_card">
      <div
        className="course_info_card_img"
        style={{
          backgroundImage: `url(${Server.urls.DBFILE + props.cover})`,
        }}
      />

      <div className="course_info_card_title">
        {props.title}
      </div>

      {/* <div className="course_info_card_teacher">{"استاد خمینی"}</div> */}

      <div className="course_info_card_line" />

      <div style={{height:"1rem"}}/>

      {
        props.discount?
        <div className="course_info_card_off">{"تخفیف "+ "%"+props.discount}</div>:null
      }

      {
        <PriceSec price={props.price} discount={props.discount}/>
      }

      {
        props.price != 0?
        <div className="course_info_card_btn" style={register_style} onClick={props.onBuy}>{register_title}</div>:
        <div className="course_info_card_btn" style={register_style} onClick={()=>{props.free_plan_purchase(props.plan_id)}}>{free_register_title}</div>
      }
      
    </div>
  )
}