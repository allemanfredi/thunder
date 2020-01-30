import React, { Fragment } from 'react'
import Particles from 'react-particles-js'
import particlesSettings from './particles-settings'

import './header.css'

const Header = props => {
  return (
    <Fragment>
      <Particles
        width={300}
        height={150}
        style={{
          'background-color': 'rgb(255, 159, 64)'
        }}
        params={particlesSettings}
      />
      <div className="header__container">
        <h1 className="header__title">Thunder</h1>
        <h2 className="header__sub-title">Start monetizing your code</h2>
        <img
          src="./material/logo/thunder-128.png"
          height="100"
          width="100"
          alt="thunder-logo"
        />
      </div>
    </Fragment>
  )
}

export default Header
