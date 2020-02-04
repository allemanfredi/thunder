import gh from 'parse-github-url'
import { makeEthContractSend, makeEthContractCall } from '@thunder/lib/eth'
import { extrapolateIssueNumberFromText } from '@thunder/lib/utils'

const sleep = _ms => new Promise(resolve => setTimeout(resolve, _ms))

const MergePullRequest = {
  form: null,
  issueNumber: null,
  pullRequestCreator: null,
  pullRequestCreatorAddress: null,

  async injectElements (_web3, _url) {
    const firstCommentWhereIssueNumberShouldBe = document.querySelector(
      '#discussion_bucket > div.col-9 > div > div.js-discussion.js-socket-channel.ml-6.pl-3'
    ).firstElementChild.lastElementChild.firstElementChild.children[2].innerText
    this.issueNumber = extrapolateIssueNumberFromText(
      firstCommentWhereIssueNumberShouldBe
    )

    const details = gh(_url)
    const repoOwner = details.owner
    const repoName = details.repo.split('/')[1]

    const issueBounty = await makeEthContractCall(_web3, 'getIssuePrice', [
      repoOwner,
      repoName,
      parseInt(this.issueNumber)
    ])
    const issueBountyInEth = _web3.utils.fromWei(
      _web3.utils.toBN(issueBounty),
      'ether'
    )

    this.pullRequestCreator = document.querySelector(
      '#partial-discussion-header > div.TableObject.gh-header-meta > div.TableObject-item.TableObject-item--primary > a'
    ).innerText

    if (issueBountyInEth > 0) {
      this.pullRequestCreatorAddress = await makeEthContractCall(
        _web3,
        'getPullRequestUsernameAddress',
        [
          repoOwner,
          repoName,
          parseInt(this.issueNumber),
          this.pullRequestCreator
        ]
      )

      document
        .querySelector(
          '#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-merging > div > div > div > div.merge-message'
        )
        .insertAdjacentHTML(
          'afterEnd',
          `
          <div style='
            margin-left: 15px;
            font-size: 14px;
            margin-bottom: 10px;
            background: rgb(255, 159, 64, 0.45);
            margin-right: 30%;
            padding: 5px 5px 5px 5px;
            font-weight: 600;
            line-height: 15px;
            border-radius: 5px;
            border: 3px solid rgb(255, 159, 64);'>
            You are paying ${issueBountyInEth} Eth for this Pull Request to ${this.pullRequestCreator} whose address is: ${this.pullRequestCreatorAddress}
          </div>
        `
        )
    }

    document
      .querySelector(
        '#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-merging > div > div > div > div.merge-message > div.select-menu.d-inline-block > div > button.btn-group-merge.border-right-0.rounded-left-1.btn.btn-primary.BtnGroup-item.js-details-target'
      )
      .addEventListener('click', async e => {
        await sleep(50)
        this.form = document.querySelector(
          '#partial-pull-merging > div.merge-pr.js-merge-pr.js-details-container.Details.is-merging.open.Details--on > form'
        )
        this.form.addEventListener('submit', _event => {
          this.handleSubmit(_event, _web3, _url)
        })
      })
  },

  async handleSubmit (_event, _web3, _url) {
    _event.preventDefault()
    _event.stopPropagation()

    const details = gh(_url)
    const repoOwner = details.owner
    const repoName = details.repo.split('/')[1]

    const pullRequestNumberHeader = document.querySelector(
      '#partial-discussion-header > div.gh-header-show > h1 > span.gh-header-number'
    )
    const pullRequestNumber = pullRequestNumberHeader.innerText.substr(1)

    // TODO: check if we must create a new PR

    try {
      const isPullRequestMerged = await makeEthContractSend(
        _web3,
        'acceptPullRequest',
        0,
        [
          repoOwner,
          repoName,
          this.issueNumber,
          pullRequestNumber,
          this.pullRequestCreatorAddress
        ]
      )
      if (!isPullRequestMerged) return
    } catch (err) {
      return
    }

    this.form.submit()
  }
}

export default MergePullRequest
