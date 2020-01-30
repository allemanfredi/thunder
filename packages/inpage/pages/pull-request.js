import {
  extrapolateIssueNumberFromText
} from '@thunder/lib/utils'
import {  makeEthContractSend, makeEthContractCall } from '@thunder/lib/eth'
import gh from 'parse-github-url'

const PullRequest = {
  form: null,

  async injectElements(_web3, _url) {

    const details = gh(_url)
    const repoOwner = details.owner
    const repoName = details.repo.split('/')[1]

    try {
      const hasBountyOption = await makeEthContractCall(
        _web3,
        'hasRepoBountyOption',
        [repoOwner, repoName]
      )
      if (!hasBountyOption) return
    } catch (err) {
      return
    }

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
      this.handleSubmit(event, _web3, _url)
    })
  },

  async handleSubmit(_event, _web3, _url) {
    _event.preventDefault()

    const pullRequestTextBody = document.querySelector('#pull_request_body')
      .value

    const details = gh(_url)
    const repoOwner = details.owner
    const repoName = details.repo.split('/')[1]
    const issueNumber = extrapolateIssueNumberFromText(pullRequestTextBody)

    if (!issueNumber) {
      console.log('Impossible to extrapolate issue number')
      return;
    }

    try {
      const isPullRequestCreated = await makeEthContractSend(
        _web3,
        'newPullRequest',
        0,
        [repoOwner, repoName, issueNumber]
      )
      if (!isPullRequestCreated) return
    } catch (err) {
      return
    }

    this.form.submit()
  }
}

export default PullRequest
