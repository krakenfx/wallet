
<img src="https://github.com/krakenfx/wallet/assets/166629618/98098729-bd9c-4399-8290-bce491149595" width="100%">


# Kraken Wallet

Kraken Wallet is a Crypto and Bitcoin self-custody wallet where your keys never leave your device. Engineered and crafted by the mighty and OG Kraken.com. It is built with React Native, Realm, an Electrum Server, and other FOSS projects. The backend runs over a proxy to ensure your personal data is never shared with 3rd party services or companies. It is built under strong principles of privacy, self-custody, and security to ensure maximum sovereignty for its users. It is open sourced under the MIT license.

This repo functions as a mirror of the main private development repo. Its main purpose is to provide auditability, trust minimization, and code review. Please provide feedback, vulnerabilities or bug reporting using the responsible disclosure process. 

## Main features

* Multi-chain support (Bitcoin, Ethereum, Polygon, Arbitrum, Optimism, Base, Solana, and Dogecoin)
* View and manage your Assets
* View and manage your NFTs
* View your DeFi Deposits
* WalletConnect support
* Single Seed for Multiple Wallets
* Import Wallets ([BIP39 standard](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki))
* Push Notifications for Android and iOS
* Data encryption using password and/or biometrics
* Multi-language support

## Official Channels

* [Website](https://kraken.com/wallet) 
* [Support and Documentation](https://support.kraken.com/hc/en-us/categories/Kraken-Wallet) 
* [Apple App Store](https://apps.apple.com/app/kraken-wallet/id1626327149) 
* [Google Play Store](https://play.google.com/store/apps/details?id=com.kraken.superwallet) 

## License

Kraken Wallet's source code is released under the terms of the MIT license.

## Security Audit

Trail of Bits - [[link]](https://github.com/krakenfx/wallet/files/14999557/Kraken.-.Mobile.Wallet.-.Comprehensive.Report_v1.1.pdf)


## Security Model

* [Security architecture blog post](https://blog.kraken.com/product/kraken-wallet/kraken-wallet-security) 

## Responsible Disclosure

All bug and vulnerability disclosures must go through the properly defined channels.

* Contact: [bugbounty@kraken.com](mailto:bugbounty@kraken.com)
* Review the [bug bounty policy](https://www.kraken.com/features/security/bug-bounty) first before submitting your findings.

## Contributing

We welcome contributions from the community. Here are a few guidelines to help you get started:

### Security-Related Bugs and Disclosures

For any security-related issues, please refer to our [Responsible Disclosure policy](https://www.kraken.com/features/security/bug-bounty). It's crucial that these matters are handled sensitively to protect all users.

### Feature Requests

If you're interested in suggesting a new feature, please submit a detailed issue on Github. Include the purpose of the feature, its potential impact, and any ideas you have for how it might be implemented. This will help us understand and evaluate your proposal more effectively.

### Pull Requests

Please note that our repository is a point-in-time mirror of our internal repository, which means we cannot directly merge pull requests. However, every pull request is valuable and will be reviewed by our team. Contributions considered suitable will be manually integrated into our internal repo and reflected in future releases.

### Upcoming Improvements

We are currently working on providing developer documentation that is necessary for quality PRs. We expect to roll out these resources soon and will keep the community updated on our progress.


## Build Instructions

This guide will walk you through setting up your development environment and building the app for both Android and iOS.

### Prerequisites

Before you begin, make sure you have the following tools and software installed:

- Node (>= 18)
- Ruby (>= 2.6.10)
- Yarn
- Android Studio (for Android development)
- Xcode 15 (for iOS development)

For detailed instructions on setting up the environment, refer to the [React Native documentation](https://reactnative.dev/docs/set-up-your-environment).

### Setup

#### Environment Configuration

Create a `.env` file in the root directory of your project and populate it with the following data:

```plaintext
DEFAULT_HARMONY_BASE_URI=https://wallet.kraken.com/api/data
DEFAULT_GROUNDCONTROL_BASE_URI=https://wallet.kraken.com/api/push
WALLETCONNECT_PROJECT_ID=${PROJECT_ID}
```
A WalletConnect project ID is required for full functionality. For instructions on how to obtain it, refer to the WalletConnect [documentation](https://docs.walletconnect.com/).

### Android

#### Generate a Debug Keystore

Open a terminal and run the following command to generate a debug keystore

```sh
keytool -genkey -v -keystore android/app/debug.keystore -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 -storepass android -keypass android
```

#### Build the Android app

```sh
yarn && yarn android
```

### iOS

#### Configure Xcode Project

- Open the `ios/.xcworkspace` file in Xcode.
- Select the target and go to the _Signing & Capabilities_ tab
- Select your team and create a provisioning profile. If you need help, refer to the [Apple Developer documentation](https://developer.apple.com/help/account/manage-profiles/create-a-development-provisioning-profile/).



#### Build the iOS app

```sh
sudo gem install bundler
yarn && yarn ios
```

### Push Notifications

Please be aware that push notifications are not currently supported in the open-source version of this app.
