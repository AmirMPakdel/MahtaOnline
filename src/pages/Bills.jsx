import React, { Component } from 'react'
import './bills.css';
import { Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import InprogressTransaction from '../components/InprogressTransaction';

class Bills extends Component {
    
    state={
        payableList:[{},{},{}],
        transactionList:[]
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
                            !this.state.payableList.length?
                            
                            <div className="bills_card_nobill">{"شما هیچ سفارش پرداخت نشده‌ای ندارید"}</div>:

                            <React.Fragment>
                                <div style={{height:"2rem"}}/>
                                {
                                    this.state.payableList.map((v,i)=>{
                                        return(
                                            <InprogressTransaction/>
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
                            false?
                            <div className="bills_card_nobill">{"شما تا کنون پرداختی در سامانه نداشته اید"}</div>:
                            <div className="transaction_list_con">
                                {
                                    [{},{},{},{},{}].map((v,i)=>{

                                        
                                        return(
                                            <Transactions key={`${i}`} index={i}/>
                                        )
                                    })
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

    return(
        <div className="transaction_con" style={s}>
            <div className="transaction_title">{"طرح تیک آف هواپیمای مسافربری بویینگ شانزده"}</div>
            
            <div className="transaction_row">
                <div>{"مبلغ پرداختی"}</div>
                <div>{"315,000 تومان"}</div>
            </div>

            <div className="transaction_row">
                <div>{"قیمت کل پروژه"}</div>
                <div>{""}</div>
            </div>

            <div className="transaction_row">
                <div>{"شماره پیگیری"}</div>
                <div>{""}</div>
            </div>

            <div className="transaction_row">
                <div>{"نوع پرداخت"}</div>
                <div>{""}</div>
            </div>

            <div className="transaction_row">
                <div>{"شماره سفارش"}</div>
                <div>{""}</div>
            </div>

            <div className="transaction_row">
                <div>{"تاریخ پرداخت"}</div>
                <div>{""}</div>
            </div>

            <div className="transaction_row">
                <div>{"وضعیت پرداخت"}</div>
                <div>{""}</div>
            </div>

        </div>
    )
}