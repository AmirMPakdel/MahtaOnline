import React, { Component } from 'react'
import './dashboard.css';
import Server from '../Server';
import CategoryList from './CategoryList';
import MyCourses from './MyCourses';
import Profile from './Profile';
import Bills from './Bills';
import Streams from './Streams';
import MyTests from './MyTests';
import Controller from '../Controller';
import {Route} from 'react-router-dom';
import {Spin} from 'antd';
import Loading from '../components/Loading';
import { setCookie, getCookie } from '../scripts/cookie';
import Purchase from './Purchase';
import ClassView from './ClassView';

class Dashboard extends Component {

    constructor(props){
        super(props);
        this.pages = [
            <Profile/>,
            <CategoryList/>,
            <MyCourses/>,
            <Bills/>,
            <Streams/>,
            <MyTests/>
        ]
    }

    componentDidMount(){
        Controller.onMenu = this.onMenu;
        Controller.openMenu = this.open_menu;
        Controller.closeMenu = this.close_menu;
        Controller.setNavbar_name = this.setNavbar_name;
        Controller.setPage = this.setPage;

        //TODO: check token then stop loading
        setCookie("_ca", "811603badafe4360a61c6b85a9c8718c");
        setCookie("name", "امیرمحمد پاکدل");
        Controller.setNavbar_name(getCookie("name"));
        
        
        setTimeout(()=>{
            Controller.getConsts(()=>{
                this.state.page = <ClassView/>;
                this.setState(this.state)
            });
        }, 200);

    }
    
    state = {
        user_name:"",
        selected_page_index : 0,
        page:<Loading/>,
    }

    onNavSelect = (index)=>{
        this.setState({selected_page_index:index, 
            page:this.pages[index]});
        this.close_menu();
    }

    onMenu = ()=>{
        if(Controller.menu_is_open){
            this.close_menu();
        }else{
            this.open_menu();
        }
    }

    close_menu = ()=>{
        Controller.menu_is_open = false;
        this.side_navigator_con.style.right = "-12rem";
        Controller.hideBackdrop();
    }

    open_menu = ()=>{
        Controller.menu_is_open = true;
        this.side_navigator_con.style.right = "0rem";
        Controller.showBackdrop();
    }

    setNavbar_name = (name)=>{
        this.setState({user_name:name})
    }

    setPage = (jsx, index)=>{
        this.state.page = jsx;
        this.state.selected_page_index = index;
        this.setState(this.state);
    }

    exit = ()=>{
        //TODO:: exit?!
    }

    render() {
        return (
            <div id="dashboard_con">

                <div id="dashboard">
                    {this.state.page}
                </div>

                <div id="side_navigator_con" ref={r=>this.side_navigator_con=r}>

                    <div id="side_navigator_card">

                        <NavSec selected={this.state.selected_page_index} index={0} length={7} img_name="profile"
                            title={this.state.user_name} onClick={this.onNavSelect}/>
                        <NavSec selected={this.state.selected_page_index} index={1} length={7} img_name="courses_list"
                            title="لیست دوره ها" onClick={this.onNavSelect}/>
                        <NavSec selected={this.state.selected_page_index} index={2} length={7} img_name="my_courses"
                            title="درس های من" onClick={this.onNavSelect}/>
                        <NavSec selected={this.state.selected_page_index} index={3} length={7} img_name="bills"
                            title="پرونده مالی" onClick={this.onNavSelect}/>
                        <NavSec selected={this.state.selected_page_index} index={4} length={7} img_name="streams"
                            title="پخش زنده" onClick={this.onNavSelect}/>
                        <NavSec selected={this.state.selected_page_index} index={5} length={7} img_name="quizes"
                            title="آزمون های من" onClick={this.onNavSelect}/>
                        <NavSec selected={this.state.selected_page_index} index={6} length={7} img_name="exit"
                            title="خروج" onClick={this.exit}/>
                        <NavGap borderRadius="0rem 0rem 1rem 1rem" height="1rem"/>
                        
                    </div>

                </div>
                
            </div>
        )
    }
}

function NavGap(props){
    return(
        <div className="nav_gap" style={{width:'100%', height:props.height,
        borderRadius:props.borderRadius || "0rem"}}/>
    )
}

function NavSec(props){

    let t_color = "white";
    let con_bg = "rgba(0,49,89,1)";
    let gap_radius = "0rem 0rem 0rem 0rem";
    let gap_height = "1.4rem";
    let img = Server.urls.FILE+props.img_name+".png";
    let nav_sec_className = "nav_sec";

    if(props.selected == props.index){

        img = Server.urls.FILE+props.img_name+"_selected.png";
        t_color = "black";
        con_bg = "#f1f1f1";
        gap_radius = "0rem 0rem 0rem 1rem";
        nav_sec_className += " nav_sec_selected"

    }else if(props.selected == props.index-1){

        gap_radius = "1rem 0rem 0rem 0rem";
        img = Server.urls.FILE+props.img_name+".png";
    }

    if(props.index == 0 && props.index == props.selected){
        gap_height = "3rem";
        gap_radius = "1rem 1rem 0rem 1rem";

    }else if(props.index == 0){

        gap_height = "3rem";
        gap_radius = "1rem 1rem 0rem 0rem";
    }

    return(
        <React.Fragment>
        <NavGap borderRadius={gap_radius} height={gap_height}/>
        <div className={nav_sec_className} onClick={()=>props.onClick(props.index)}>

            <div className="nav_sec_h1" style={{background:con_bg,
                color:t_color, borderRadius:"0 1.2rem 1.2rem 0"}}>
                <img className="nav_sec_img" src={img}/>
                <div className="nav_sec_title">{props.title}</div>
            </div>

        </div>
        </React.Fragment>
    )
}

export default Dashboard
