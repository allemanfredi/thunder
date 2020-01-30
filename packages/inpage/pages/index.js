import Web3 from 'web3'
import NewRepo from './new-repo'
import NewIssue from './new-issue'
import PullRequest from './pull-request'
import Issues from './issues'
import IssueDetails from './issue-details'

const BASE_URL = 'https://github.com/'
const NEW_REPO = 'new'
const NEW_ISSUE = 'issues/new'
const ISSUES = 'issues'
const PULL_REQUEST = 'compare'
const ISSUE_DETAILS = 'issues/[0-9][0-9]*'

class Layouter {
  constructor(_url, _inpageRequester) {
    this.url = _url
    this.inpageRequester = _inpageRequester
  }

  async initMetamask() {
    if (window.ethereum) {
      this.web3 = new Web3(ethereum)
      try {
        await ethereum.enable()
      } catch (error) {
        console.log(error.message)
      }
    } else if (window.web3) {
      this.web3 = new Web3(web3.currentProvider)
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  async bindMetamaskAccount() {
    if (!this.web3) return

    const accounts = await this.web3.eth.getAccounts()
    this.currentAccount = accounts[0]
  }

  async injectElements() {
    if (!this.url.includes(BASE_URL)) {
      return
    }

    if (
      this.url.includes(NEW_REPO) ||
      this.url.includes(NEW_ISSUE) ||
      this.url.split('/')[this.url.split('/').length - 1] === ISSUES ||
      (this.url.split('/')[this.url.split('/').length - 1] === '' &&
        this.url.includes(ISSUES)) ||
      this.url.includes(PULL_REQUEST) ||
      this.url.match(ISSUE_DETAILS)
    ) {
      await this.initMetamask()
      await this.bindMetamaskAccount()
    }

    if (this.url.includes(NEW_ISSUE)) {
      NewIssue.injectElements(this.web3, this.inpageRequester, this.url)
    } else if (this.url.includes(NEW_REPO)) {
      NewRepo.injectElements(this.web3, this.inpageRequester)
    } else if (this.url.includes(PULL_REQUEST)) {
      PullRequest.injectElements(this.web3, this.url)
    } else if (
      this.url.split('/')[this.url.split('/').length - 1] === ISSUES ||
      (this.url.split('/')[this.url.split('/').length - 1] === '' &&
        this.url.includes(ISSUES))
    ) {
      Issues.injectElements(this.web3, this.url)
    } else if (this.url.match(ISSUE_DETAILS)) {
      IssueDetails.injectElements(this.web3, this.url)
    }
  }
}

export default Layouter
