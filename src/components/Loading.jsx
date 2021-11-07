import React, { Component } from "react";
import './spiner.css';

function Spiner(props){

    return(
        <div style={{...{height:"90vh",display:'flex', width:"80%", justifyContent:'center', alignItems:'center'}, ...props.style}}>
                
            <div className="loader"/>
                
        </div>
    );
}

export default Spiner;