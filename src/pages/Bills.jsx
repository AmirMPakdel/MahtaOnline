import React, { Component } from 'react'
import './bills.css';
import { Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import InprogressTransaction from '../components/InprogressTransaction';
import Server from '../Server';
import {getCookie} from '../scripts/cookie';
import { priceNum } from '../scripts/persianNum';

class Bills extends Component {
    
    state={
        instalmentList:[],
        transactionList:[]
    }

    componentDidMount(){

        this.getTransactionRecords((data)=>{

            console.log(data);
            this.state.transactionList = data.transactions;
            this.state.instalmentList = data.installments;
            this.setState(this.state);
        });
    }

    getTransactionRecords = (cb)=>{

        let json = {token:getCookie("_ca")}
        Server.post_request(Server.urls.TRANSACTION_RECORDS, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){
                cb(res.data);
            }else{
                // TODO: handle errors
            }
        })
    }

    render() {
        return (
            <div id="bills">
                <div id="bills_title">{"پرونده مالی"}</div>

                <div className="Breadcrumb_con">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                        <Breadcrumb.Item>{"پرونده مالی"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div id="bills_holder">

                    <div className="bills_card">
                        <div className="bills_card_title">{"اقساط پرداخت نشده"}</div>
                        <div className="bills_card_line"/>
                        {
                            !Object.keys(this.state.instalmentList).length?
                            
                            <div className="bills_card_nobill">{"شما هیچ سفارش پرداخت نشده‌ای ندارید"}</div>:

                            <React.Fragment>
                                <div style={{height:"2rem"}}/>
                                {
                                    Object.keys(this.state.instalmentList).map((v,i)=>{
                                        return(
                                            <InprogressTransaction key={`${i}`} title={v} list={this.state.instalmentList[v]}/>
                                        )
                                    })
                                }
                            </React.Fragment>
                            
                        }
                        
                    </div>

                    <div className="bills_card">
                        <div className="bills_card_title">{"سوابق مالی شما"}</div>
                        <div className="bills_card_line"/>

                        {
                            !this.state.transactionList.length?
                            <div className="bills_card_nobill">{"شما تا کنون پرداختی در سامانه نداشته اید"}</div>:
                            <div className="transaction_list_con">
                                {
                                    !this.state.transactionList.length?
                                    <div className="bills_card_nobill" style={{margin:"auto"}}>{"هیچ فاکتور پرداختی ندارید"}</div>:
                                    this.state.transactionList.map((v,i)=>
                                        (<Transactions key={`${i}`} data={v} index={i}/>)
                                    )
                                }
                            </div>
                        }
                        
                    </div>
                    
                </div>
                
            </div>
        )
    }
}

export default Bills


function Transactions(props){

    let s = {borderRadius:"1rem 0 0 1rem"};
    if(props.index%2){
        s = {borderRadius:"0 1rem 1rem 0"};
    }

    let {title, paid_amount, order_no, issue_tracking_no, success,
        transaction_payment_type, date_day, date_month, date_year} = props.data;
    
    let total_price;
    let transaction_payment_type_fa;

    if(transaction_payment_type == 1){
        transaction_payment_type_fa = "کامل";
        total_price = paid_amount;
    }else if(transaction_payment_type == 0){
        transaction_payment_type_fa = "قسطی";
        total_price = "...";// TODO: rastin
    }

    let success_fa = 'ناموفق';
    if(success){
        success_fa = "موفق"
    }

    return(
        <div className="transaction_con" style={s}>
            <div className="transaction_title">{title}</div>
            
            <div className="transaction_row">
                <div>{"مبلغ پرداختی"}</div>
                <div>{priceNum(paid_amount)+"تومان"}</div>
            </div>

            {/* <div className="transaction_row">
                <div>{"قیمت کل پروژه"}</div>
                <div>{total_price+"تومان"}</div>
            </div> */}

            <div className="transaction_row">
                <div>{"شماره پیگیری"}</div>
                <div>{issue_tracking_no}</div>
            </div>

            <div className="transaction_row">
                <div>{"نوع پرداخت"}</div>
                <div>{transaction_payment_type_fa}</div>
            </div>

            <div className="transaction_row">
                <div>{"شماره سفارش"}</div>
                <div>{order_no}</div>
            </div>

            <div className="transaction_row">
                <div>{"تاریخ پرداخت"}</div>
                <div>{date_year+"/"+date_month+"/"+date_day}</div>
            </div>

            <div className="transaction_row">
                <div>{"وضعیت پرداخت"}</div>
                <div>{success_fa}</div>
            </div>

        </div>
    )
}