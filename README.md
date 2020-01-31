<img src="./packages/popup/public/material/logo/thunder-128.png" width="80" height="80">

# thunder

thunder is a Google Chrome extension to pay and get paid to PR in Ethereum on Github


### Installing

```
git clone https://github.com/allemanfredi/thunder.git
```

```
cd thunder
```

```
yarn install
yarn bootstrap
```

```
yarn build
```

If you want to build only the popup:

```
yarn build:popup
```

if you want to build background, contentScript and lib

```
yarn build:core
```


After having built the application, it needs to be loaded on chrome.

## How to install Chrome extensions manually

* Go to chrome://extensions/ and check the box for Developer mode in the top right.
* Click the Load unpacked extension button and select the build folder for your extension to install it.

## TODO List:
* Handle repo deleted -> funds must be returned to the repo owner (keep track of all funds put by an owner mapping(owner -> uint))
* SC (newPullRequest): _creatorName can do only one PR in order to don't be hacked (2 address for a username) -> PR bounty goes to a wrong address -> attacker can't create a fake PR
* __Reputation__:
    * an owner can only be evaluated by an address that made the PR (if owner accept the PR, its reputation becomes `currentOnwerRepoReputation += (issueBounty * ownerRepoNumberOfPullRequestCorrectlyPayed) - (issueBounty * ownerRepoNumberOfPullRequestNotCorrectlyPayed`)
    * the creator of the PR can evaluate the repo owner after that the PR:
      - has been merged
      - it has not been merged but X time has passed since the time of creation (X must be defined by the repo ownwer during the issue initialization with a maximum limit equal to 1/2 months) (in case an owner copy paste the PR code without paying who made it)
    * every time an owner accepts the PR (therefore pays) the reputation of both him and the person who made the PR must be improved
    * an owner can receive a rating from 0 to 5 (understand how much it impacts on reputation)
    * if the person who makes the PR evaluates the owner who has successfully merged, the reputation of the person who made the PR is decreased
    * `currentOnwerRepoReputation += (issueBounty * ownerRepoNumberOfPullRequestCorrectlyPayed) - (issueBounty * ownerRepoNumberOfPullRequestNotCorrectlyPayed` => this encourages users to do well because the more bad they do the harder it will be to gain reputation
    * if a repoOwner does not close the issues in the established time or merges without communicating it to the smart contract => `currentOnwerRepoReputation -= issueBounty * (ownerRepoNumberOfPullRequestNotCorrectlyPayed + 1)`
    * __BIGGEST PROBLEMS__:
      - repoOwner merge with extension off => can be solved by using an oracle for calling Github API in order to check if the PR has been merged
      - repoOwner can visualize the PR commits, copy the code and reject the PR => i still don't know how to solve it, maybe user can evaluate the repoOwner badly without getting back Ethers. Probabilistically speaking, users with good reputation will not do this kind of thing but it's possible.

