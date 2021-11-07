import React, { Component } from 'react';
import './purchase.css';
import InfoCard from '../components/InfoCard';
import Server from '../Server';
import { getCookie } from '../scripts/cookie';
import Controller from '../Controller';
import TransactionResult from './TransactionResult';
import {Input} from 'antd';
import Axios from 'axios';
import ViewPlan from './ViewPlan';
import { priceNum } from '../scripts/persianNum';

class Purchase extends Component {
    
    state = {
        completePayCard:true,
        instalmentPayCard:false,
        instalment_types:this.props.plan.installment_types, //TODO: rastin fuckedup instalment spelling
        selected_instalment_type_id:null,
    }

    componentDidMount(){
        
        window.location.hash="purchase";
        window.addEventListener("hashchange", this.onHashChange);
        this.makeResponsive();
        window.addEventListener("resize",this.makeResponsive);
        this.hideCompletePay();
    }

    componentWillUnmount(){
        window.removeEventListener("resize",this.makeResponsive);
        window.removeEventListener("hashchange", this.onHashChange);
    }

    onHashChange = ()=>{
        if(window.location.hash == "#viewplan"){
            this.BackToViewPlan();
        }
    }

    makeResponsive =()=>{
        if(window.innerWidth <= 1199){

            if(this.state.completePayCard){
                if(this.btn2)this.btn2.style.transform='translateY(24rem)';
            }
            this.btn1.style.width = "20rem";
            this.pcard.style.top = "4rem";
            this.pcard.style.left = "0rem";
            if(this.psec)this.psec.style.top="4rem";
            if(this.psec)this.psec.style.left="-1rem";

        }else{
            if(this.btn2)this.btn2.style.transform='translateY(0rem)';
            this.pcard.style.top = "-0.1rem";
            this.pcard.style.left = "-18rem";
            this.btn1.style.width = "25rem";
            if(this.psec)this.psec.style.top="1rem";
            if(this.psec)this.psec.style.left="-18rem";
            if(!this.state.completePayCard){
                this.btn1.style.width = "20rem";
            }
        }
    }

    BackToViewPlan = ()=>{
        if(!this.props.category){
            window.location.href="/dashboard";
        }else{
            Controller.setPage(
                <ViewPlan plan={this.props.plan} category={this.props.category}/>,1);
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
                //this.hideCompletePay();
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
                //this.hideInsalmentPay();
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
            if(this.btn2)this.btn2.style.transform='translateY(24rem)';

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
            if(this.btn2)this.btn2.style.transform='translateY(0)';
            
        }else{
            this.btn1.style.width = "20rem";
            this.pcard.style.transform="scale(0)";
        }

        this.state.completePayCard = false;
    }

    showInstalmentPay = ()=>{
        if(window.innerWidth <= 1199){
            if(this.psec)this.psec.style.transformOrigin="top";
            if(this.psec)this.psec.style.top="4rem";
            if(this.psec)this.psec.style.left="-1rem";
            if(this.psec)this.psec.style.transform="scale(1)";
        }else{
            if(this.psec)this.psec.style.transformOrigin="top right";
            if(this.psec)this.psec.style.top="1rem";
            if(this.psec)this.psec.style.left="-18rem";
            if(this.psec)this.psec.style.transform="scale(1)";
        }
        this.state.instalmentPayCard = true;

        setTimeout(()=>{
            if(this.payBtnRef)this.payBtnRef.scrollIntoView({ behavior: "smooth" })
        }, 250)
        
    }

    hideInsalmentPay = ()=>{
        if(window.innerWidth <= 1199){
            if(this.psec)this.psec.style.transformOrigin="top";
            if(this.psec)this.psec.style.transform="scale(0)";
        }else{
            if(this.psec)this.psec.style.transformOrigin="top right";
            if(this.psec)this.psec.style.transform="scale(0)";
        }
        this.state.instalmentPayCard = false;
    }

    onCompleteOffCode = (e)=>{
        this.completeOffCode = e.target.value;
    }

    onCompleteBuy = ()=>{
        
        let token = getCookie("_ca");
        let plan_id = this.props.plan.id;
        let payment_type = 1;// 1 is for complete payment
        let installment_type_id = null;
        let discount_code = null;
        if(this.completeOffCode){
            discount_code = this.completeOffCode;
        }
        
        window.location.href=Server.domain+`/api/plan/pay/${token}/${plan_id}/${payment_type}/${installment_type_id}/${discount_code}`;
    }

    onInstalmentOffCode = (e)=>{
        this.instalmentOffCode = e.target.value;
    }

    onInstalmentTypeSelect = (index)=>{
        this.state.selected_instalment_type_id = this.state.instalment_types[index].id;
    }

    onInstalmentBuy = ()=>{

        let token = getCookie("_ca");
        let plan_id = this.props.plan.id;
        let payment_type = 0;// 0 is for instalment payment
        let discount_code = null;
        if(this.instalmentOffCode){
            discount_code = this.instalmentOffCode;
        }

        if(this.state.selected_instalment_type_id === null){
            let len = this.state.instalment_types.length;
            this.state.selected_instalment_type_id = this.state.instalment_types[len-1].id;
        }
        let installment_type_id = this.state.selected_instalment_type_id;

        window.location.href = `/api/plan/pay/${token}/${plan_id}/${payment_type}/${installment_type_id}/${discount_code}`;
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
                    <PurchaseInfoCard ref2={r=>this.pcard=r} onCompleteBuy={this.onCompleteBuy}
                    plan={this.props.plan} style={{left:"-18rem", top:"-0.1rem"}} onCompleteOffCode={this.onCompleteOffCode}/>
                </div>

                {
                    this.state.instalment_types.length?
                    <div className="purchase_pay_btn" onClick={this.onInstalmentPay} style={{marginBottom:"2rem"}}
                    ref={r=>this.btn2=r}>{"پرداخت قسطی"}
                    <PaymentSec ref2={r=>this.psec=r} onInstalmentBuy={this.onInstalmentBuy}
                    style={{left:"-18rem", top:"1rem", transform:"scale(0)"}} 
                    instalment_types={this.state.instalment_types}
                    plan={this.props.plan} onInstalmentOffCode={this.onInstalmentOffCode}
                    payBtnRef={r=>this.payBtnRef=r} onInstalmentTypeSelect={this.onInstalmentTypeSelect}/>
                    </div>:null
                }
            </div>
        </div>
        )
    }
}

export default Purchase;

class PurchaseInfoCard extends Component{
    render(){
        let {title, region_one_price, region_two_price, region_three_price, discount} = this.props.plan;
        let price = region_one_price;
        if(Controller.region == 2){price = region_two_price}
        else if(Controller.region == 3){price = region_three_price}
        let real_price = price;
        //TODO: rastin discount- other discounts?
        let other_discounts = 0;
        if(discount !== 0){ price -= ((price*discount)/100)}
    return(
        <div className="purchase_info_card_con" style={this.props.style} ref={this.props.ref2}>

            <div className="purchase_info_card_title">{title}</div>

            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"قیمت اصلی دوره"}</div>
                <div>{priceNum(real_price)+" تومان "}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"تخفیف خرید بسته ای"}</div>
                <div>{discount+"%"}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"سایر تخفیفات"}</div>
                <div>{other_discounts+"%"}</div>
            </div>
            <div className="purchase_info_card_sec1" style={{backgroundColor:"#ccc"}}>
                <div style={{fontWeight:700}}>{"مبلغ نهایی"}</div>
                <div>{priceNum(price)+" تومان "}</div>
            </div>
            
            <div className="purchase_info_card_btn" onClick={this.props.onCompleteBuy}>
                {"پرداخت اینترنتی"}
            </div>

            <Input style={{height:"3rem", fontSize:"1.2rem"}} onChange={this.props.onCompleteOffCode} placeholder="کد تخفیف"/>

        </div>
    )}
}

class InstalmentInfoCard extends Component{

    render(){

        let {title, price, percentage_of_price_increase, discount_disable, director, discount} = this.props.data;

        if(!percentage_of_price_increase){percentage_of_price_increase=0}
        if(!price){price=0}
        if(!director){director=0}
        if(discount_disable){discount = 0}

        price = parseInt(price);
        let plan_complete_price = price - (price * discount /100);
        plan_complete_price = plan_complete_price + (plan_complete_price * percentage_of_price_increase /100);
        let final_price = Math.floor(plan_complete_price/director);
        
        if(discount_disable){discount="لحاظ نشده"}

        return(
        <div className="purchase_info_card_con" style={this.props.style} ref={this.props.ref2}>

            <div className="purchase_info_card_title">{title}</div>

            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"قیمت اصلی دوره"}</div>
                <div>{priceNum(price)+" تومان "}</div>
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"تخفیف خرید بسته ای"}</div>
                {
                    discount_disable?
                    <div>{"لحاظ نشده"}</div>:<div>{discount+"%"}</div>
                }
                
            </div>
            <div className="purchase_info_card_sec1">
                <div style={{fontWeight:700}}>{"مبلغ نهایی"}</div>
                <div>{priceNum(plan_complete_price)+" تومان "}</div>
            </div>
            <div className="purchase_info_card_sec1" style={{backgroundColor:"#ccc"}}>
                <div style={{fontWeight:700}}>{"مبلغ پیش پرداخت"}</div>
                <div>{priceNum(final_price)+" تومان "}</div>
            </div>
            
            <div className="purchase_info_card_btn" ref={this.props.payBtnRef}
            onClick={this.props.onInstalmentBuy}>
                {"پرداخت اینترنتی"}
            </div>

            <Input style={{height:"3rem", fontSize:"1.2rem"}} onChange={this.props.onInstalmentOffCode} placeholder="کد تخفیف"/>

        </div>
        )
    }
}

class PaymentSec extends Component{

    state={
        current_model:{}
    }

    stopPropagation = (e)=>{
        e.stopPropagation();
    }

    componentDidMount(){
        let l = this.props.instalment_types.length;
        if(l){
            this["pipe"+l].style.bottom = "-2rem";
        }

        this.state.current_model = Object.assign({}, this.props.instalment_types[l-1]);
        this.state.current_model.title = this.props.plan.title;
        this.state.current_model.discount = this.props.plan.discount;
        this.state.current_model.price = this.props.plan.region_one_price;
        if(Controller.region == 2){this.state.current_model.price = this.props.plan.region_two_price;}
        else if(Controller.region == 3){this.state.current_model.price = this.props.plan.region_three_price;}
        this.setState(this.state);
    }

    onType = (indx)=>{

        this.props.onInstalmentTypeSelect(indx);

        this.props.instalment_types.forEach((v,i)=>{
            this["pipe"+(i+1)].style.bottom = "1rem";
        });
        this["pipe"+(indx+1)].style.bottom = "-2rem";

        this.state.current_model = Object.assign({}, this.props.instalment_types[indx]);
        this.state.current_model.title = this.props.plan.title;
        this.state.current_model.discount = this.props.plan.discount;
        this.state.current_model.price = this.props.plan.region_one_price;
        if(Controller.region == 2){this.state.current_model.price = this.props.plan.region_two_price;}
        else if(Controller.region == 3){this.state.current_model.price = this.props.plan.region_three_price;}
        this.setState(this.state);
    }

    render(){
        
    return(
        <div className={"payment_type_sec"} ref={this.props.ref2} onClick={this.stopPropagation} style={this.props.style}>
            
            <div className="payment_type_sec_col" style={{cursor:"default", marginRight:0}}>
                
                <div className="payment_type_row">{"افزایش مبلغ"}</div>
                <div className="payment_type_row">{"تعداد اقساط"}</div>
            </div>

            {
                this.props.instalment_types.map((v,i)=>{
                    return(
                        <div className="payment_type_sec_col" onClick={()=>this.onType(i)}>
                            <div className="payment_type_info_sec">
                                <div className="payment_type_info_sub">{v.director}</div>
                                <div className="payment_type_info_sub">{v.percentage_of_price_increase+"%"}</div>
                            </div>
                            <div className="payment_type_pipe1"/>
                            <div className="payment_type_pipe2" ref={r=>this["pipe"+(i+1)]=r}/>
                            <div className="payment_type_info_title">{v.title}</div>
                        </div>
                    )
                })
            }

            <InstalmentInfoCard ref2={r=>this.pcard=r} payBtnRef={this.props.payBtnRef} data={this.state.current_model}
            style={{left:"0", top:"11rem", marginBottom:"2rem"}} onInstalmentBuy={this.props.onInstalmentBuy} 
            onInstalmentOffCode={this.props.onInstalmentOffCode} discount={this.props.plan.discount}/>

        </div>
    )}
}