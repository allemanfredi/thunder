export default {
  init(duplex) {
    this.duplex = duplex
  },

  changeEnabling(_isEnabled) {
    return this.duplex.send('changeEnabling', _isEnabled)
  },

  getGlobalState() {
    return this.duplex.send('getGlobalState')
  }
}
