import { extrapolateIssueNumberFromText } from '@thunder/lib/utils'
import { makeEthContractSend, makeEthContractCall } from '@thunder/lib/eth'
import gh from 'parse-github-url'

const pricesColor = {
  low: 'rgb(255, 205, 86)',
  normal: 'rgb(54, 162, 235)',
  high: 'rgb(255, 159, 64)'
}

const Profile = {
  form: null,

  async injectElements(_web3, _url) {
    document
      .querySelector(
        '#js-pjax-container > div > div.h-card.col-lg-3.col-md-4.col-12.float-md-left.pr-md-3.pr-xl-6 > div.clearfix.mb-2 > div.float-left.col-9.col-md-12.pl-2.pl-md-0 > div.vcard-names-container.pt-1.pt-md-3.pb-1.pb-md-3.js-sticky.js-user-profile-sticky-fields > h1'
      )
      .insertAdjacentHTML(
        'afterend',
        `
      <hr/>
      <span style="
      background: rgb(255, 159, 64, 0.45);
      padding: 7px;
      border: 3px solid rgb(255, 159, 64);
      border-radius: 5px;
      font-weight: 600;">
        Reputation: 0
      </span>
      <hr/>
    `
      )
  }
}

export default Profile
