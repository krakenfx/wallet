import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconWithCoinIcon } from '@/components/IconWithCoinIcon';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { Routes } from '@/Routes';
import { EXPLAINER_CONTENT_TYPES } from '@/screens/Explainer';
import { sanitizeUrl } from '@/utils/stringUtils';

import type { Verification } from '../types';

import loc from '/loc';

type Props = {
  icon?: string;
  name: string;
  url: string;
  verification?: Verification;
};

const getExplainerContentType = (verification?: Verification) => {
  if (verification?.warning?.severity === 'critical') {
    return EXPLAINER_CONTENT_TYPES.DOMAIN_MISMATCH;
  }

  if (verification?.isDomainMatch) {
    return EXPLAINER_CONTENT_TYPES.DOMAIN_MATCH;
  }
};

const Icon = ({ verification }: { verification?: Verification }) => {
  if (verification?.warning?.severity === 'critical') {
    return <SvgIcon name="warning-filled" color="red400" size={15} />;
  }

  if (verification?.isDomainMatch) {
    return <SvgIcon name="check-circle" color="green400" size={15} />;
  }

  return null;
};

export const Header = ({ url, icon, name, verification }: Props) => {
  const navigation = useNavigation();
  const shouldShowExplainer = verification?.isDomainMatch || verification?.warning?.severity === 'critical';
  const showExplainer = useCallback(() => {
    const contentType = getExplainerContentType(verification);

    if (contentType) {
      navigation.navigate(Routes.Explainer, { contentType });
    }
  }, [verification, navigation]);

  return (
    <View style={styles.header}>
      <IconWithCoinIcon coinSize={25} iconUri={icon} maskPositionXYNudge={4} maskShape="circle" size={64} />
      <Label style={styles.headerName} type="boldTitle1" numberOfLines={1}>
        {name}
      </Label>
      <Touchable style={styles.info} onPress={showExplainer} disabled={!shouldShowExplainer}>
        <Label type="regularCaption1" color="light75" style={styles.url} adjustsFontSizeToFit>
          {sanitizeUrl(url)}
        </Label>
        {shouldShowExplainer && <Icon verification={verification} />}
      </Touchable>
      <Label type="boldDisplay4" numberOfLines={1}>
        {loc.connectApp.connect_wallet}
      </Label>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 12,
    marginTop: 8,
  },
  headerName: {
    marginTop: 4,
    marginBottom: 4,
  },
  url: {
    lineHeight: 19.5,
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
});
