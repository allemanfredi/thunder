const _matchExact = (r, str) => {
  const match = str.match(r)
  return match && str === match[0]
}

const getCorrespondingPageFromGithubURL = _url => {
  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/issues([/]?\?[0-9a-zA-Z%=+]*open[0-9a-zA-Z%=+]*)?/g,
      _url
    )
  )
    return 'issues'

  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/issues\/[0-9]*/g,
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

  if (_matchExact(/https:\/\/github.com\/new\/?/g, _url)) return 'new-repo'

  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/pull\/[0-9]*/g,
      _url
    )
  )
    return 'merge-pull-request'

  if (_matchExact(/https:\/\/github.com\/[a-z0-9]*?[?tab=[a-z]*]?/g, _url))
    return 'profile'

  if (
    _matchExact(
      /https:\/\/github.com\/[a-zA-Z0-9]*\/[a-zA-ZA0-9]*\/settings[\/]?/g,
      _url
    )
  )
    return 'repo-settings'
}

export { getCorrespondingPageFromGithubURL }
