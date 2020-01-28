import React, { Fragment, useState } from 'react'
import Particles from 'react-particles-js'
import particlesSettings from './particles-settings'
import ToggleButton from 'react-toggle-button'
import './main.css'

const Main = props => {
  const [toogleEnabled, setToogleEnabled] = useState(0)

  return (
    <Fragment>
      <Particles
        width={300}
        height={150}
        style={{
          'background-color': '#000016'
        }}
        params={particlesSettings}
      />
      <div className="main__header-container">
        <h1 className="main__header-title">Thunder</h1>
        <img
          src="./material/logo/thunder-128.png"
          height="100"
          width="100"
          alt="thunder-logo"
        />
      </div>
      <div className="main__body-container">
        <div className="main__body-container-toogle-button">
          <ToggleButton
            value={toogleEnabled || false}
            onToggle={value => {
              setToogleEnabled(!value)
            }}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default Main
