import { getIssueNumberFromIssue } from '@thunder/lib/utils'
import { makeEthContractCall } from '@thunder/lib/eth'
import gh from 'parse-github-url'

const pricesColor = {
  low: 'rgb(255, 205, 86)',
  normal: 'rgb(54, 162, 235)',
  high: 'rgb(255, 102, 102)'
}

const Issues = {
  injectElements(_web3, _url) {
    const issuesHTMLCollection = document.querySelector(
      '#js-repo-pjax-container > div.container-lg.clearfix.new-discussion-timeline.experiment-repo-nav.px-3 > div > div > div.Box.mt-3 > div:nth-child(2) > div'
    ).children

    const details = gh(_url)
    const repoOwner = details.owner
    const repoName = details.repo.split('/')[1]

    const issues = [...issuesHTMLCollection]
    issues.forEach(async issue => {
      const issueNumber = getIssueNumberFromIssue(issue)
      const issueBounty = await makeEthContractCall(_web3, 'getIssuePrice', [
        repoOwner,
        repoName,
        parseInt(issueNumber)
      ])
      const issueBountyInEth = _web3.utils.fromWei(
        _web3.utils.toBN(issueBounty),
        'ether'
      )
      if (issueBountyInEth > 0) {
        document.querySelector(`#issue_${issueNumber}_link`).insertAdjacentHTML(
          'afterend',
          `
          <span style="margin-left: 10px;
            margin-right: 5px;
            font-weight: bold;
            height: 20px;
            padding: .15em 4px;
            font-size: 12px;
            font-weight: 600;
            line-height: 15px;
            border-radius: 2px;
            background-color: ${pricesColor['high']};">
            ${issueBountyInEth} Eth
          </span>
        `
        )
      }
    })
  }
}

export default Issues
