const ERROR_PREFIX =
  'Returned error: VM Exception while processing transaction: '

const waitForEvent = (_event, _from = 0, _to = 'latest') =>
  new Promise((resolve, reject) =>
    _event({ fromBlock: _from, toBlock: _to }, (e, ev) =>
      e ? reject(e) : resolve(ev)
    )
  )

const getContract = (_contractArtifacts, web3) =>
  _contractArtifacts.new().then(({ contract }) => {
    return new web3.eth.Contract(contract._jsonInterface, contract._address)
  })

module.exports = {
  waitForEvent,
  getContract,
  ERROR_PREFIX
}
