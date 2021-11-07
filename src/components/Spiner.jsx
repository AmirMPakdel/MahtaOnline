import React, { Component } from "react";
import './spiner.css';

function Spiner(props){

    return(
        <div id="course_list">
            <div style={{height:"95vh",display:'flex', width:"80%", justifyContent:'center', alignItems:'center'}}>
                
                <div className="loader"/>
                
            </div>
        </div>
    );
}

export default Spiner;