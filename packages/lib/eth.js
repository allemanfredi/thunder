import CONTRACT_ABI from './contractAbi/abi'
const CONTRACT_ADDRESS = '0xc50caeac63197791857169d0b73218b4dd0194ee'

const correctEthFormat = (_amount, _decimals, _operation) =>
  _operation === '/'
    ? _amount / Math.pow(10, _decimals)
    : parseInt(_amount * Math.pow(10, _decimals))

const _getEthAccount = _web3 =>
  new Promise((resolve, reject) => {
    _web3.eth
      .getAccounts()
      .then(accounts => resolve(accounts[0]))
      .catch(err => reject(err))
  })

const _getEthContract = (_web3, _account) =>
  new _web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS, {
    from: _account
  })

const makeEthContractCall = async (_web3, _method, _params = []) => {
  const account = await _getEthAccount(_web3)
  const contract = _getEthContract(_web3, account)
  return contract.methods[_method](..._params).call()
}

const makeEthContractSend = async (_web3, _method, _value, _params = []) => {
  const account = await _getEthAccount(_web3, true)
  const contract = _getEthContract(_web3, account)
  return contract.methods[_method](..._params).send({
    from: account,
    value: _value
  })
}

export { makeEthContractCall, makeEthContractSend, correctEthFormat }
