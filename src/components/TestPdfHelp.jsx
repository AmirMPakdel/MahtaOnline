import React, { Component } from 'react'
import Server from '../Server';
import './testPdfHelp.css';

class TestPdfHelp extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <div style={{...{position:"absolute", top:"3.8rem", background:'white'}, ...this.props.style}}>
                <div className="tph_title">{"برای نمایش سوالات لطفا دانلود منیجر خود را غیر فعال نمایید"}</div>
                <div className="tph_step">{"مراحل غیر قعال کردن Internet Download Manager"}</div>
                <div className="tph_step">{"1. به پنجره option نرم افزار IDM رفته و سربرگ General را انتخاب کنید."}</div>
                <div className="tph_step">{"2. در قسمتی که با فلش نشان داده شده است تیک مرورگر مورد نظر خود را بردارید."}</div>
                <div className="tph_step">{"3. دکمه ok را بزنید و مرورگر خود را ببندید و دوباره باز کنید"}</div>
                <img className="tph_img" src={Server.urls.FILE+"idm.jpg"}/>
            </div>
        )
    }
}

export default TestPdfHelp
