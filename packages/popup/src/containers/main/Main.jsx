import React, { Fragment, useState } from 'react'
import ToggleButton from 'react-toggle-button'
import Header from '../header/Header'
import './main.css'

const Main = props => {
  const [toogleEnabled, setToogleEnabled] = useState(0)

  return (
    <Fragment>
      <Header />
      <hr />
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
