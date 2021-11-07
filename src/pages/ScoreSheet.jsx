import React, { Component } from 'react';
import './scoreSheet.css';
import Server from '../Server';
import { getCookie } from '../scripts/cookie';
import Header from '../page_parts/Header';
import Spiner from '../components/Spiner';
import Controller from '../Controller';
import MyTests from './MyTests';

export default class ScoreSheet extends Component {
    
    state={
        loading:true,
        data:{},
        test_title:"",
        mode:"none",
        selectedSocre:{},
        selectedTitle:"",
    }

    componentDidMount(){
        window.location.hash="scoresheet";
        window.addEventListener("hashchange", this.onHashChange);
        let url_arr = window.location.href.split("/");
        let test_id = this.props.id//url_arr[4];
        let title = this.props.title//localStorage.getItem("scores_sheet_title");
        this.get_scoreSheet(test_id, title);
    }

    componentWillUnmount(){
        window.removeEventListener("hashchange", this.onHashChange);
    }

    onHashChange = ()=>{
        if(window.location.hash == "#mytests"){
            this.onBack();
        }
    }

    get_scoreSheet = (test_id, title)=>{

        let json = {token: getCookie("_ca"), test_id}

        Server.post_request(Server.urls.GET_SCORE_SHEET, json, (res)=>{
            this.state.loading = false;
            if(res.result_code == Server.ResultCode.SUCCESS){
                console.log(res);
                this.setScores(res.data, title);

            }else{
                console.log(res);
                this.setState(this.state)
            }
                
        });

        let temp = {
            "result_code": 1000,
            "data": {
                "total": {
                    "questions_count": 10,
                    "correct_count": 1,
                    "wrong_count": 7,
                    "empty_count": 2
                },
                "ریاضی": {
                    "questions_count": 4,
                    "correct_count": 0,
                    "wrong_count": 3,
                    "empty_count": 1,
                    "percent": -25,
                    "max_percent": 0,
                    "average_percent": -6.25,
                    "rank": 4,
                    "level": 3268
                },
                "علوم": {
                    "questions_count": 3,
                    "correct_count": 1,
                    "wrong_count": 2,
                    "empty_count": 0,
                    "percent": 11.11,
                    "max_percent": 11.11,
                    "average_percent": 2.77,
                    "rank": 1,
                    "level": 6732
                },
                "دینی": {
                    "questions_count": 3,
                    "correct_count": 0,
                    "wrong_count": 2,
                    "empty_count": 1,
                    "percent": -22.23,
                    "max_percent": 0,
                    "average_percent": -5.56,
                    "rank": 4,
                    "level": 3268
                }
            }
        }

        
    }

    setScores = (data, test_title)=>{

        let keys = Object.keys(data);

        this.state.test_title = test_title;
        if(keys.length == 1){

            this.setState({
                mode:"single",
                data,
                selectedSocre:data.total,
                selectedTitle:"total"
            })

        }else if(keys.length > 1){

            this.setState({
                mode:"multi",
                data,
                selectedSocre:data.total,
                selectedTitle:"total"
            })
        }
    }

    onBack = ()=>{
        Controller.setPage(<MyTests/>);
    }

    onCourseSelect = (title)=>{
        this.setState({selectedSocre:this.state.data[title], selectedTitle:title});
    }

    render() {
        if(this.state.loading){
            return(<div className="scoreSheet"><Spiner/></div>);
        }
        return (
            <div className="scoreSheet">

                <Header/>

                <div className="ssheet_title">{"کارنامه "+ this.state.test_title}</div>

                <div style={{display:'flex', color:"#0091EA", alignItems:'center', marginLeft:"4rem", 
                borderBottom:"solid 0.1rem #0091EA", cursor:'pointer'}} onClick={this.onBack}>
                    <img style={{height:"1.6rem", margin:"0.6rem"}} src={Server.img_png("slider_prev")}/>
                    {"بازگشت"}
                </div>

                <div className="ssheet_wrapper">

                    <div className="ssheet_selection_con">

                        {
                            Object.keys(this.state.data).map((v,i)=>(
                                <CourseSelection onSelect={this.onCourseSelect} title={v} key={`${i}`} selectedTitle={this.state.selectedTitle}/>
                            ))
                        }

                    </div>
                    {
                        this.state.mode=="multi"&&this.state.selectedTitle=="total"?
                        <BriefScoreCard scoreData={this.state.selectedSocre}/>:
                        <ScoresCard scoreData={this.state.selectedSocre}/>
                    }

                </div>

                
                
            </div>
        )
    }
}

function CourseSelection(props){
    if(props.selectedTitle == props.title){
        return(
            <div className="ssheet_cselect_btn" style={{backgroundColor:"#0091EA", color:"white"}} onClick={()=>{props.onSelect(props.title)}}>
                {props.title=="total"?"اطلاعات کلی":props.title}
            </div>
        )
    }else{
        return(
            <div className="ssheet_cselect_btn" onClick={()=>{props.onSelect(props.title)}}>
                {props.title=="total"?"اطلاعات کلی":props.title}
            </div>
        )
    }
}

class ScoresCard extends Component{
    render(){
        return(
            <div className="ssheet_card">
                <div className="sscroe_row">
                    <div className="sscore_row_info" style={{borderTopLeftRadius:"1rem"
                    ,borderTop:"0.1rem solid #0091EA", color:"white", backgroundColor:"#0091EA"}}>{this.props.scoreData.rank}</div>
                    <div className="sscore_row_title" style={{borderTopRightRadius:"1rem"
                    ,borderTop:"0.1rem solid #0091EA", color:"white", backgroundColor:"#0091EA",
                    borderLeftColor:'white'}}>{"رتبه"}</div>
                </div>
                <ScoreCardRow title={"تعداد سوال"} info={this.props.scoreData.questions_count}/>
                <ScoreCardRow title={"تعداد صحیح"} info={this.props.scoreData.correct_count}/>
                <ScoreCardRow title={"تعداد غلط"} info={this.props.scoreData.wrong_count}/>
                <ScoreCardRow title={"تعداد نزده"} info={this.props.scoreData.empty_count}/>
                <div className="sscroe_row">
                    <div className="sscore_row_info" style={{color:"white", backgroundColor:"#0091EA"}}>{this.props.scoreData.percent}</div>
                    <div className="sscore_row_title" style={{color:"white", backgroundColor:"#0091EA",
                    borderLeftColor:'white'}}>{"درصد"}</div>
                </div>
                <ScoreCardRow title={"تراز"} info={this.props.scoreData.level}/>
                <ScoreCardRow title={"میانگین درصد"} info={this.props.scoreData.average_percent}/>
                <div className="sscroe_row" style={{borderBottom:"none"}}>
                    <div className="sscore_row_info" style={{borderBottomLeftRadius:"1rem"
                    ,borderBottom:"0.1rem solid #0091EA"}}>{this.props.scoreData.max_percent}</div>
                    <div className="sscore_row_title" style={{borderBottomRightRadius:"1rem"
                    ,borderBottom:"0.1rem solid #0091EA"}}>{"بالاترین درصد"}</div>
                </div>

            </div>
        )
    }
}

function ScoreCardRow(props){
    return(
        <div className="sscroe_row">
            <div className="sscore_row_info">{props.info}</div>
            <div className="sscore_row_title">{props.title}</div>
        </div>
    )
}


class BriefScoreCard extends Component{
    render(){
        return(
            <div className="ssheet_card">
                <div className="sscroe_row">
                    <div className="sscore_row_info" style={{borderTopLeftRadius:"1rem"
                    ,borderTop:"0.1rem solid #0091EA",}}>{this.props.scoreData.questions_count}</div>
                    <div className="sscore_row_title" style={{borderTopRightRadius:"1rem"
                    ,borderTop:"0.1rem solid #0091EA"}}>{"تعداد سوال"}</div>
                </div>
                <ScoreCardRow title={"تعداد صحیح"} info={this.props.scoreData.correct_count}/>
                <ScoreCardRow title={"تعداد غلط"} info={this.props.scoreData.wrong_count}/>
                <div className="sscroe_row" style={{borderBottom:"none"}}>
                    <div className="sscore_row_info" style={{borderBottomLeftRadius:"1rem"
                    ,borderBottom:"0.1rem solid #0091EA"}}>{this.props.scoreData.empty_count}</div>
                    <div className="sscore_row_title" style={{borderBottomRightRadius:"1rem"
                    ,borderBottom:"0.1rem solid #0091EA"}}>{"تعداد نزده"}</div>
                </div>

            </div>
        )
    }
}