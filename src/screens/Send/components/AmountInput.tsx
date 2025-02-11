import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Alert, Keyboard, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { CurvedTransition } from 'react-native-reanimated';

import type { KrakenAssetSupported } from '@/api/krakenConnect/types';
import { Button } from '@/components/Button';
import { Input, type InputMethods } from '@/components/Input';
import { Label } from '@/components/Label';
import { SvgIcon } from '@/components/SvgIcon';
import { Touchable } from '@/components/Touchable';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { useFiatAmountToggle } from '@/hooks/useFiatAmountToggle';
import type { Network } from '@/onChain/wallets/base';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTokenPrice } from '@/realm/tokenPrice';
import type { RealmToken } from '@/realm/tokens';
import { getAvailableTokenBalance, useTokenByAssetId } from '@/realm/tokens';
import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { isKrakenExchangeAsset } from '@/utils/isKrakenExchangeAsset';
import { isRealmToken } from '@/utils/isRealmToken';
import { sanitizeNumericValue } from '@/utils/sanitizeNumericValue';
import { unitConverter } from '@/utils/unitConverter';

import { useFormField } from '../utils/sendForm';

import loc from '/loc';

export type Props = {
  token: RealmToken | KrakenAssetSupported;
  onChangeText?: (value: string) => void;
  network: Network;
  currentFeeEstimate?: string;
  onToggleCurrency?: (inputInFiatCurrency: boolean) => void;
  inputStyle?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
};

export interface AmountInputRef {
  setAssetAmount: (text: string) => void;
  getAssetAmount: () => { amount: string; isMax: boolean };
  getFiatAmount: () => string;
  showFeeError: () => void;
  focus: () => void;
}

export const AmountInput = React.forwardRef<AmountInputRef, Props>(
  ({ token, network, currentFeeEstimate, onToggleCurrency, inputStyle = {}, autoFocus = true }, ref) => {
    const [assetAmount, setAssetAmount] = useState('');
    const [fiatAmount, setFiatAmount] = useState('');
    const { colors } = useTheme();
    const [errorMessage, setErrorMessage] = useState('');
    const [isMaxAmount, setIsMaxAmount] = useState(false);
    const [shouldValidate, setShouldValidate] = useState(false);
    const { currency, currencyInfo } = useAppCurrency();
    const { inputInFiatCurrency, toggleInputFiatCurrency, styles: toggleStyles } = useFiatAmountToggle(onToggleCurrency);
    const getFiatAmount = useCallback(() => fiatAmount, [fiatAmount]);
    const exchangeRate = useTokenPrice({ assetId: token.assetId }) ?? 0;
    const inputRef = useRef<InputMethods>(null);

    const isAssetFromKrakenConnect = isKrakenExchangeAsset(token);
    const nativeTokenCaipId = isRealmToken(token) ? token.wallet.nativeTokenCaipId : token.assetId;

    let feeToken: RealmToken | KrakenAssetSupported = useTokenByAssetId(nativeTokenCaipId, token.walletId);
    feeToken = isAssetFromKrakenConnect ? token : feeToken;

    const isNativeToken = token.assetId === feeToken.assetId;

    const amounts = useMemo(() => {
      let feeAmount = new BigNumber(0);
      let feeTokenBalanceAmount = new BigNumber(0);
      feeAmount = unitConverter.smallUnit2TokenUnit(currentFeeEstimate ?? 0, feeToken.metadata.decimals);
      feeTokenBalanceAmount = unitConverter.smallUnit2TokenUnit(new BigNumber(feeToken.balance), feeToken.metadata.decimals);

      const balance = isAssetFromKrakenConnect ? new BigNumber(token.balance).minus(token.hold_trade).toString(10) : token.balance;

      const balanceAmount = unitConverter.smallUnit2TokenUnit(new BigNumber(getAvailableTokenBalance({ ...token, balance })), token.metadata.decimals);
      const availableAssetAmount = isNativeToken ? balanceAmount.minus(feeAmount) : balanceAmount;
      const availableAssetAmountFormatted = formatTokenAmount(availableAssetAmount.toString(10), {
        currency,
        highPrecision: true,
        isBtc: isBtc({ assetId: token.assetId }),
      });
      const balanceAmountFormatted = formatTokenAmount(balanceAmount.toString(10), { currency, highPrecision: true, isBtc: isBtc({ assetId: token.assetId }) });
      return {
        feeAmount,
        feeTokenBalanceAmount,
        balanceAmount,
        balanceAmountFormatted,
        availableAssetAmount,
        availableAssetAmountFormatted,
      };
    }, [isAssetFromKrakenConnect, token, currentFeeEstimate, feeToken, isNativeToken, currency]);

    const formField = useFormField('amount');

    const updateFiatAmount = useCallback(
      (newAssetAmount: string) => {
        if (exchangeRate <= 0) {
          return;
        }
        if (!newAssetAmount) {
          setFiatAmount('');
          return;
        }
        setFiatAmount(new BigNumber(newAssetAmount).multipliedBy(exchangeRate).toFixed(2));
      },
      [exchangeRate],
    );

    const updateAssetAmount = useCallback(
      (newFiatAmount: string) => {
        if (exchangeRate <= 0) {
          return;
        }
        if (!newFiatAmount) {
          setAssetAmount('');
          return;
        }
        setAssetAmount(new BigNumber(newFiatAmount).dividedBy(exchangeRate).toFixed(token.metadata.decimals));
      },
      [exchangeRate, token],
    );

    const showFeeError = useCallback(() => {
      setErrorMessage(loc.formatString(loc.send.exceedsFee, { token: feeToken.metadata.symbol }).toString());
      formField.setInvalid();
    }, [feeToken.metadata.symbol, formField]);

    useImperativeHandle(
      ref,
      () => ({
        setAssetAmount: newAssetAmount => {
          setAssetAmount(newAssetAmount);
          updateFiatAmount(newAssetAmount);
          setShouldValidate(true);
        },
        getAssetAmount: () => ({
          amount: assetAmount,
          isMax: isMaxAmount,
        }),
        showFeeError,
        getFiatAmount,
        focus: () => inputRef.current?.focus(),
      }),
      [assetAmount, getFiatAmount, isMaxAmount, showFeeError, updateFiatAmount],
    );
    const inputValue = (inputInFiatCurrency ? fiatAmount : assetAmount).replace('.', currencyInfo.decimalSeparator);

    const onChangeAmount = useCallback(
      (changedValue: string) => {
        setIsMaxAmount(false);
        const newAmount = sanitizeNumericValue(changedValue);
        if (inputInFiatCurrency) {
          setFiatAmount(newAmount);
          updateAssetAmount(newAmount);
        } else {
          setAssetAmount(newAmount);
          updateFiatAmount(newAmount);
        }
      },
      [inputInFiatCurrency, updateAssetAmount, updateFiatAmount],
    );

    const handleMaxButtonPress = () => {
      setIsMaxAmount(true);
      clearErrors();
      setShouldValidate(true);
    };

    const clearErrors = () => {
      setErrorMessage('');
      formField.clear();
    };

    const verifyBalance = useCallback(() => {
      setShouldValidate(false);
      if (!assetAmount) {
        formField.clear();
        return;
      }
      const amount = new BigNumber(assetAmount);
      const { balanceAmount, feeAmount, availableAssetAmount, feeTokenBalanceAmount } = amounts;

      if (isMaxAmount) {
        if (feeTokenBalanceAmount.isLessThan(feeAmount)) {
          setErrorMessage(loc.formatString(loc.send.exceedsFee, { token: feeToken.metadata.symbol }).toString());
          formField.setInvalid();
        } else {
          formField.setValid();
        }
      } else if (amount.isGreaterThan(balanceAmount)) {
        setErrorMessage(loc.send.exceedsBalance);
        formField.setInvalid();
      } else if (isNativeToken ? amount.isGreaterThan(availableAssetAmount) : feeAmount.isGreaterThan(feeTokenBalanceAmount)) {
        setErrorMessage(loc.formatString(loc.send.exceedsFee, { token: feeToken.metadata.symbol }).toString());
        formField.setInvalid();
      } else if (!amount.isZero()) {
        formField.setValid();
      }
      if (inputInFiatCurrency) {
        setFiatAmount(Number(fiatAmount).toFixed(2));
      }
    }, [amounts, assetAmount, feeToken.metadata.symbol, fiatAmount, formField, inputInFiatCurrency, isMaxAmount, isNativeToken]);

    useEffect(() => {
      if (isMaxAmount) {
        const hasAvailableBalance = amounts.availableAssetAmount.isPositive();
        const newAmount = hasAvailableBalance ? amounts.availableAssetAmount.toFixed() : '0';
        setAssetAmount(newAmount);
        updateFiatAmount(newAmount);
        setShouldValidate(true);
      }
    }, [formField, isMaxAmount, amounts.availableAssetAmount, updateFiatAmount, verifyBalance]);

    useEffect(() => {
      verifyBalance();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFeeEstimate]);

    useEffect(() => {
      if (shouldValidate) {
        verifyBalance();
      }
    }, [shouldValidate, verifyBalance]);

    const footerLeftValue = exchangeRate
      ? `${
          inputInFiatCurrency
            ? formatTokenAmount(unitConverter.smallUnit2TokenUnit(assetAmount ?? 0, 0).toString(10), {
                currency,
                highPrecision: true,
                isBtc: isBtc({ assetId: token.assetId }),
                compact: true,
              })
            : formatCurrency(fiatAmount ?? 0, { currency })
        } ${inputInFiatCurrency ? token.metadata.symbol : ''}`
      : undefined;

    const fiatTotalBalance = useTokenBalanceConvertedToAppCurrency({ ...token, balance: amounts.balanceAmount.toString(10), metadata: { decimals: 0 } });
    const balanceValue =
      inputInFiatCurrency && fiatTotalBalance !== undefined
        ? formatCurrency(fiatTotalBalance, { currency })
        : `${amounts.balanceAmountFormatted} ${token.metadata.symbol}`;
    const balanceValueFormatted = useBalanceDisplay(balanceValue);
    const balanceDisplay = useBalanceDisplay(isAssetFromKrakenConnect ? loc.send.available : loc.send.balance);

    const footerRight = loc.formatString(
      balanceDisplay,
      <Label type="mediumBody" color={errorMessage ? 'red400' : 'light50'}>
        {balanceValueFormatted}
      </Label>,
    );

    const handleDisabledToggle = () => {
      Alert.alert(loc.formatString(loc.send.failedPriceAlert.title, { token: token.metadata.symbol }).toString(), loc.send.failedPriceAlert.desc, [
        {
          text: loc._.ok,
          style: 'default',
        },
      ]);
    };
    const tokenSymbol = token ? token.metadata.symbol : network.nativeTokenSymbol || '';
    const showToggleCurrency = tokenSymbol !== currency;

    const footerLeft = footerLeftValue ? (
      <Touchable
        disabled={!exchangeRate || !showToggleCurrency}
        onPress={!exchangeRate ? handleDisabledToggle : toggleInputFiatCurrency}
        testID="AmountToggle"
        style={styles.amountToggle}>
        <Label style={[toggleStyles.opacity, toggleStyles.moveUp]} type="regularBody" color="light50">
          {footerLeftValue}
        </Label>
        {showToggleCurrency && <SvgIcon name="swap" size={16} color="light50" style={toggleStyles.opacity} />}
      </Touchable>
    ) : (
      <View />
    );

    const placeholder = loc.formatString(loc.send.enterAmount, { symbol: inputInFiatCurrency ? currency : tokenSymbol }).toString();

    return (
      <Animated.View layout={CurvedTransition}>
        {!isAssetFromKrakenConnect && (
          <View style={styles.sectionHeader}>
            <Label type="boldTitle2">{loc.send.amountHeader}</Label>
          </View>
        )}
        <View>
          <Input
            ref={inputRef}
            testID="AmountInput"
            inputTestID="AmountNativeInput"
            autoFocus={autoFocus}
            onFocus={clearErrors}
            errorText={errorMessage}
            onBlur={verifyBalance}
            blurOnSubmit={false}
            left={
              <Label style={[toggleStyles.opacity, toggleStyles.moveDown]} type="boldDisplay4">
                {inputInFiatCurrency && inputValue ? currencyInfo.sign : undefined}
              </Label>
            }
            containerStyle={[styles.inputContainer, inputStyle]}
            maxLength={20}
            onChangeText={onChangeAmount}
            value={inputValue}
            placeholder={placeholder}
            placeholderTextColor={colors.light50}
            placeholderStyle={[toggleStyles.opacity, toggleStyles.moveDown]}
            onSubmitEditing={Keyboard.dismiss}
            keyboardType="numeric"
            footerLeft={footerLeft}
            footerRight={footerRight}
            footerRightProps={{ style: toggleStyles.opacity }}
            type="boldDisplay4"
            placeholderType="regularTitle2"
            errorMessageTestID="AmountInputError"
            borderColorOnFocus="kraken"
            backgroundColor="dark50"
            inputWrapperStyle={styles.inputWrapper}
            inputStyle={[styles.input, toggleStyles.opacity, toggleStyles.moveDown]}
            style={styles.innerContainerStyle}
          />
          {!isAssetFromKrakenConnect && <Button text={loc.send.max} onPress={handleMaxButtonPress} style={styles.absoluteButton} testID="MaxAmountButton" />}
        </View>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  input: {
    minHeight: 40,
  },
  inputWrapper: {
    minHeight: 40,
    marginRight: 60,
  },
  innerContainerStyle: {
    paddingTop: 12,
  },
  absoluteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  inputContainer: {
    marginBottom: 16,
    minHeight: 92,
  },
  sectionHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  amountToggle: {
    flexDirection: 'row',
    maxWidth: '50%',
    marginRight: 8,
    alignItems: 'center',
  },
  toggleWrapperStyle: {
    paddingHorizontal: 16,
  },
});
