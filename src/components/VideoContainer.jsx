import React, { Component } from 'react';
import './videoContainer.css';
import Server from '../Server';
import { getCookie } from '../scripts/cookie';

export default class VideoContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            video_player:null
        }
    }

    openVideoTab = ()=>{
        if(this.state.video_player){
            window.open(this.state.video_player)
        }
    }

    componentDidMount(){

        let json = {}
        json.token = getCookie("_ca");
        json.plan_id = this.props.plan_id;
        json.session_id = this.props.session_id;

        Server.post_request(Server.urls.GET_VIDEO_LINK, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                let link = res.data;
                // let jsx = <iframe src={link} 
                // frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                // allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">
                // </iframe>
                this.setState({video_player:link});
            }
        });
    }

    render() {
        return (
            <React.Fragment>
            <div className="video_con_con">
                <div class="r1_iframe_embed"> 
                {/* {this.state.video_player} */}
                {/* <iframe src={this.state.video_player} 
                frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">
                </iframe> */}
                <object data={this.state.video_player} width="100%" height="100%" type="text/html">

                </object>
                </div>
            </div>
            <div className="session_modal_open_tabvideo"
            onClick={this.openVideoTab}>{"نمایش ویدیو در صفحه مجزا"}</div>
            </React.Fragment>
        )
    }
}
