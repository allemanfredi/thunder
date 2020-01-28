import RequestHandler from './handlers/RequestHandler'
import EventChannel from '@thunder/lib/EventChannel'
import Layouter from './pages'

const pageHook = {

  init () {
    this._bindEventChannel()
    this._bindEvents()

    this.request('init').then(() => {}).catch(err => {
      console.log('Failed to initialise ', err)
    })

    Layouter.init(
      window.location.href,
      this.request
    )
  },

  _bindEventChannel () {
    this.eventChannel = new EventChannel('pageHook')
    this.request = RequestHandler.init(this.eventChannel)
  },

  _bindEvents () {
    /* this.eventChannel.on('setAddress', address => (
				this.setAddress(address)
		)) */
  }
}

pageHook.init()
