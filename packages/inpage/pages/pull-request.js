import {
  extrapolateIssueNumberFromText,
  extrapolateEthAddressFromBio
} from '@thunder/lib/utils'

const PullRequest = {
  form: null,

  injectElements(_web3, _request) {
    document
      .querySelector(
        '#new_pull_request > div > div.col-9 > div > div > tab-container'
      )
      .insertAdjacentHTML(
        'afterend',
        `
      <hr/>
      <span style="margin-left:10px">
        <b>Important! </b> If you want to get paid please enter which issue solves this pull request (e.g. resolve #1)
      </span> 
      <hr/>
    `
      )

    this.form = document.querySelector('#new_pull_request')
    this.form.addEventListener('submit', event => {
      this.handleSubmit(event, _web3, _request)
    })
  },

  async handleSubmit(_event, _web3, _request) {
    _event.preventDefault()

    const whoPerformPullRequest = document.querySelector(
      '#new_pull_request > div > div.col-9 > div > span > a > img'
    ).alt
    const pullRequestTextBody = document.querySelector('#pull_request_body')
      .value

    const issueNumber = extrapolateIssueNumberFromText(pullRequestTextBody)

    //check if this issue is payable -> send to the contract who did the PR -> we need to get it's eth address or ENS name
    //for now we can use 'Ξ' taken from the bio
    //we could also set the name within the popup and store it in the local storage

    //check if there is this issue for the given repo, if the repo is payable

    const info = await _request('getAccountInfo', {
      username: whoPerformPullRequest.substr(1, whoPerformPullRequest.length)
    })

    const whoPerformPullRequestEthAddress = extrapolateEthAddressFromBio(
      info.bio
    )
    if (!whoPerformPullRequestEthAddress) {
      console.info(
        'Please paste your ETH address in your bio preceded by Ξ or check that is correct'
      )
      return
    }

    //contract.newPullRequest(whoPerformPullRequest.substr(1,whoPerformPullRequest.length), whoPerformPullRequestEthAddress, issueNumber)

    console.log(`
      ${whoPerformPullRequest.substr(1, whoPerformPullRequest.length)} 
      want to be paid at ${whoPerformPullRequestEthAddress} 
      for the issue #${issueNumber}`)

    //this.form.submit()
  }
}

export default PullRequest
