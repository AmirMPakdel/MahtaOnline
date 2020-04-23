import React, { Component } from "react";
import { Spin } from "antd";

export default class Loading extends Component {
  render() {

    let bgColor = "#f1f1f1";
    if(this.props.glass){
      bgColor = "transparent";
    }
    return (
      // <Spin style={{position:"absolute", top:"50vh", right:"50vw", marginRight:"-0.5rem", marginTop:"-1rem"}}/>
      <Spin
        style={{
          position: "fixed",
          height: "100vh",
          width: "100vw",
          display:"flex",
          top:this.props.top||0,
          left:this.props.left||0,
          justifyContent:'center',
          alignItems:'center',
          backgroundColor: bgColor,
          zIndex:50
        }}
      />
    );
  }
}
