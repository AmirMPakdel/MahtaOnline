import React, { Component } from 'react';
import './testView.css';
import Server from '../Server';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Spiner from '../components/Loading';
import { getCookie } from '../scripts/cookie';
import Controller from '../Controller';
import MyTests from './MyTests';
import { Modal, Button } from 'antd';
import Axios from 'axios';
import TestPdfHelp from '../components/TestPdfHelp';

export default class TestView extends Component {

    state = {
        loading:false,
        total_pages:0,
        currentPage:0,
        questions_count:0,
        answer_holder_height:"0rem",
        answers:{},
        pdf_url:"",
        duration:null,
        timer:0,
        pdf_width:0,
        pdf_height:0,

        //new
        pdf_file_id:"",

        endModalVisible:false,
        endModalTitle:"خروج از آزمون",
        pdf_failed:false,
    }

    componentDidMount(){
        
        window.addEventListener("resize",this.onWindowResize);
        this.getTestInfo(()=>{
            this.responsive_answerHolder(()=>{
                
                this.setState({loading:false}, ()=>{

                    //this.setupPdf();

                    this.calcutale_end_time();
                });
            });
        });
    }

    componentWillUnmount(){
        clearTimeout(this.interval);
    }

    getTestInfo=(cb)=>{
        
        let json = {token:getCookie("_ca"), test_id:this.props.test_id};

        Server.post_request(Server.urls.GET_TEST, json, (res)=>{

            if(res.result_code == Server.ResultCode.SUCCESS){

                console.log(res);

                let duration = res.data.duration - 5;

                let answers = res.data.answers;

                let questions_count = res.data.questions_count;

                let pdf_url = Server.urls.DBFILE+res.data.questions;

                let pdf_file_id = getFileFromPath(res.data.questions);

                if(res.data.duration == 0){

                    answers = this.answers_obj_handler(answers, questions_count);
                    this.setState({questions_count, answers, pdf_url, duration, pdf_file_id}, 
                        this.responsive_answerHolder(()=>{
                        this.setState({loading:false}, this.testTimeout);
                    }))

                }else{
                
                    answers = this.answers_obj_handler(answers, questions_count);
                    this.setState({questions_count, answers, pdf_url, duration, pdf_file_id}, cb)
                }

            }else{
                //TODO:
                Controller.openNotification("آزمون مورد نظر یافت نشد");
                Controller.setPage(<MyTests/>, 5);
            }
        });
        
    }

    answers_obj_handler = (answers, count)=>{
        if(answers == null || !Object.keys(answers).length){
            let new_answers = {};
            for(let i=1;i<=count;i++){new_answers[i]="empty"};
            console.log(new_answers);
            return new_answers;
        }else{

            let newAnswers = {};
            
            answers = answers.split("");
            answers.pop();
            answers.shift();
            answers = answers.filter((v,i)=>{if(v != '"')return v})
            answers = answers.join("");
            answers = answers.split(",");
            
            answers.forEach((v,i)=>{
                newAnswers[i+1] = v;
            })

            return newAnswers;
        }
    }

    onAnswerSelect = (num, index)=>{
        
        if(this.state.answers[index] == num.toString()){
            this.state.answers[index] = "empty";
        }else{
            this.state.answers[index] = num.toString();
        }
        this.setState(this.state)
    }

    onWindowResize = ()=>{
        this.responsive_answerHolder();
    }

    responsive_answerHolder = (cb)=>{
        let count = this.state.questions_count;
        let c = null;
        let pdf_width = 0;
        let pdf_height = 0;
        if(window.innerWidth<= 768){
            c = count/5;
            if(count%5){c++};
            pdf_width = 290;
            pdf_height = 460;
        }else if(window.innerWidth<= 1199){
            c = count/10;
            if(count%10){c++};
            pdf_width = 480;
            pdf_height= 700;
        }else{
            c = count/15;
            if(count%15){c++};
            pdf_width = 700;
            pdf_height = 1080;
        }
        c*=12;
        if(this.state.answer_holder_height != `${c}rem`){
            this.setState({answer_holder_height:`${c}rem`, pdf_height, pdf_width}, cb);
        }
    }

    calcutale_end_time = ()=>{
        this.state.timer = this.state.duration;
        this.setState(this.state, this.setTimer);
    }

    setTimer = ()=>{
        this.interval = setInterval(()=>{
            if(this.state.timer==0){
                this.state.endModalTitle = "اتمام زمان آزمون";
                this.testTimeout();
            }else if(this.state.timer==15 || this.state.timer==30 || this.state.timer%120==0){
                this.sendAnswers();
                this.setState({timer:this.state.timer-1});
            }else{
                this.setState({timer:this.state.timer-1});
            }
        },1000);
    }

    testTimeout = ()=>{
        
        clearTimeout(this.interval);

        this.setState({endModalVisible:true});
    }

    sendAnswers = ()=>{

        let answers = this.state.answers
        let temp = Object.keys(answers);
        let newAnswrs=[];
        temp.forEach(element => {
            newAnswrs.push(answers[element])
        });

        let json = {token:getCookie("_ca"), test_id:this.props.test_id, answers:newAnswrs};
        
        Axios.post(Server.domain+Server.urls.SAVE_TEST_ANSWERS, json).then((res)=>{

            if(res.data.result_code == Server.ResultCode.SUCCESS){

                console.log("saving answers success");
            }else{
                console.log("saving answers failed");
            }
        });
    }

    onDownloadPDF = ()=>{
        window.open(this.state.pdf_url);
    }

    onDocumentLoadSuccess = ({ numPages })=>{
        this.setState({total_pages:numPages, currentPage:1});
    }

    pdfNextPage = ()=>{
        if(this.state.currentPage != this.state.total_pages){
            this.setState({currentPage:this.state.currentPage+1});
        }
    }

    pdfPrevPage = ()=>{
        if(this.state.currentPage != 1 && this.state.currentPage !=0){
            this.setState({currentPage:this.state.currentPage-1});
        }
    }

    backToMyTest = ()=>{
        Controller.setPage(<MyTests/>, 5);
    }

    onEndClick = ()=>{

        let answers = this.state.answers;
        let temp = Object.keys(answers);
        let newAnswrs=[];
        temp.forEach(element => {
            newAnswrs.push(answers[element])
        });

        let json = {token:getCookie("_ca"), test_id:this.props.test_id, answers:newAnswrs};
        
        Axios.post(Server.domain+Server.urls.SAVE_TEST_ANSWERS, json).then((res)=>{
            res = res.data;
            if(res.result_code == Server.ResultCode.SUCCESS){

                Controller.openNotification("پاسخنامه با موفقیت ثبت شد", null, "success");
                
                this.testTimeout();
                
            }else{
                Controller.openNotification("خطا در ثبت پاسخنامه. لطفا دوباره تلاش کنید", "اتصال اینترنت خود را چک کنید و حتما از پاسخنامه عکس بگیرید", "error");
            }
        })
    }

    setupPdf=()=>{
        var url = 'https://online.mahtaschool.ir/pdfdl.php?file_id=04a049d356f14363157a5f859eee6c10';

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        var pdfjsLib = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

        // Asynchronous download of PDF
        var loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');
        
        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
            console.log('Page loaded');
            
            var scale = 1.5;
            var viewport = page.getViewport({scale: scale});

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('test_pdf_sec');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
            canvasContext: context,
            viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
            console.log('Page rendered');
            });
        });
        }, function (reason) {
        // PDF loading error
        console.error(reason);
        });
    }

    render() {
        if(this.state.loading){

            return(<div id="course_list"><Spiner/></div>)

        }else{
            let hour = Math.floor(this.state.timer/3600);
            let temp = this.state.timer - hour*3600;
            let min =  Math.floor(temp/60);
            let sec = (temp - (min*60))%60;
            if(min<10){min = "0"+min};
            if(sec<10){sec = "0"+sec}

            console.log(this.state.pdf_file_id);

        return (
            <div id="course_list">
                <div id="mytests_title">{this.props.test_title}</div>
                <div className="testView_time_sec">

                    <img className="testView_time_sec_img" src={Server.img_png("Timer")}/>
                    <div className="testView_time_sec_timer">{`زمان باقی مانده :  ${hour}:${min}:${sec}`}</div>
                    <div className="testView_time_sec_btn" onClick={this.onDownloadPDF}>{"دریافت سوال های آزمون"}</div>

                </div>

                <div className="testView_pdf_con" style={{position:'relative'}}>
                    <div className="testView_pdf_title">{"سوال های آزمون"}</div>
                    
                    <div className="testView_pdf_line"/>

                    {/* <div style={{display:"flex",alignItems:'center'}}>
                        <img src={Server.img_png("slider_prev")} className="testView_pdf_nav_btn" onClick={this.pdfPrevPage}/>
                        <div style={{fontWeight:700}}>{" صفحه "+this.state.currentPage+" "+"از"+" "+this.state.total_pages}</div>
                        <img src={Server.img_png("slider_next")}  className="testView_pdf_nav_btn" onClick={this.pdfNextPage}/>
                    </div> */}

                    {/* <embed src="https://online.mahtaschool.ir/pdfdl.php?file_id=0182084bfd73fb3fd06a365091b9d9fe" 
                    className={"testView_pdf_embed"}/> */}

                    <iframe src={"https://docs.google.com/gview?url=https://online.mahtaschool.ir/pdfdl.php?file_id="+this.state.pdf_file_id+"&embedded=true"}
                    frameborder="0" className={"testView_pdf_embed"}></iframe>

                    {/* <canvas id="test_pdf_sec">

                    </canvas> */}

                    {/* <div style={{ width:this.state.pdf_width, height:this.state.pdf_height, overflow:"hidden" }}>

                    

                    <Document file={this.state.pdf_url} onLoadSuccess={this.onDocumentLoadSuccess}
                        onLoadError={()=>{this.setState({pdf_failed:true})}}>
                        <Page pageNumber={this.state.currentPage} width={this.state.pdf_width} height={this.state.pdf_height}/>
                    </Document>

                    {
                        this.state.pdf_failed?
                        <TestPdfHelp style={{width:this.state.pdf_width, maxHeight:this.state.pdf_height}}/>:null
                    }

                    </div>  */}
                        
                </div>

                <div className="testView_answers_con">
                    <div className="testView_pdf_title">{"پاسخ برگ آزمون"}</div>
                    <div className="testView_pdf_line"/>

                    <div className="testView_answers_holder" style={{height:this.state.answer_holder_height}}>

                    <AnswerSec answer_list={this.state.answers} onAnswerSelect={this.onAnswerSelect}/>

                    </div>

                    <div className="testView_send_btn" onClick={this.onEndClick}>{"ثبت پاسخنامه و خروج"}</div>

                </div>

                <Modal visible={this.state.endModalVisible} onCancel={this.backToMyTest} footer={[
                <Button key="back" onClick={this.backToMyTest}>{"بازگشت"}</Button>]} title={this.state.endModalTitle}>
                    <p style={{textAlign:"center"}}>{"مرور پاسخنامه"}</p>
                    <br/>
                    <div style={{maxHeight:"50vh", minHeight:"25vh", overflowY:"scroll"}}>
                        <div className="testView_answers_holder" style={{height:this.state.answer_holder_height}}>
                        <AnswerSec answer_list={this.state.answers} onAnswerSelect={this.onAnswerSelect} readonly={true}/>
                    </div>
                    </div>

                </Modal>

            </div>
        )
    }
    }
}

class AnswerSec extends Component{

    onSelect = (num, index)=>{
        if(this.props.readonly){return}
        this.props.onAnswerSelect(num, index);
    }

    render(){
        let count = Object.keys(this.props.answer_list).length;
        let p1 = Math.floor(count/5);
        let p1_arr = [];
        for(let i1=0;i1<p1*5;i1++){p1_arr.push(i1)};
        let p2 = count%5;
        let p2_arr = [];
        for(let i2=p1*5;i2<(p1*5)+p2;i2++){p2_arr.push(i2)};
        let mod_style = {};
        if(!p2_arr.length){mod_style={display:"none"}}

        return(
            <React.Fragment>
                {
                    p1_arr.map((v,i)=>{
                        if(v%5 === 0){
                            return(<div className="answer_sec_con" key={`${i}`}>
                                <AnswerRow key={`ar${v}`} index={v+1} answer={this.props.answer_list[v+1]} onSelect={this.onSelect}/>
                                <AnswerRow key={`ar${v+1}`} index={v+2} answer={this.props.answer_list[v+2]} onSelect={this.onSelect}/>
                                <AnswerRow key={`ar${v+2}`} index={v+3} answer={this.props.answer_list[v+3]} onSelect={this.onSelect}/>
                                <AnswerRow key={`ar${v+3}`} index={v+4} answer={this.props.answer_list[v+4]} onSelect={this.onSelect}/>
                                <AnswerRow key={`ar${v+4}`} index={v+5} answer={this.props.answer_list[v+5]} onSelect={this.onSelect}/>
                            </div>)
                        }else{
                            return null
                        }
                    })
                }

                <div className="answer_sec_con" style={mod_style}>
                {
                    p2_arr.map((v,i)=>(
                        <AnswerRow key={`ar${v+1}`} index={v+1} answer={this.props.answer_list[v+1]} onSelect={this.onSelect}/>
                    ))
                }
                </div>
                
            </React.Fragment>
        )
    }
}

class AnswerRow extends Component{

    render(){
        return(
            <div className="answer_row_con">
                <div className="answer_row_number">{this.props.index+"."}</div>
                
                <div className="answer_row_squ" onClick={()=>this.props.onSelect(1,this.props.index)}>
                    {
                        this.props.answer=="1"?
                        <React.Fragment>
                        <div style={{color:"white",zIndex:2}}>{"1"}</div>
                        <div style={{backgroundColor:"gray"}} className="answer_row_squ_fill"/>
                        </React.Fragment>:
                        <React.Fragment>
                        <div>{"1"}</div>
                        <div className="answer_row_squ_fill"/>
                        </React.Fragment>
                    }
                </div>
                <div className="answer_row_squ" onClick={()=>this.props.onSelect(2,this.props.index)}>
                {
                        this.props.answer=="2"?
                        <React.Fragment>
                        <div style={{color:"white",zIndex:2}}>{"2"}</div>
                        <div style={{backgroundColor:"gray"}} className="answer_row_squ_fill"/>
                        </React.Fragment>:
                        <React.Fragment>
                        <div>{"2"}</div>
                        <div className="answer_row_squ_fill"/>
                        </React.Fragment>
                    }
                </div>
                <div className="answer_row_squ" onClick={()=>this.props.onSelect(3,this.props.index)}>
                {
                        this.props.answer=="3"?
                        <React.Fragment>
                        <div style={{color:"white",zIndex:2}}>{"3"}</div>
                        <div style={{backgroundColor:"gray"}} className="answer_row_squ_fill"/>
                        </React.Fragment>:
                        <React.Fragment>
                        <div>{"3"}</div>
                        <div className="answer_row_squ_fill"/>
                        </React.Fragment>
                    }
                </div>
                <div className="answer_row_squ" onClick={()=>this.props.onSelect(4,this.props.index)}>
                {
                        this.props.answer=="4"?
                        <React.Fragment>
                        <div style={{color:"white",zIndex:2}}>{"4"}</div>
                        <div style={{backgroundColor:"gray"}} className="answer_row_squ_fill"/>
                        </React.Fragment>:
                        <React.Fragment>
                        <div>{"4"}</div>
                        <div className="answer_row_squ_fill"/>
                        </React.Fragment>
                    }
                </div>

            </div>
        )
    }
}

/**@param {string} path */
function getFileFromPath(path){

    let p = path.split("/");

    let file_name = p.pop();

    console.log(file_name);

    let name = file_name.split(".");

    
    name.pop();

    console.log(name);

    return name.join(".");
}