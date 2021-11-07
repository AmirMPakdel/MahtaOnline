import React, { Component } from 'react';
import './inprogressTransaction.css';
import {Dropdown, Button} from 'antd';
import {number2Fa, priceNum} from '../scripts/persianNum';
import Server from '../Server';
import { getCookie } from '../scripts/cookie';

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

    onPayInstalment = (installment_id)=>{
        
        let token = getCookie("_ca");
        window.location.href = `/api/installment/pay/${token}/${installment_id}`;
    }

    render() {
        return (
            <div className="in_transaction_con">
                
                <div className="in_transaction_title_button" onClick={this.onSelect}>{this.props.title}</div>

                
                <div className="in_transaction_subtrans_con" ref={r=>this.trans_con=r}>
                <div ref={r=>this.wrapper=r}>
                    {
                        this.props.list.reverse().map((v,i)=>{

                            let s={borderColor:"gold"};
                            let payed = false;
                            if(!v.transaction_id){
                                payed = true;
                                s={borderColor:"#0091EA"};
                            }

                            return(
                            <Dropdown key={`tic${i}`} overlay={<TransactionInfoCard data={v} onPayInstalment={this.onPayInstalment}/>} placement="bottomCenter">
                                <Button className="trans_installment_title" style={s}>
                                    {v.number != 1?"قسط "+number2Fa(v.number):"پیش پرداخت"}
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

    if(!props.data.transaction_id){
        return(
            <div className="trans_info_card_con">

                <div className='trans_info_card_row'>
                    <div>{priceNum(props.data.amount)+" تومان "}</div>
                    <div>{"مبلغ قسط"}</div>
                </div>

                <div className='trans_info_card_row'>
                    <div>{props.data.year+"/"+props.data.month+"/"+props.data.day}</div>
                    <div>{"موعد پرداخت"}</div>
                </div>

                <div className="trans_info_card_btn" onClick={()=>this.onPayInstalment(props.data.id)}>{"پرداخت اینترنتی"}</div>
    
            </div>
        )
    }else{
        return(
            <div className="trans_info_card_con">

                <div className='trans_info_card_row'>
                    <div>{priceNum(props.data.amount)+" تومان "}</div>
                    <div>{"میلغ قسط"}</div>
                </div>

                <div className='trans_info_card_row'>
                    <div>{props.data.year+"/"+props.data.month+"/"+props.data.day}</div>
                    <div>{"تاریخ پرداخت"}</div>
                </div>

                <div className="trans_info_card_done">{"پرداخت شده"}</div>
    
            </div>
        )
    }   
}

