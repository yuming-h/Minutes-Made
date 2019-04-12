import Link from "next/link";
import React, { Component } from "react";

import { Menu, Input, Button } from "semantic-ui-react";

const logoStyle = {
  marginTop: "-6px",
  width: "45px",
  height: "35px"
};

const headerFontStyle = {
  marginTop: "1px",
  color: "#050D50"
};

export default class Header extends Component {
  render() {
    return (
      <Menu secondary stackable>
        <Link href="/">
          <Menu.Item name="home">
            <img style={logoStyle} src="/static/logo.png/" alt="logo" />
            <h1 style={headerFontStyle}>Minutes Made</h1>
          </Menu.Item>
        </Link>
        <Link href="/about">
          <Menu.Item name="about">
            <b>About</b>
          </Menu.Item>
        </Link>
        <Link href="/integrations">
          <Menu.Item name="integrations">
            <b>Integrations</b>
          </Menu.Item>
        </Link>
        <Link href="/pricing">
          <Menu.Item name="pricing">
            <b>Pricing</b>
          </Menu.Item>
        </Link>
        <Menu.Menu position="right">
          <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item>
          <Link href="/login">
            <Menu.Item name="login">
              <b>Login</b>
            </Menu.Item>
          </Link>
          <Menu.Item>
            <Link href="/register">
              <Button primary>Sign up</Button>
            </Link>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
