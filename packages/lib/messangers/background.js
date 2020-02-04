export default {
  init(duplex) {
    this.duplex = duplex
  },

  changeGlobalState(_state) {
    this.duplex.send('popup', 'onChangeGlobalState', _state, false)
  }
}
