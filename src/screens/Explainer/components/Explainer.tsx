import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';

import checkMarkImage from '../images/checkMark.png';
import ethereumAddress from '../images/ethereumAddress.png';
import exclamationImage from '../images/exclamation.png';

import loc from '/loc';

type ExplainerProps = {
  image: JSX.Element | null;
  heading: string;
  body: string;
};
const Explainer = ({ image, heading, body }: ExplainerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>{image}</View>
      <View>
        <Label type="boldTitle1" style={styles.heading}>
          {heading}
        </Label>
        <View style={styles.bodyContainer}>
          <Label type="regularBody" color="light75" style={styles.label}>
            {body}
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
  <Explainer image={<Image source={checkMarkImage} />} heading={loc.tokenLists.help} body={loc.tokenLists.description} />
);
export const ExplainerWhitelistedKraken = () => (
  <Explainer image={<Image source={checkMarkImage} />} heading={loc.tokenLists.verifiedKraken} body={loc.tokenLists.verifiedInfoKraken} />
);
export const ExplainerBlacklisted = () => (
  <Explainer image={<Image source={exclamationImage} style={styles.image} />} heading={loc.tokenLists.likelySpamHelp} body={loc.tokenLists.likelySpamInfo} />
);
export const ExplainerEthereumAddress = () => (
  <Explainer
    image={<Image source={ethereumAddress} />}
    heading={loc.universalReceive.ethereumExplainerHeading}
    body={loc.universalReceive.ethereumExplainerBody}
  />
);
export const ExplainerEthereumDerivationPath = () => (
  <Explainer
    image={<Image source={ethereumAddress} />}
    heading={loc.advancedAccountInfo.ethereumDerivationPath}
    body={loc.advancedAccountInfo.ethereumDerivationPathContent}
  />
);
export const ExplainerDomainMatch = () => (
  <Explainer image={<Image source={checkMarkImage} />} heading={loc.onChainSecurity.domainMatch} body={loc.onChainSecurity.domainMatchInfo} />
);
export const ExplainerDomainMismatch = () => (
  <Explainer image={<Image source={exclamationImage} />} heading={loc.onChainSecurity.domainMismatch} body={loc.onChainSecurity.domainMismatchInfo} />
);
export const ExplainerKnownSecurityRisk = () => (
  <Explainer image={<Image source={exclamationImage} />} heading={loc.onChainSecurity.knownSecurityRisk} body={loc.onChainSecurity.knownSecurityRiskInfo} />
);
