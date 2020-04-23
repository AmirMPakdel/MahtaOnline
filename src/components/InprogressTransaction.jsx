import React, { Component } from 'react';
import './inprogressTransaction.css';
import {Dropdown, Button} from 'antd'

export default class InprogressTransaction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            opened:false         
        }
    }

    ResizeListener = ()=>{
        if(this.state.opened){
            this.trans_con.style.transition = "0ms linear";
            this.trans_con.style.height=this.wrapper.clientHeight+20+"px";
        }
    }

    onSelect = ()=>{
        
        if(this.state.opened){

            this.state.opened = false
            this.trans_con.style.transition = "400ms ease";
            this.trans_con.style.height="0rem";
            window.removeEventListener("resize", this.ResizeListener)
            
        }else{

            this.state.opened = true;
            this.trans_con.style.transition = "400ms ease";
            this.trans_con.style.height=this.wrapper.clientHeight+20+"px";
            window.addEventListener("resize", this.ResizeListener)
        }
        
    }

    render() {
        return (
            <div className="in_transaction_con">
                
                <div className="in_transaction_title_button" onClick={this.onSelect}>{"درس شیمی"}</div>

                
                <div className="in_transaction_subtrans_con" ref={r=>this.trans_con=r}>
                <div ref={r=>this.wrapper=r}>
                    {
                        [{},{},{},{},{},{},{}].map((v,i)=>{

                            let s={borderColor:"gold"};
                            let payed = false;
                            if(i%2){
                                payed = true;
                                s={borderColor:"#0091EA"};
                            }

                            return(
                            <Dropdown overlay={<TransactionInfoCard payed={payed}/>} placement="bottomCenter">
                                <Button className="trans_installment_title" style={s}>
                                    {"قسط اول"}
                                </Button>
                            </Dropdown>
                            )
                        })
                    }

                </div>
                </div>
            </div>
        )
    }
}


function TransactionInfoCard(props){

    if(!props.payed){
        return(
            <div className="trans_info_card_con">

                <div className='trans_info_card_row'>
                    <div>{"350000 تومان"}</div>
                    <div>{"میلغ قسط"}</div>
                </div>

                <div className='trans_info_card_row'>
                    <div>{"350000 تومان"}</div>
                    <div>{"موعد پرداخت"}</div>
                </div>

                <div className="trans_info_card_btn">{"پرداخت اینترنتی"}</div>
    
            </div>
        )
    }else{
        return(
            <div className="trans_info_card_con">

                <div className='trans_info_card_row'>
                    <div>{"350000 تومان"}</div>
                    <div>{"میلغ قسط"}</div>
                </div>

                <div className='trans_info_card_row'>
                    <div>{"350000 تومان"}</div>
                    <div>{"تاریخ پرداخت"}</div>
                </div>

                <div className="trans_info_card_done">{"پرداخت شده"}</div>
    
            </div>
        )
    }
    
}