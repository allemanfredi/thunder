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
    * an owner can only be evaluated by an address that made the PR
    * the creator of the PR can evaluate the repo owner after that the PR:
      - has been merged
      - it has not been merged but X time has passed since the time of creation (X to be defined) (in case an owner copy paste the PR code without paying who made it)
    * every time an owner accepts the PR (therefore pays) the reputation of both him and the person who made the PR must be improved
    * an owner can receive a rating from 0 to 5 (understand how much it impacts on reputation)
    * if the person who makes the PR evaluates the owner who has successfully merged, the reputation of the person who made the PR is decreased