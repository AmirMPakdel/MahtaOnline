import React, { Component } from 'react'
import './categoryList.css';
import Server from '../Server';
import PlansList from './PlansList';
import Controller from '../Controller';
import { Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons'

class CourseList extends Component {
    
    state={categoryList:[], selectedCategory:undefined}

    componentDidMount(){

        Server.get_request(Server.urls.GET_CATEGORY_LIST, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                this.state.categoryList = res.data;
                this.setState(this.state);
            }
        })
    }

    onSelect = (cat)=>{
        Controller.setPage(
            <div id="course_list" key={"catList"}>
                <PlansList category={cat}/>
            </div>
            ,1
        )
    }

    render() {
        return (
            <div id="course_list">
                
                <React.Fragment>

                    <div id="course_list_title">{"دسته بندی دوره ها"}</div>

                    <div className="Breadcrumb_con">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                        <Breadcrumb.Item>{"دسته بندی دوره ها"}</Breadcrumb.Item>
                    </Breadcrumb>
                    </div>

                    <div id="course_list_holder">

                        {/* <CourseCard onSelect={this.onSelect} title="دوره های سالانه" sub_title="شرح کامل دروس" 
                            img={Server.urls.FILE+"calendar.png"}/>

                        <CourseCard onSelect={this.onSelect} title="دوره های نیترو" sub_title="نکته و تست" 
                            img={Server.urls.FILE+"boost.png"}/>

                        <CourseCard onSelect={this.onSelect} title="کلاس یار" sub_title="ویژه مدارس" 
                            img={Server.urls.FILE+"assist.png"}/> */}

                        {
                            this.state.categoryList.map((v,i)=>(
                                <CourseCard key={`ca${i}`} id={v.id} onSelect={()=>this.onSelect(v)} title={v.title} sub_title={v.description} 
                                img={v.logo}/>
                            ))
                        }

                    </div>

                </React.Fragment>
            </div>
        )
    }
}

function CourseCard(props){

    return(
        <div className="course_card" onClick={()=>{props.onSelect(props.title)}}>

            <div className="course_card_title">{props.title}</div>

            <div className="course_card_line"/>

            <div className="course_card_sub">{props.sub_title}</div>

            <img className="course_card_img" src={props.img}/>

            <div className="course_card_button">{"مشاهده لیست دروس"}</div>

            <img className="course_card_back_img" src={props.img}/>

        </div>
    )
}

export default CourseList
