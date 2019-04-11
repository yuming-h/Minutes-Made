import Layout from "../components/MyLayout.js";
import { Component } from "react";

const pageStyle = {
  margin: "25px 50px 25px 30px"
};

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div style={pageStyle}>
          <h1>Login Page - Under Construction.</h1>
        </div>
      </Layout>
    );
  }
}
