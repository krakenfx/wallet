import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { GradientItemBackground } from '@/components/GradientItemBackground';
import type { InputMethods } from '@/components/Input';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useDebounceEffect } from '@/hooks/useDebounceEffect';
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

import { AMOUNT_TYPING_DEBOUNCE_DELAY } from '../../SwapScreen.constants';
import { adaptTokenToRemoteAsset } from '../../utils/adaptTokenToRemoteAsset';
import { SwapAssetSelector } from '../SwapAssetSelector';
import { useSwapContext } from '../SwapContext';

import loc from '/loc';

type Props = {
  token: RealmToken;
  onChange: () => void;
  errorMsg?: string;
};

export type SourceAssetBlockRef = {
  focusInput: () => void;
};

export const SourceAssetBlock = React.forwardRef<SourceAssetBlockRef, Props>(({ token, onChange, errorMsg }, ref) => {
  const {
    sourceAmountTokenUnitState: [amountTokenValue],
    sourceAmountSmallestUnitState: [amountSmallestUnitValue],
    sourceAmountFiatState: [amountFiatValue],
    amountInputFocusState: [_, setIsFocused],
    amountInputErrorState: [inputErrorMsg, setInputErrorMsg],
    amountInputValidState: [__, setAmountInputValid],
    amountInputTypingState: [isTyping, setIsTyping],
    loadingState: [isLoading],
    fiatAmountToggle,
    updateAmount,
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
  const tokenBalanceAmount = unitConverter.smallUnit2TokenUnit(tokenBalance, token.metadata.decimals).toString(10);
  const tokenBalanceAmountFormatted = useBalanceDisplay(
    formatTokenAmount(tokenBalanceAmount, { compact: true, currency, highPrecision: true, isBtc: isBtc({ assetId: token.assetId }) }),
    7,
  );
  const balanceDisplay = useBalanceDisplay(loc.swap.balance);

  const fiatTotalBalance = useTokenBalanceConvertedToAppCurrency(token);

  const price = useTokenPrice({ assetId: token.assetId }) ?? 0;

  const fiatAmountFormatted = price ? formatCurrency(amountFiatValue, { currency }) : undefined;
  const tokenAmountFormatted = `${formatTokenAmount(amountTokenValue ?? '0', {
    compact: true,
    currency,
    highPrecision: true,
    isBtc: isBtc({ assetId: token.assetId }),
  })} ${token.metadata.symbol}`;

  const { toggleInputFiatCurrency, styles: toggleStyles, inputInFiatCurrency } = fiatAmountToggle;
  const footerLeftValue = inputInFiatCurrency ? tokenAmountFormatted : fiatAmountFormatted;

  const footerLeft = footerLeftValue ? (
    <Touchable disabled={!price || isLoading} onPress={toggleInputFiatCurrency} style={styles.amountToggle}>
      <Label style={[toggleStyles.opacity, toggleStyles.moveUp]} type="mediumCaption1" color="light50">
        {footerLeftValue}
      </Label>
      <SvgIcon name="swap" size={16} color="light50" style={toggleStyles.opacity} />
    </Touchable>
  ) : (
    <View />
  );

  const footerRight = loc.formatString(
    balanceDisplay,
    inputInFiatCurrency && fiatTotalBalance ? formatCurrency(fiatTotalBalance, { currency }) : `${tokenBalanceAmountFormatted} ${token.metadata.symbol}`,
  );

  const inputValue = (inputInFiatCurrency ? amountFiatValue : amountTokenValue)?.replace('.', currencyInfo.decimalSeparator);

  const onChangeText = useCallback(
    (value: string) => {
      setIsTyping(true);
      updateAmount(sanitizeNumericValue(value) || undefined, inputInFiatCurrency ? 'fiat' : 'tokenUnit');
    },
    [inputInFiatCurrency, setIsTyping, updateAmount],
  );

  useKeyboardEvent('keyboardDidHide', () => inputRef.current?.blur());

  useDebounceEffect(() => setIsTyping(false), [amountTokenValue], AMOUNT_TYPING_DEBOUNCE_DELAY);

  useEffect(() => {
    if (!amountSmallestUnitValue) {
      setAmountInputValid(false);
      setInputErrorMsg(undefined);
      return;
    }
    if (BigNumber(amountSmallestUnitValue).isLessThanOrEqualTo(0)) {
      setAmountInputValid(false);
    } else if (BigNumber(amountSmallestUnitValue).isGreaterThan(BigNumber(tokenBalance))) {
      setAmountInputValid(false);
      setInputErrorMsg(loc.swap.amountExceedingBalance);
    } else {
      setAmountInputValid(true);
      setInputErrorMsg(undefined);
    }
  }, [amountSmallestUnitValue, amountTokenValue, isTyping, setAmountInputValid, setInputErrorMsg, tokenBalance]);

  useLayoutEffect(() => {
    safelyAnimateLayout();
  }, [inputErrorMsg]);

  const inputErrorValue = inputErrorMsg || errorMsg;

  return (
    <View style={styles.container}>
      <GradientItemBackground backgroundType="modal" key={inputErrorValue} />
      <Input
        ref={inputRef}
        value={inputValue}
        onChangeText={onChangeText}
        placeholderType="boldBody"
        placeholderStyle={[toggleStyles.opacity, toggleStyles.moveDown]}
        type="boldDisplay5"
        placeholder={loc.formatString(loc.swap.amountPlaceholder, { symbol: inputInFiatCurrency ? currency : token.metadata.symbol }).toString()}
        backgroundColor="transparent"
        borderColorOnFocus={inputErrorValue ? 'red400' : 'kraken'}
        right={<SwapAssetSelector wallet={token.wallet} asset={adaptTokenToRemoteAsset(token)} onPress={onChange} />}
        footerLeft={footerLeft}
        footerRight={footerRight}
        footerRightProps={{
          type: 'mediumCaption1',
          style: toggleStyles.opacity,
        }}
        left={
          <Label style={[toggleStyles.opacity, toggleStyles.moveDown]} type="boldDisplay5">
            {inputInFiatCurrency && inputValue ? currencyInfo.sign : undefined}
          </Label>
        }
        placeholderTextColor={colors.light50}
        onSubmitEditing={Keyboard.dismiss}
        keyboardType="numeric"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        inputStyle={[toggleStyles.opacity, toggleStyles.moveDown]}
        errorText={inputErrorValue}
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
  amountToggle: {
    flexDirection: 'row',
    maxWidth: '50%',
    marginRight: 8,
    alignItems: 'center',
  },
});
