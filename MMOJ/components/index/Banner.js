import React, { Component } from "react";

const bannerStyle = {
  background: "black",
  color: "white",
  position: "relative",
  textAlign: "centre"
};

const meetingImgStyle = {
  width: "100%",
  zIndex: "0",
  opacity: "0.65"
};

const headingStyle = {
  fontSize: "35px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)"
};

export default class Header extends Component {
  render() {
    return (
      <div style={bannerStyle}>
        <img
          style={meetingImgStyle}
          src="/static/meeting.jpg"
          alt="my meeting"
        />
        <div style={headingStyle}>
          <p>Get started with Minutes Made today.</p>
        </div>
      </div>
    );
  }
}
