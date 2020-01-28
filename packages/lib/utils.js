import Web3 from 'web3'

const web3 = new Web3()

const specialKeywords = [
  'close',
  'closes',
  'closed',
  'fix',
  'fixes',
  'fixed',
  'resolve',
  'resolves',
  'resolved'
]

const PREFIX = 'Ξ'
const ETH_ADDRESS_LENGTH = 21

const extrapolateEthAddressFromBio = _bio => {
  const index = _bio.indexOf(PREFIX)
  if (index < 0) return false

  const ethAddress = _bio.substr(index + 1, index + 1 + ETH_ADDRESS_LENGTH)
  if (!web3.utils.isAddress(ethAddress)) return false

  return ethAddress
}

const extrapolateIssueNumberFromText = _text => {
  let isIncluded = false
  let includedSpecialKeyword = null
  for (let word of specialKeywords) {
    if (_text.includes(word)) {
      isIncluded = true
      includedSpecialKeyword = word
      break
    }
  }

  if (!isIncluded) return false

  const words = _text.split(' ')
  const indexPresentSpecialKeyword = words.indexOf(includedSpecialKeyword)

  if (words[indexPresentSpecialKeyword + 1].match('#[1-9][1-9]*')) {
    return words[indexPresentSpecialKeyword + 1].substr(
      1,
      words[indexPresentSpecialKeyword + 1].length
    )
  }
}

const getIssueNumberFromIssue = _issue => {
  return _issue.attributes[0].value.substr(
    _issue.attributes[0].value.length - 1,
    1
  )
}

export {
  extrapolateEthAddressFromBio,
  extrapolateIssueNumberFromText,
  getIssueNumberFromIssue
}
