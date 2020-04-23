import React, { Component } from 'react';
import './purchase.css';
import InfoCard from '../components/InfoCard';

class Purchase extends Component {
    constructor(props) {
        super(props)

        this.state = {
            completePayCard:true,
            instalmentPayCard:false
        }
    }

    componentDidMount(){
        this.makeResponsive();
        this.onWindowListener = window.addEventListener("resize", this.makeResponsive)
    }

    componentWillUnmount(){
        window.removeEventListener("resize",this.onWindowListener);
    }

    makeResponsive =()=>{
        if(window.innerWidth <= 1199){

            if(this.state.completePayCard){
                this.btn2.style.transform='translateY(22rem)';
            }
            this.btn1.style.width = "20rem";
            this.pcard.style.top = "4rem";
            this.pcard.style.left = "0rem";
            

            this.psec.style.top="4rem";
            this.psec.style.left="-1rem";

        }else{
            
            this.btn2.style.transform='translateY(0rem)';
            this.pcard.style.top = "-0.1rem";
            this.pcard.style.left = "-18rem";
            this.btn1.style.width = "25rem";
            this.psec.style.top="1rem";
            this.psec.style.left="-18rem";
            if(!this.state.completePayCard){
                this.btn1.style.width = "20rem";
            }
        }
    }

    onCompletePay = ()=>{
        let time = 0;
        if(this.state.instalmentPayCard){
            time = 200;
            this.hideInsalmentPay();
        }
        setTimeout(()=>{
            if(this.state.completePayCard){
                this.hideCompletePay();
            }else{
                this.showCompletePay();
            }
        },time);
    }

    onInstalmentPay = ()=>{
        let time = 0;
        if(this.state.completePayCard){
            time = 200;
            this.hideCompletePay();
        }
        setTimeout(()=>{
            if(this.state.instalmentPayCard){
                this.hideInsalmentPay();
            }else{
                this.showInstalmentPay();
            }
        }, time);
    }

    showCompletePay = ()=>{

        if(window.innerWidth <= 1199){

            this.btn1.style.width = "20rem";
            this.pcard.style.top = "4rem";
            this.pcard.style.left = "0rem";
            this.pcard.style.transformOrigin="top";
            this.pcard.style.transform="scale(1)";
            this.btn2.style.transform='translateY(22rem)';

        }else{
            this.pcard.style.top = "-0.1rem";
            this.pcard.style.left = "-18rem";
            this.pcard.style.transformOrigin="top right";
            this.btn1.style.width = "25rem";
            this.pcard.style.transform="scale(1)";
            
        }
        this.state.completePayCard = true;
    }

    hideCompletePay = ()=>{
        if(window.innerWidth <= 1199){
            this.btn1.style.width = "20rem";
            this.pcard.style.transform="scale(0)";
            this.btn2.style.transform='translateY(0)';
            
        }else{
            this.btn1.style.width = "20rem";
            this.pcard.style.transform="scale(0)";
        }

        this.state.completePayCard = false;
    }

    showInstalmentPay = ()=>{
        if(window.innerWidth <= 1199){
            this.psec.style.transformOrigin="top";
            this.psec.style.top="4rem";
            this.psec.style.left="-1rem";
            this.psec.style.transform="scale(1)";
        }else{
            this.psec.style.transformOrigin="top right";
            this.psec.style.top="1rem";
            this.psec.style.left="-18rem";
            this.psec.style.transform="scale(1)";
        }
        this.state.instalmentPayCard = true;

        setTimeout(()=>{
            this.payBtnRef.scrollIntoView({ behavior: "smooth" })
        }, 250)
        
    }

    hideInsalmentPay = ()=>{
        if(window.innerWidth <= 1199){
            this.psec.style.transformOrigin="top";
            this.psec.style.transform="scale(0)";
        }else{
            this.psec.style.transformOrigin="top right";
            this.psec.style.transform="scale(0)";
        }
        this.state.instalmentPayCard = false;
    }

    render() {
        return (
        <div id="course_list">
            <div className="purchase_con">

                <div className="dashboard_title">{"ثبت نام دوره و پرداخت"}</div>

                <InfoCard className="purchase_infoCard" 
                title="قیمت محاسبه شده برای شما بر اساس منطقه دو است"/>

                <div style={{marginTop:"3rem"}} ref={r=>this.btn1=r} onClick={this.onCompletePay} 
                style={{width:"25rem"}} className="purchase_pay_btn">
                    {"پرداخت کامل"}
                    <PurchaseInfoCard ref2={r=>this.pcard=r} 
                    style={{left:"-18rem", top:"-0.1rem"}}/>
                </div>
                <div className="purchase_pay_btn" onClick={this.onInstalmentPay} style={{marginBottom:"2rem"}}
                ref={r=>this.btn2=r}>{"پرداخت قسطی"}
                    <PaymentSec ref2={r=>this.psec=r} 
                    style={{left:"-18rem", top:"1rem", transform:"scale(0)"}}
                    payBtnRef={r=>this.payBtnRef=r}/>
                </div>
            </div>
        </div>
        )
    }
}

export default Purchase;

class PurchaseInfoCard extends Component{
    render(){
    return(
        <div className="purchase_info_card_con" style={this.props.style} ref={this.props.ref2}>

            <div className="purchase_info_card_title">{"طرح تیک آف مشاوره"}</div>

            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"قیمت اصلی دوره"}</div>
                <div>{"600,000تومان"}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"تخفیف خرید بسته ای"}</div>
                <div>{"15%"}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"سایر تخفیفات"}</div>
                <div>{"0%"}</div>
            </div>
            <div className="purchase_info_card_sec1" style={{backgroundColor:"#ccc"}}>
                <div style={{fontWeight:700}}>{"مبلغ نهایی"}</div>
                <div>{"480,000تومان"}</div>
            </div>
            
            <div className="purchase_info_card_btn">
                {"پرداخت اینترنتی"}
            </div>

        </div>
    )}
}

class InstalmentInfoCard extends Component{
    render(){
    return(
        <div className="purchase_info_card_con" style={this.props.style} ref={this.props.ref2}>

            <div className="purchase_info_card_title">{"طرح تیک آف مشاوره"}</div>

            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"قیمت اصلی دوره"}</div>
                <div>{"600,000تومان"}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"تخفیف خرید بسته ای"}</div>
                <div>{"15%"}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"تاریخ پرداخت قصد اول"}</div>
                <div>{"1399/2/4"}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"تاریخ پرداخت قصد دوم"}</div>
                <div>{"1399/2/4"}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"مبلغ کل دوره"}</div>
                <div>{"480,000تومان"}</div>
            </div>
            <div className="purchase_info_card_sec1" style={{backgroundColor:"#ccc"}}>
                <div style={{fontWeight:700}}>{"مبلغ پیش پرداخت"}</div>
                <div>{"480,000تومان"}</div>
            </div>
            
            <div className="purchase_info_card_btn" ref={this.props.payBtnRef}>
                {"پرداخت اینترنتی"}
            </div>

        </div>
    )}
}

class PaymentSec extends Component{

    stopPropagation = (e)=>{
        e.stopPropagation();
    }

    onType = (indx)=>{

        [{},{},{}].forEach((v,i)=>{
            this["pipe"+(i+1)].style.bottom = "1rem";
        });
        this["pipe"+(indx)].style.bottom = "-2rem";
    }

    render(){
    return(
        <div className={"payment_type_sec"} ref={this.props.ref2} onClick={this.stopPropagation} style={this.props.style}>
            <div className="payment_type_sec_col" onClick={()=>this.onType(3)}>
                <div className="payment_type_info_sec">
                    <div className="payment_type_info_sub">{"7"}</div>
                    <div className="payment_type_info_sub">{"20%"}</div>
                    <div className="payment_type_info_sub" style={{backgroundColor:"#ccc"}}>{"1,000,000"}</div>
                </div>
                <div className="payment_type_pipe1"/>
                <div className="payment_type_pipe2" ref={r=>this["pipe3"]=r}/>
                <div className="payment_type_info_title">{"نوع سه"}</div>
            </div>
            <div className="payment_type_sec_col" onClick={()=>this.onType(2)}>
                <div className="payment_type_info_sec">
                    <div className="payment_type_info_sub">{"5"}</div>
                    <div className="payment_type_info_sub">{"15%"}</div>
                    <div className="payment_type_info_sub" style={{backgroundColor:"#ccc"}}>{"1,000,000"}</div>
                </div>
                <div className="payment_type_pipe1"/>
                <div className="payment_type_pipe2" ref={r=>this["pipe2"]=r}/>
                <div className="payment_type_info_title">{"نوع دو"}</div>
            </div>
            <div className="payment_type_sec_col" onClick={()=>this.onType(1)}>
                <div className="payment_type_info_sec">
                    <div className="payment_type_info_sub">{"3"}</div>
                    <div className="payment_type_info_sub">{"10%"}</div>
                    <div className="payment_type_info_sub" style={{backgroundColor:"#ccc"}}>{"1,000,000"}</div>
                </div>
                <div className="payment_type_pipe1"/>
                <div className="payment_type_pipe2" ref={r=>this["pipe1"]=r}/>
                <div className="payment_type_info_title">{"نوع یک"}</div>
            </div>
            <div className="payment_type_sec_col" style={{cursor:"default", marginRight:0}}>
                <div className="payment_type_row">{"مبلغ نهایی"}</div>
                <div className="payment_type_row">{"افزایش مبلغ"}</div>
                <div className="payment_type_row">{"تعداد اقساط"}</div>
            </div>

            <InstalmentInfoCard ref2={r=>this.pcard=r} payBtnRef={this.props.payBtnRef} 
            style={{left:"0", top:"11rem", marginBottom:"2rem"}}/>
        </div>
    )}
}