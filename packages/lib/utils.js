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

  const words = _text.split(' ').filter(word => word !== '')
  const indexPresentSpecialKeyword = words.indexOf(includedSpecialKeyword)

  if (words[indexPresentSpecialKeyword + 1].match('#[1-9][0-9]*')) {
    return words[indexPresentSpecialKeyword + 1].substr(
      1,
      words[indexPresentSpecialKeyword + 1].length
    )
  }
}

const getIssueNumberFromIssue = _issue => {
  return _issue.attributes[0].value.match(/[0-9]*/g).find(e => e !== '')
}

export { extrapolateIssueNumberFromText, getIssueNumberFromIssue }
