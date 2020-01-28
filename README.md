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