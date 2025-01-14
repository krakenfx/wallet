import type React from 'react';

import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/Label';
import { Menu } from '@/components/Menu';
import { SvgIcon } from '@/components/SvgIcon';

import { Touchable } from '@/components/Touchable';

import { RouteFeeDetails } from '../RouteFeeDetails';

import type { FeeDetails } from '../../types';
import type { MergeExclusive } from 'type-fest';

type RouteDetailsWithFee = {
  feeDetails?: FeeDetails;
  labelRight?: never;
};

type RouteDetailsWithNoFee = {
  iconRight?: React.ReactNode;
  alignIcon?: 'left' | 'right';
  labelRight?: string;
  feeDetails?: never;
};

export type RouteDetailsRowProps = {
  labelLeft?: string;
  tooltipText?: string;
  onLabelRightPress?: () => void;
} & MergeExclusive<RouteDetailsWithFee, RouteDetailsWithNoFee>;

export const RouteDetailsRow: React.FC<RouteDetailsRowProps> = ({ labelLeft, tooltipText, onLabelRightPress, alignIcon = 'left', ...props }) => {
  return (
    <View style={styles.container}>
      <Menu
        preferTop
        disabled={!tooltipText}
        menuYOffset={12}
        menuXOffset={-12}
        type="tooltip"
        tooltip={tooltipText ?? ''}
        tooltipProps={{ type: 'regularCaption1' }}>
        <View style={styles.left}>
          <Label color="light75" type="boldCaption1">
            {labelLeft}
          </Label>
          {!!tooltipText && <SvgIcon name="info-circle" size={16} color="light35" />}
        </View>
      </Menu>
      <Touchable disabled={!onLabelRightPress} onPress={onLabelRightPress} style={styles.right}>
        {props.feeDetails && <RouteFeeDetails feeDetails={props.feeDetails} />}
        {alignIcon === 'left' && props.iconRight}
        {props.labelRight && (
          <Label color="light75" type="boldCaption1">
            {props.labelRight}
          </Label>
        )}
        {alignIcon === 'right' && props.iconRight}
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  imageIcon: {
    width: 16,
    height: 16,
    backgroundColor: 'transparent',
  },
});
