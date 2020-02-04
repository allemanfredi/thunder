import React, { Component } from 'react'
import Main from './main/Main'
import MainWrapper from '../components/MainWrapper'
import Duplex from '@thunder/lib/duplex'
import { popupMessanger } from '@thunder/lib/messangers'

import './app.css'

class App extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {}

    this.duplex = new Duplex.Popup()
  }

  async componentWillMount() {
    popupMessanger.init(this.duplex)

    const globalState = await popupMessanger.getGlobalState()
    this.setState({ globalState })

    this.duplex.on('onChangeGlobalState', globalState => {
      this.setState({ globalState })
    })
  }

  render() {
    if (this.state.globalState) {
      return (
        <MainWrapper>
          <Main globalState={this.state.globalState} />
        </MainWrapper>
      )
    } else return null
  }
}

export default App
