import React, { Component } from 'react';
import './transactionResult.css';
import Server from '../Server';
import {useParams} from 'react-router-dom';
import {priceNum} from '../scripts/persianNum';

export default class TransactionResult extends Component {

    state={
        loading:true,
        success:true,
        result_title:"",
        title:"",
        result_img:"",
        date:"",
        order_number:"",
        payment_type:"",
        amount:"",
        issue_tracking_no:"",
    }

    componentDidMount(){
        let url_arr = window.location.href.split("/");
        let transaction_id = url_arr[4];
        Server.get_request(`/api/${transaction_id}/transaction`, (res)=>{
            if(res.result_code == Server.ResultCode.SUCCESS){

                let d = res.data;
                if(d.success){
                    this.state.result_title = "پرداخت با موفقیت انجام شد";
                    this.state.result_img = Server.img_png("success_img");
                }else{
                    this.state.result_title = "پرداخت ناموفق";
                    this.state.result_img = Server.img_png("fail_img");
                }
                this.state.title = "پرداخت دوره "+d.title;
                this.state.date = d.date_year+"/"+d.date_month+"/"+d.date_day;
                this.state.order_number = d.order_no;
                if(d.transaction_payment_type === 0){
                    this.state.payment_type = "قسطی";
                }else if(d.transaction_payment_type === 1){
                    this.state.payment_type = "کامل";
                }
                this.state.amount = "----";
                if(d.paid_amount != null){this.state.amount = d.paid_amount}
                this.state.issue_tracking_no = "----";
                if(d.issue_tracking_no != null){this.state.issue_tracking_no = d.issue_tracking_no}

            }else{

            }

            this.state.loading = false;
            this.setState(this.state);
        });
    }

    onBack = ()=>{
        window.location.href = "/dashboard";
    }

    render() {

        return (
            <div id="course_list">
                <div className="transult_con">

                    <div className="transult_t1">{this.state.result_title}</div>

                    <img className="transult_img" src={this.state.result_img}/>

                    <div className="transult_card_holder">

                        <div className="transult_card_title">{this.state.title}</div>

                        <Transult_Row title="تاریخ پرداخت" value={this.state.date}/>
                        <Transult_Row title="شماره سفارش" fontFamily="sans-serif" value={this.state.order_number}/>
                        <Transult_Row title="نوع پرداخت" value={this.state.payment_type}/>
                        <Transult_Row title="مبلغ پرداخت" fontFamily="sans-serif" value={priceNum(this.state.amount)}/>
                        <Transult_Row title="شماره پیگیری" fontFamily="sans-serif" value={this.state.issue_tracking_no}/>

                    </div>

                    <div className="transult_back" onClick={this.onBack}>{"بازگشت"}</div>
                    
                </div>
            </div>
        )
    }
}

function Transult_Row(props){
    return(
        <div className="transult_row">
            <div style={{fontFamily:props.fontFamily}}>{props.value}</div>
            <div>{props.title}</div>
        </div>
    )
}
