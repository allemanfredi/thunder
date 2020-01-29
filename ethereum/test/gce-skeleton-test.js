const { PREFIX, waitForEvent } = require('./utils')

const Web3 = require('web3')
const wallet = artifacts.require('./Wallet.sol')
const web3 = new Web3(
  new Web3.providers.WebsocketProvider('ws://localhost:9545')
)

contract('GCE Skeleton Tests', accounts => {
  let contractPrice
  const gasAmt = 3e6
  const address = accounts[0]

  beforeEach(
    async () => (
      ({ contract } = await wallet.deployed()),
      ({ methods, events } = new web3.eth.Contract(
        contract._jsonInterface,
        contract._address
      ))
    )
  )

  it('Should have logged a new Github repo', async () => {
    const {
      returnValues: { description }
    } = await waitForEvent(events.NewGithubRepoEvent)
    assert.strictEqual(
      description,
      'New Github repo created',
      'New Github repo incorrectly logged!'
    )
  })
})
