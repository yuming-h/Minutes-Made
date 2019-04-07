import Link from 'next/link'
import React, { Component } from 'react'

import { Menu, 
  Input,
  MenuItem } from 'semantic-ui-react'

const logoStyle = {
  width: '100px'
}

export default class Header extends Component {
  render() {
    return (
      <Menu secondary>
        <MenuItem>
          <h1>Minutes Made</h1>
        </MenuItem>
        <Link href="/">
          <Menu.Item name='home'>
            Home
          </Menu.Item>
        </Link>
        <Menu.Menu position='right'>
            <Menu.Item>
              <Input icon='search' placeholder='Search...' />
            </Menu.Item>
          </Menu.Menu>
      </Menu>
    )
  }
}
