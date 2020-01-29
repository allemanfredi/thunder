import gh from 'parse-github-url'

const NewIssue = {
  form: null,

  async injectElements(_web3, _inpageRequester, _url) {
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

    if (parseInt(document.querySelector('#bounty-value').value) > 0) {
      const issueTitle = document.querySelector('#issue_title').value

      const details = gh(_url)

      const issues = await _inpageRequester.send('getRepoIssues', {
        repo: details.repo
      })

      const newIssueId = issues.length + 1

      console.log('issue will be created with issue', newIssueId)
      const accounts = await _web3.eth.getAccounts()

      //contract.newIssue(details.repo, newIssueid, issueText, bounty) or
      //contract.newIssue(details.repo, newIssueid,  bounty)
    }

    //this.form.submit()
  }
}

export default NewIssue
