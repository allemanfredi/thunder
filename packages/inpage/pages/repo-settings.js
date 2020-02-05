import gh from 'parse-github-url'
import { makeEthContractCall, makeEthContractSend } from '@thunder/lib/eth'

const RepoSettings = {
  form: null,

  async injectElements(_web3, _url) {
    const details = gh(_url)
    this.repoOwner = details.owner
    this.repoName = details.repo.split('/')[1]

    this.hasBountyOption = await makeEthContractCall(
      _web3,
      'hasRepoBountyOption',
      [this.repoOwner, this.repoName]
    )

    document
      .querySelector(
        '#options_bucket > form:nth-child(7) > ul > li:nth-child(1)'
      )
      .insertAdjacentHTML(
        'beforebegin',
        `
        <li class="Box-row py-0">
          <div class="form-checkbox js-repo-option">
          <input type="hidden" name="bounty_option">
          <input type="checkbox" name="bounty_option" value="1" id="bounty-option" ${
            this.hasBountyOption ? 'checked disabled' : ''
          }>
            <label for="bounty-option">Bounties</label>
            <span class="status-indicator ml-1 js-status-indicator" style="display:none" id="bounty-status-indicator">
              <svg class="octicon octicon-check" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
              <svg class="octicon octicon-x" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg>
            </span>
            <p class="note">Thanks to bounties, it will be possible to offer rewards to developers who contribute to the project</p>
        </div>
        </li>`
      )

    this.form = document.querySelector('#options_bucket > form:nth-child(7)')
    this.form.addEventListener('submit', event => {
      this.handleSubmit(event, _web3, _url)
    })
  },

  async handleSubmit(_event, _web3, _url) {
    _event.preventDefault()

    const checkbox = document.querySelector('#bounty-option')
    if (checkbox.checked && !this.hasBountyOption) {
      try {
        await makeEthContractSend(_web3, 'newRepo', 0, [
          this.repoOwner,
          this.repoName
        ])
        document.querySelector('#bounty-status-indicator').style.display = null
        this.hasBountyOption = true
        checkbox.disabled = true
      } catch (err) {
        //TODO
      }
    }
  }
}

export default RepoSettings
