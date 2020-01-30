const getCorrespondingPageFromGithubURL = _url => {
  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/issues([\/]?\?[0-9a-zA-Z%=+]*open[0-9a-zA-Z%=+]*)?/g,
      _url
    )
  )
    return 'issues'

  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/issues\/[0-9][0-9]*?/g,
      _url
    )
  )
    return 'issue-details'

  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/compare\/[a-z0-9]*\?expand=1/g,
      _url
    )
  )
    return 'pull-request'

  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/issues\/new\/?/g,
      _url
    )
  )
    return 'new-issue'
}

const _matchExact = (r, str) => {
  var match = str.match(r)
  return match && str === match[0]
}

export { getCorrespondingPageFromGithubURL }
