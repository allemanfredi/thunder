import gh from 'parse-github-url'
import { makeEthContractCall, makeEthContractSend } from '@thunder/lib/eth'

const NewIssue = {
  form: null,

  async injectElements(_web3, _inpageRequester, _url) {
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
        '#new_issue > div > div.col-md-9.col-sm-12 > div > div > tab-container'
      )
      .insertAdjacentHTML(
        'afterend',
        `
      <hr/>
      <div style="display: inline-grid;">
        <label style="margin-left:10px;">Bounty (in ETH)</label>
        <input id="bounty-value" class="form-control" style="margin-top:5px; margin-bottom:5px; margin-left:10px; width:200px;"/>
        <span style="margin-left:10px; font-size:13px; margin-top:10px">
          <b>Important! </b> If you want to reward who will solve this issue, please enter the reward (in ETH) in the box above
        </span>
      </div>
      <hr/>
    `
      )

    this.form = document.querySelector('#new_issue')
    this.form.addEventListener('submit', event => {
      this.handleSubmit(event, _web3, _inpageRequester, _url)
    })
  },

  async handleSubmit(_event, _web3, _inpageRequester, _url) {
    _event.preventDefault()

    const bountyText = document.querySelector('#bounty-value').value
    if (parseFloat(bountyText) > 0) {
      const details = gh(_url)

      const issues = await _inpageRequester.send('getRepoIssues', {
        repo: details.repo
      })

      const issueNumber = issues.length + 1
      const repoOwner = details.owner
      const repoName = details.repo.split('/')[1]

      console.log(
        'issue will be created with issue',
        issueNumber,
        repoName,
        repoOwner
      )

      try {
        const res = await makeEthContractSend(
          _web3,
          'newIssue',
          _web3.utils.toWei(bountyText, 'ether'),
          [repoOwner, repoName, issueNumber]
        )
        if (res) this.form.submit()
      } catch (err) {
        //TODO: cancel event
        console.log(err)
      }
    } else {
      this.form.submit()
    }
  }
}

export default NewIssue
