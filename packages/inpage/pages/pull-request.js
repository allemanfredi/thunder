import { extrapolateIssueNumberFromText } from '@thunder/lib/utils'
import { makeEthContractSend, makeEthContractCall } from '@thunder/lib/eth'
import gh from 'parse-github-url'

const pricesColor = {
  low: 'rgb(255, 205, 86)',
  normal: 'rgb(54, 162, 235)',
  high: 'rgb(255, 159, 64)'
}

const PullRequest = {
  form: null,

  async injectElements(_web3, _url, _inpageRequester) {
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
      <div style="
        margin-left: 15px;
        font-size: 14px;
        margin-bottom: 10px;
        background: ${pricesColor['high']};
        margin-right: 30%;
        padding: 5px 5px 5px 5px;
        font-weight: bold;
        line-height: 15px;
        border-radius: 2px;">
        If you want to get paid please enter which issue solves this pull request (e.g. resolve #1)
      </div> 
      <hr/>
    `
      )

    this.form = document.querySelector('#new_pull_request')
    this.form.addEventListener('submit', event => {
      this.handleSubmit(event, _web3, _url, _inpageRequester)
    })
  },

  async handleSubmit(_event, _web3, _url, _inpageRequester) {
    _event.preventDefault()

    const pullRequestTextBody = document.querySelector('#pull_request_body')
      .value

    const pullRequestCreatorImg = document.querySelector(
      '#new_pull_request > div > div.col-9 > div > span > a > img'
    )
    const pullRequestCreator = pullRequestCreatorImg.alt.substr(1)

    const details = gh(_url)
    const issues = await _inpageRequester.send('getRepoIssues', {
      repo: details.repo
    })
    const repoOwner = details.owner
    const repoName = details.repo.split('/')[1]
    const issueNumber = extrapolateIssueNumberFromText(pullRequestTextBody)
    const pullRequestNumber = issues.length + 1

    // TODO: check that the issue exists

    if (!issueNumber) {
      console.log('Impossible to extrapolate issue number')
      return
    }

    try {
      const isPullRequestCreated = await makeEthContractSend(
        _web3,
        'newPullRequest',
        0,
        [
          repoOwner,
          repoName,
          issueNumber,
          pullRequestNumber,
          pullRequestCreator
        ]
      )
      if (!isPullRequestCreated) return
    } catch (err) {
      return
    }

    this.form.submit()
  }
}

export default PullRequest
