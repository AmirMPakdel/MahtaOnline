import React, { Component } from 'react'
import './classInfo_sessions.css';
import Server from '../Server';

class ClassInfo_tests extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
        }
    }

    render() {
        let p = [{},{},{},{}]

        return (
            <div className="classinfo_session_con">

                <div className="classinfo_session_title">{"آزمون های دوره"}
                    <div className="classinfo_session_title_line"/>
                </div>

                {
                    p.map((v,i)=>{

                        let LineS = {};
                        if(i == 0){
                            LineS = {top:"1.5rem"}
                        }
                        if(i == p.length-1){
                            LineS = {bottom:"1.5rem"}
                        }

                        return(
                        <div className="classinfo_session_row_con">

                            <div className="classinfo_session_row_label">
                                <div className="classinfo_session_row_label_line" style={LineS}/>
                                <div className="classinfo_session_row_label_fill"/>
                            </div>

                            <div className="classinfo_session_row_holder">

                                <div className="classinfo_session_row_number">{"آزمون سی و سوم"}</div>

                                <div className="classinfo_session_row_date">
                                    {"1399/4/6"}
                                    <img className="classinfo_session_row_dateimg" src={Server.img_png("class_info_date")}/>
                                </div>

                            </div>
                            
                        </div>)
                    })
                }
                
            </div>
        )
    }
}

export default ClassInfo_tests
