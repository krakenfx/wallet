import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import type { InputMethods } from '@/components/Input';
import { Input } from '@/components/Input';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useKeyboardEvent } from '@/hooks/useKeyboardEvent';
import { useAppCurrency } from '@/realm/settings';
import { useTokenPrice } from '@/realm/tokenPrice';
import { type RealmToken, getAvailableTokenBalance } from '@/realm/tokens';
import { useTheme } from '@/theme/themes';

import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { safelyAnimateLayout } from '@/utils/safeLayoutAnimation';
import { sanitizeNumericValue } from '@/utils/sanitizeNumericValue';
import { unitConverter } from '@/utils/unitConverter';

import { adaptTokenToRemoteAsset } from '../../utils/adaptTokenToRemoteAsset';
import { SwapAssetSelector } from '../SwapAssetSelector';
import { useSwapContext } from '../SwapContext';

import loc from '/loc';

type Props = {
  token: RealmToken;
  isLoading?: boolean;
  onChange: () => void;
};

export type SourceAssetBlockRef = {
  focusInput: () => void;
};

export const SourceAssetBlock = React.forwardRef<SourceAssetBlockRef, Props>(({ token, onChange, isLoading }, ref) => {
  const {
    sourceAmountState: [sourceAmount, setSourceAmount],
    sourceAmountInputValueState: [sourceAmountString, setSourceAmountString],
    amountInputFocusState: [isFocused, setIsFocused],
    amountInputErrorState: [inputErrorMsg, setInputErrorMsg],
    amountInputValidState: [_, setAmountInputValid],
  } = useSwapContext();

  const inputRef = useRef<InputMethods>(null);

  useImperativeHandle(
    ref,
    () => ({
      focusInput: () => inputRef.current?.focus(),
    }),
    [inputRef],
  );

  const { colors } = useTheme();

  const { currency, currencyInfo } = useAppCurrency();

  const tokenBalance = getAvailableTokenBalance(token);
  const tokenAmount = unitConverter.smallUnit2TokenUnit(tokenBalance, token.metadata.decimals).toString(10);
  const tokenAmountFormatted = useBalanceDisplay(
    formatTokenAmount(tokenAmount, { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId: token.assetId }) }),
    7,
  );
  const balanceDisplay = useBalanceDisplay(loc.swap.balance);

  const price = useTokenPrice({ assetId: token.assetId }) ?? 0;

  const footerLeft =
    !!sourceAmountString && !isNaN(Number(sourceAmountString))
      ? formatCurrency(unitConverter.tokenUnit2Fiat(sourceAmountString, price).toString(10), { currency })
      : undefined;

  const footerRight = loc.formatString(balanceDisplay, `${tokenAmountFormatted} ${token.metadata.symbol}`);

  const inputValue = sourceAmountString?.replace('.', currencyInfo.decimalSeparator);

  const onChangeText = useCallback(
    (value: string) => {
      const numberString = sanitizeNumericValue(value);
      if (!numberString) {
        setSourceAmount(undefined);
        setSourceAmountString(undefined);
      } else {
        setSourceAmountString(numberString);
        setSourceAmount(unitConverter.tokenUnit2SmallestUnit(new BigNumber(numberString), token.metadata.decimals).toString(10));
      }
    },
    [setSourceAmount, setSourceAmountString, token.metadata.decimals],
  );

  useKeyboardEvent('keyboardDidHide', () => inputRef.current?.blur());

  useEffect(() => {
    if (!sourceAmount) {
      setAmountInputValid(false);
      return;
    }
    if (isFocused) {
      setInputErrorMsg(undefined);
      setAmountInputValid(undefined);
      return;
    }

    if (BigNumber(sourceAmount).isLessThanOrEqualTo(0)) {
      setAmountInputValid(false);
    } else if (BigNumber(sourceAmount).isGreaterThan(BigNumber(tokenBalance))) {
      setAmountInputValid(false);
      setInputErrorMsg(loc.swap.amountExceedingBalance);
    } else {
      setAmountInputValid(true);
    }
  }, [isFocused, sourceAmount, tokenBalance, inputErrorMsg, setInputErrorMsg, setAmountInputValid, setSourceAmountString, setSourceAmount]);

  useLayoutEffect(() => {
    safelyAnimateLayout();
  }, [inputErrorMsg]);

  return (
    <View style={styles.container}>
      <GradientItemBackground backgroundType="modal" key={inputErrorMsg} />
      <Input
        editable={!isLoading}
        ref={inputRef}
        value={inputValue}
        onChangeText={onChangeText}
        placeholderType="boldBody"
        type="boldDisplay5"
        placeholder={loc.swap.amountPlaceholder}
        backgroundColor="transparent"
        borderColorOnFocus="kraken"
        right={<SwapAssetSelector wallet={token.wallet} asset={adaptTokenToRemoteAsset(token)} onPress={onChange} />}
        footerLeft={footerLeft}
        footerRight={footerRight}
        footerRightProps={{
          type: 'mediumCaption1',
        }}
        footerLeftProps={{
          type: 'mediumCaption1',
          color: 'light50',
        }}
        placeholderTextColor={colors.light50}
        onSubmitEditing={Keyboard.dismiss}
        keyboardType="numeric"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        errorText={inputErrorMsg}
        errorInside
        hideDoneAccessoryView
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 4,
  },
});
