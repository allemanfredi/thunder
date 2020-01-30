import gh from 'parse-github-url'
import { makeEthContractCall } from '@thunder/lib/eth'

const pricesColor = {
  low: 'rgb(255, 205, 86)',
  normal: 'rgb(54, 162, 235)',
  high: 'rgb(255, 159, 64)'
}

const IssueDetails = {
  async injectElements(_web3, _url) {
    const textIssueNumber = document.querySelector(
      '#partial-discussion-header > div.gh-header-show > div > h1 > span.gh-header-number'
    ).innerText
    const issueNumber = parseInt(
      textIssueNumber.substr(1, textIssueNumber.length)
    )

    const details = gh(_url)
    const repoOwner = details.owner
    const repoName = details.repo.split('/')[1]

    const issueBounty = await makeEthContractCall(_web3, 'getIssuePrice', [
      repoOwner,
      repoName,
      parseInt(issueNumber)
    ])
    const issueBountyInEth = _web3.utils.fromWei(
      _web3.utils.toBN(issueBounty),
      'ether'
    )

    const labelNotPresent = document.querySelector(
      '#partial-discussion-sidebar > div.discussion-sidebar-item.sidebar-labels.js-discussion-sidebar-item'
    ).lastElementChild
    if (labelNotPresent.innerText === 'None yet' && issueBountyInEth > 0)
      labelNotPresent.innerText = ''

    if (issueBountyInEth > 0) {
      document.querySelector('#labels-select-menu').insertAdjacentHTML(
        'afterend',
        `
      <div class="labels css-truncate js-issue-labels">
        <a class="sidebar-labels-style box-shadow-none width-full d-block" style="height: 20px;
          padding: .15em 4px;
          font-size: 12px;
          font-weight: 600;
          line-height: 15px;
          border-radius: 2px; background-color: ${pricesColor['high']}; color: black">
            <span class="css-truncate-target" style="max-width: 100%">${issueBountyInEth} Eth</span>
        </a>
      </div>
      `
      )
    }
  }
}

export default IssueDetails
