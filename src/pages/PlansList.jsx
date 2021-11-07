import React, { Component } from 'react';
import ViewPlan from './ViewPlan';
import './plansList.css';
import Server from '../Server';
import { Menu, Dropdown, Button, Breadcrumb } from 'antd';
import {DownOutlined, HomeOutlined} from '@ant-design/icons'
import Controller from '../Controller';
import CategoryList from './CategoryList';
import Purchase from './Purchase';

export default class PlansList extends Component {
    
    state = {planList:[], selectedPlan:undefined,
    grade_filter:"null", field_filter:"null", tag_filter:"null"}

    componentDidMount(){
        window.location.hash = "planslist";
        window.addEventListener("hashchange", this.onHashChange);
        this.getList(this.props.category.id, "null", "null", "null");
    }

    componentWillUnmount(){
        window.removeEventListener("hashchange", this.onHashChange);
    }

    onHashChange = ()=>{
        if(window.location.hash == "#categorylist"){
            this.BackToCategoryList();
        }
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

    onMoreInfo = (data)=>{
        
        Controller.setPage(
            <ViewPlan plan={data} category={this.props.category}/>,
            1
        )
    }

    onBuy = (data)=>{

        Controller.setPage(
            <Purchase plan={data}/>,
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
                    <PlanCard key={`cc${i}`} data={v} onBuy={this.onBuy} onMoreInfo={this.onMoreInfo}/>
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
            this.state.grade_list = Object.assign([],data.grade_list);
            this.state.field_list = Object.assign([],data.field_list);
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

            <Dropdown trigger={['click']} overlay={<FilterMenu list={field_list} onSelect={(v)=>{this.onSelect(v,"field")}}/>} placement="bottomLeft">
                <Button className="view_courses_filter_btn">
                    {this.state.field_filter.title}
                    <DownOutlined/>
                </Button>
            </Dropdown>
            <Dropdown trigger={['click']} overlay={<FilterMenu list={grade_list} onSelect={(v)=>this.onSelect(v,"grade")}/>} placement="bottomLeft">
                <Button className="view_courses_filter_btn">
                    {this.state.grade_filter.title}
                    <DownOutlined/>
                </Button>
            </Dropdown>
            {/* <Dropdown overlay={<FilterMenu list={tag_list} onSelect={(v)=>this.onSelect(v,"tag")}/>} placement="bottomLeft">
                <Button className="view_courses_filter_btn">
                    {this.state.tage_filter.title}
                    <DownOutlined/>
                </Button>
            </Dropdown> */}

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
        <div className="view_courses_card_con">

            <img className="view_courses_card_img" src={Server.urls.DBFILE+props.data.cover}/>

            <div className="view_courses_card_title">{props.data.title}</div>
            <div className="view_courses_card_sub">{"رشته"+ " : "+ props.data.field}</div>
            <div className="view_courses_card_sub">{"پایه"+ " : "+ props.data.grade}</div>
            {/* <div className="view_courses_card_sub">{"قیمت"+ " : "+ "450000"}</div> */}

            <div className="view_courses_card_btn_con">
                <div className="view_courses_card_right" 
                onClick={()=>props.onMoreInfo(props.data)}>{"نمایش جزئیات طرح"}</div>
                {/* <div className="view_courses_card_left" 
                onClick={()=>props.onBuy(props.data)}>{"ثبت نام"}</div> */}
            </div>

            {
                props.data.is_free && !props.data.is_full?
                <div className="view_course_card_free_tag">{"رایگان"}</div>:null
            }
            {
                props.data.is_full?
                <div className="view_course_card_full_tag">{"تکمیل ظرفیت"}</div>:null
            }
            
        </div>
    )
}
