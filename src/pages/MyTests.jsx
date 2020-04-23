import React, { Component } from 'react';
import './myTests.css';
import { Breadcrumb } from 'antd';
import {HomeOutlined} from '@ant-design/icons';

class mytests extends Component {
    static propTypes = {

    }

    render() {
        return (
            <div id="mytests">
                <div id="mytests_title">{"آزمون های من"}</div>

                <div className="Breadcrumb_con">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item><HomeOutlined /></Breadcrumb.Item>
                        <Breadcrumb.Item>{"آزمون های من"}</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div id="mytests_holder">

                    <div className="mytests_alert_card_con">
                        <div className="mytests_alert_lable"/>
                        <div className="mytests_alert_text">{tx}</div>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default mytests
const tx = `شما هیچ آزمون فعالی ندارید`
