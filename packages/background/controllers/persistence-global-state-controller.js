import { backgroundMessanger } from '@thunder/lib/messangers/'
import { Store } from 'rxjs-observable-store'

class InitialSettings {
  constructor() {
    this.isEnabled = false
  }
}

class PersistenceGlobalStateController extends Store {
  constructor() {
    super(new InitialSettings())

    const data = this._loadFromStorage()
    if (this.data) this.setState(data)

    this.state$.subscribe(_state => {
      backgroundMessanger.changeGlobalState(_state)
      localStorage.setItem('data', JSON.stringify(_state))
    })
  }

  changeEnabling(_isEnabled) {
    this.setState({
      ...this.state,
      isEnabled: _isEnabled
    })
  }

  _loadFromStorage() {
    const data = localStorage.getItem('data')
    return data ? JSON.parse(data) : null
  }
}

export default PersistenceGlobalStateController
