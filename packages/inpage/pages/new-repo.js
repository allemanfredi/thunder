import { makeEthContractSend } from '@thunder/lib/eth'

const NewRepo = {
  form: null,

  async injectElements(_web3) {
    document
      .querySelector('#new_repository > div.owner-reponame.clearfix')
      .insertAdjacentHTML(
        'afterend',
        `
        <div class="form-checkbox unchecked mt-4 mb-3">
        <label>
          <input type="hidden">
          <input class="js-repository-readme-choice" type="checkbox" id="bind-to-bounty">
          Initialize this repository with Bounties option
        </label>
        <span class="note">
          Using a Smart Contract and MetaMask it is possible to offer bounties to those who collaborate on the project.
        </span>
      </div>
      `
      )

    this.form = document.querySelector('#new_repository')
    this.form.addEventListener('submit', event => {
      this.handleSubmit(event, _web3)
    })
  },

  async handleSubmit(_event, _web3) {
    _event.preventDefault()

    if (document.querySelector('#bind-to-bounty').checked) {
      const repoOwner = document
        .querySelector('#repository-owner')
        .innerText.replace(/\s/g, '')
      const repoName = document
        .querySelector('#repository_name')
        .value.replace(/\s/g, '')

      console.log(
        `Repository created with bounty option = true, repoOnwer: ${repoOwner} and repoName: ${repoName}`
      )

      try {
        const res = await makeEthContractSend(_web3, 'newRepo', 0, [
          repoOwner,
          repoName
        ])
        if (res) this.form.submit()
      } catch (err) {
        //TODO cancel event
      }
    } else {
      this.form.submit()
    }
  }
}

export default NewRepo
