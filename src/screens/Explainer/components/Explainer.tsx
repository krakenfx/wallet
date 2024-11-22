import type { PropsWithChildren } from 'react';

import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

/* eslint-disable-next-line import/no-unresolved */
import checkMarkImage from '@/screens/Explainer/images/checkMark.png';
import ethereumAddress from '@/screens/Explainer/images/ethereumAddress.png';
/* eslint-disable-next-line import/no-unresolved */

import loc from '/loc';

type ExplainerProps = {
  image: JSX.Element | null;
  heading: string;
};
const Explainer = ({ image, heading, children }: PropsWithChildren<ExplainerProps>) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>{image}</View>
      <View>
        <Label type="boldTitle1" style={styles.heading}>
          {heading}
        </Label>
        <View style={styles.bodyContainer}>
          <Label type="regularBody" color="light75" style={styles.label}>
            {children}
          </Label>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  bodyContainer: {
    marginTop: 4,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 175,
    height: 175,
  },
  heading: {
    textAlign: 'center',
    fontSize: 20,
  },
  label: {
    textAlign: 'center',
  },
});

export const ExplainerTokenLists = () => (
  <Explainer image={<Image source={checkMarkImage} />} heading={loc.tokenLists.help}>
    {loc.tokenLists.description}
  </Explainer>
);

export const ExplainerUnverifiedLists = () => (
  <Explainer image={<Image source={checkMarkImage} />} heading={loc.tokenLists.unverifiedButtonLink}>
    {loc.tokenLists.unverifiedExplainerDescription}
  </Explainer>
);

export const ExplainerWhitelistedKraken = () => (
  <Explainer image={<Image source={checkMarkImage} />} heading={loc.tokenLists.verifiedKraken}>
    {loc.tokenLists.verifiedInfoKraken}
  </Explainer>
);

export const ExplainerBlacklisted = () => (
  <Explainer image={<Image source={require('@/assets/images/common/exclamation.png')} style={styles.image} />} heading={loc.tokenLists.likelySpamHelp}>
    {loc.tokenLists.likelySpamInfo}
  </Explainer>
);

export const ExplainerBackupRecoverability = () => (
  <Explainer image={<Image source={require('@/assets/images/common/handCoin.png')} style={styles.image} />} heading={loc.walletBackupSelection.explainer.title}>
    {loc.walletBackupSelection.explainer.desc}
  </Explainer>
);

export const ExplainerTokenContract = () => (
  <Explainer
    image={<Image source={require('@/assets/images/common/exclamation.png')} style={styles.image} />}
    heading={loc.marketData.tokenContractWarning.header}>
    {loc.formatString(loc.marketData.tokenContractWarning.description, {
      boldDescription: (
        <Label type="regularBody" color="yellow600">
          {loc.marketData.tokenContractWarning.boldDescription}
        </Label>
      ),
    })}
  </Explainer>
);

export const ExplainerEthereumAddress = () => (
  <Explainer image={<Image source={ethereumAddress} />} heading={loc.universalReceive.ethereumExplainerHeading}>
    {loc.universalReceive.ethereumExplainerBody}
  </Explainer>
);

export const ExplainerEthereumDerivationPath = () => (
  <Explainer image={<Image source={ethereumAddress} />} heading={loc.advancedAccountInfo.ethereumDerivationPath}>
    {loc.advancedAccountInfo.ethereumDerivationPathContent}
  </Explainer>
);

export const ExplainerDomainMatch = () => (
  <Explainer image={<Image source={checkMarkImage} />} heading={loc.onChainSecurity.domainMatch}>
    {loc.onChainSecurity.domainMatchInfo}
  </Explainer>
);

export const ExplainerDomainMismatch = () => (
  <Explainer image={<Image source={require('@/assets/images/common/exclamation.png')} />} heading={loc.onChainSecurity.domainMismatch}>
    {loc.onChainSecurity.domainMismatchInfo}
  </Explainer>
);

export const ExplainerKnownSecurityRisk = () => (
  <Explainer image={<Image source={require('@/assets/images/common/exclamation.png')} />} heading={loc.onChainSecurity.knownSecurityRisk}>
    {loc.onChainSecurity.knownSecurityRiskInfo}
  </Explainer>
);
