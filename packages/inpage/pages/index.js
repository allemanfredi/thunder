import Web3 from 'web3'
import NewRepo from './new-repo'
import NewIssue from './new-issue'
import PullRequest from './pull-request'
import Issues from './issues'
import IssueDetails from './issue-details'
import { getCorrespondingPageFromGithubURL } from '@thunder/lib/gh-url-parser'

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
    const currentPage = getCorrespondingPageFromGithubURL(this.url)
    console.log(currentPage)

    if (
      currentPage === 'new-repo' ||
      currentPage === 'new-issue' ||
      currentPage === 'issues' ||
      currentPage === 'issue-details' ||
      currentPage === 'pull-request'
    ) {
      await this.initMetamask()
      await this.bindMetamaskAccount()
    }

    switch (currentPage) {
      case 'new-repo': {
        NewRepo.injectElements(this.web3, this.inpageRequester)
        break
      }
      case 'new-issue': {
        NewIssue.injectElements(this.web3, this.inpageRequester, this.url)
        break
      }
      case 'issues': {
        Issues.injectElements(this.web3, this.url)
        break
      }
      case 'issue-details': {
        IssueDetails.injectElements(this.web3, this.url)
        break
      }
      case 'pull-request': {
        PullRequest.injectElements(this.web3, this.url, this.inpageRequester)
        break
      }
      default: break;
    }
  }
}

export default Layouter
