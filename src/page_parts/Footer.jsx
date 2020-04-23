import React, { Component } from 'react';
import './footer.css';
import Server from '../Server';

export default class Footer extends Component {

    state = {tel1:"", tel2:"", instagram:"", telegram:"", email:""}

    componentDidMount(){

        Server.get_request(Server.urls.LINKS, (res)=>{

            let data = res.data;

            let {tel1, tel2, instagram, telegram, email} = data;

            tel2 = "\n"+tel2;

            this.setState({tel1, tel2, instagram, telegram, email});
        });
    }

    goLink = (where)=>{

        let link = this.state[where].toString();;

        if(link.startsWith("https")){
            window.open(link);
        }else{
            window.open("https://"+link);
        }
    }

    render() {
        return (
            <div id="footer">

                <div id="footer_con">

                    <div id="footer_email">{"ایمیل"+"\n"+this.state.email}</div>

                    <div id="footer_logo">

                        <div id="footer_logo_title">{"Mahta"}</div>
                        <div id="footer_logo_right">{"تمامی حقوق متعلق به دبیرستان مهتا می باشد"}</div>

                        <div id="footer_link_con">
                            
                            {this.state.telegram && <img onClick={()=>this.goLink("telegram")} className="footer_links" src={Server.urls.FILE+"telegram.png"}/>}
                            
                            {this.state.instagram && <img onClick={()=>this.goLink("instagram")} className="footer_links" src={Server.urls.FILE+"instagram.png"}/>}

                        </div>

                    </div>

                    <div id="footer_number">{"تلفن"+"\n"+this.state.tel1+this.state.tel2}</div>

                </div>
                
            </div>
        )
    }
}
