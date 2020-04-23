import React, { Component } from "react";
import Server from "../Server";
import ReactDOM from "react-dom";
import "./header.css";
import Controller from "../Controller";

export default class Header extends Component {
  state = { show_backdrop: false };

  componentDidMount() {
    Controller.showBackdrop = this.showBackdrop;
    Controller.hideBackdrop = this.hideBackdrop;

    window.addEventListener("scroll", (obj) => {
      if (document.scrollingElement.scrollTop < 10) {
        this.HomeBar_con.style.boxShadow = "none";
      } else {
        this.HomeBar_con.style.boxShadow =
          "0 0.1875rem 0.5rem 0.3125rem rgba(0, 0, 0, 0.12)";
      }
    });

    window.addEventListener("resize", () => {
      if (Controller.menu_is_open) {
        Controller.closeMenu();
      }
    });
  }

  onMenu = () => {
    Controller.onMenu();
  };

  showBackdrop = () => {
    Controller.onBackdrop = () => {
      Controller.closeMenu();
      Controller.hideBackdrop();
    };
    this.setState({ show_backdrop: true });
  };

  hideBackdrop = () => {
    this.setState({ show_backdrop: false });
  };

  render() {
    return (
      <div className="HomeBar_con" ref={(ref) => (this.HomeBar_con = ref)}>
        <Backdrop
          show={this.state.show_backdrop}
          onClick={Controller.onBackdrop}
        />

        <div className="HomeBar_holder">
          <a className="HomeBar_mahta_title" href="/">
            {"Mahta"}
          </a>

          <div className="HomeBar_space1" />

          <img
            className="HomeBar_hambergurButton"
            onClick={this.onMenu}
            src={Server.urls.FILE + "hamburgurBtn.png"}
          />
        </div>
      </div>
    );
  }
}

function Backdrop(props) {
  let jsx = null;

  if (props.show) {
    jsx = (
      <div
        onClick={props.onClick}
        style={{
          position: "fixed",
          zIndex: 20,
          width: "100vw",
          height: "100vh",
          background: "black",
          opacity: 0.75,
        }}
      ></div>
    );
  }
  return ReactDOM.createPortal(jsx, document.getElementById("backdrop-hook"));
}
