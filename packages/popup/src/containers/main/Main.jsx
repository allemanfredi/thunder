import React, { Fragment, useState } from 'react'
import Header from '../header/Header'
import Switch from 'react-switch'
import './main.css'

const Main = props => {
  const [toogleEnabled, setToogleEnabled] = useState(0)

  return (
    <Fragment>
      <Header />
      <hr />
      <div className="main__body-container">
        <div className="main__body-container-toogle-button">
          <Switch
            checked={toogleEnabled}
            onChange={() => {
              setToogleEnabled(!toogleEnabled)
            }}
            onColor="#888888"
            onHandleColor="#ffa040"
            handleDiameter={30}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
            height={20}
            width={48}
            className="react-switch"
          />
        </div>
      </div>
    </Fragment>
  )
}

export default Main
