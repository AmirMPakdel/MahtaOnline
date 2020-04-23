import React, { Component } from 'react';
import ViewPlan from './ViewPlan';
import './plansList.css';
import Server from '../Server';
import { Menu, Dropdown, Button, Breadcrumb } from 'antd';
import {DownOutlined, HomeOutlined} from '@ant-design/icons'
import Controller from '../Controller';
import CategoryList from './CategoryList';

export default class PlansList extends Component {
    
    state = {planList:[], selectedPlan:undefined,
    grade_filter:"null", field_filter:"null", teacher_filter:"null"}

    componentDidMount(){

        this.getList(this.props.category.id, "null", "null", "null");
    }

    getList = (category_id, tag_id, grade_id, field_id)=>{

        Server.get_request(`/api/plans/${category_id}/${tag_id}/${grade_id}/${field_id}`, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                this.state.planList = res.data;
                this.setState(this.state);
                console.log(res.data);
            }
        });
    }

    onSelect = (data)=>{
        
        Controller.setPage(
            <div id="course_list">
                <ViewPlan plan={data} category={this.props.category}/>
            </div>,
            1
        )
    }

    onFilter = (v, type)=>{
        this.state[type+"_filter"] = v.id;
        
        this.getList(this.props.category.id, "null", this.state.grade_filter, this.state.field_filter);
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
            <div className="view_courses_title">{"دوره های سالانه"}</div>

            <div className="Breadcrumb_con">
            <Breadcrumb separator="/">
                <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                <Breadcrumb.Item href="#" onClick={this.BackToCategoryList}>{"دسته بندی طرح ها"}</Breadcrumb.Item>
                <Breadcrumb.Item>{"لیست طرح ها"}</Breadcrumb.Item>
            </Breadcrumb>
            </div>

            <Filters onSelect={this.onFilter}/>

            <div className="view_courses_card_list">
            {
                this.state.planList.map((v,i)=>(
                    <PlanCard key={`cc${i}`} data={v} onClick={this.onSelect}/>
                ))
            }
            </div>
            </React.Fragment>
        )
    }
}

class Filters extends Component{

    state = {
        grade_list:[],
        field_list:[],
        tag_list:[],

        grade_filter:{id:0, title:"پایه"},
        field_filter:{id:0, title:"رشته"},
        teacher_filter:{id:0, title:"درس"},
    }

    componentDidMount(){

        Controller.getConsts((data)=>{
            this.state.grade_list = data.grade_list;
            this.state.field_list = data.field_list;
            this.state.grade_list.unshift({id:"null", title:"همه پایه ها"});
            this.state.field_list.unshift({id:"null", title:"همه رشته ها"});
            this.state.tag_list.unshift({id:"null", title:"همه دروس"});
            this.setState(this.state);
        });
    }

    onSelect = (data, type)=>{
        this.state[type+"_filter"] = data;
        this.props.onSelect(data, type);
        this.setState(this.state);
    }

    render(){
        let {grade_list, field_list, tag_list} = this.state;
        
    return(
        <div className="view_courses_filter">

            <Dropdown overlay={<FilterMenu list={field_list} onSelect={(v)=>{this.onSelect(v,"field")}}/>} placement="bottomLeft">
                <Button className="view_courses_filter_btn">
                    {this.state.field_filter.title}
                    <DownOutlined/>
                </Button>
            </Dropdown>
            <Dropdown overlay={<FilterMenu list={grade_list} onSelect={(v)=>this.onSelect(v,"grade")}/>} placement="bottomLeft">
                <Button className="view_courses_filter_btn">
                    {this.state.grade_filter.title}
                    <DownOutlined/>
                </Button>
            </Dropdown>
            <Dropdown overlay={<FilterMenu list={tag_list} onSelect={(v)=>this.onSelect(v,"teacher")}/>} placement="bottomLeft">
                <Button className="view_courses_filter_btn">
                    {this.state.teacher_filter.title}
                    <DownOutlined/>
                </Button>
            </Dropdown>

        </div>
    )}
}

function FilterMenu(props){
    return(
        <Menu>
            {
                props.list.map((v,i)=>{

                    let st = {textAlign:'right'};
                    if(props.selected_id == v.id){
                        st.color = "gold"
                    }
                    return(
                    <Menu.Item>
                        <a style={st} onClick={()=>props.onSelect(v)}>
                            {v.title}
                        </a>
                    </Menu.Item>
                )})
            }
        </Menu>
    );
}

function PlanCard(props){

    return(
        <div className="view_courses_card_con" onClick={()=>props.onClick(props.data)}>

            <img className="view_courses_card_img" src={Server.img_png("view_course_card")}/>

            <div className="view_courses_card_title">{props.data.title}</div>
            <div className="view_courses_card_sub">{"رشته"+ " : "+ "تجربی"}</div>
            <div className="view_courses_card_sub">{"پایه"+ " : "+ "تجربی"}</div>
            {/* <div className="view_courses_card_sub">{"قیمت"+ " : "+ "450000"}</div> */}

            <div className="view_courses_card_btn_con">
                <div className="view_courses_card_right">{"جزئیات"}</div>
                <div className="view_courses_card_left">{"ثبت نام"}</div>
            </div>

        </div>
    )
}
