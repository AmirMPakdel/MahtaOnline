import React, { Component } from 'react'

class InfoCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <div style={this.props.style} className={this.props.className}>

                <div className="streams_alert_card_con">
                    <div className="streams_alert_lable"/>
                    <div className="streams_alert_text">{this.props.title}</div>
                </div>
                    
            </div>
        )
    }
}

export default InfoCard
