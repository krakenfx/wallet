import BigNumber from 'bignumber.js';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Alert, Keyboard, StyleSheet, View } from 'react-native';
import Animated, { CurvedTransition } from 'react-native-reanimated';

import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Toggle } from '@/components/Toggle';
import { useTokenBalanceConvertedToAppCurrency } from '@/hooks/useAppCurrencyValue';
import { useBalanceDisplay } from '@/hooks/useBalanceDisplay';
import { Network } from '@/onChain/wallets/base';
import { useAppCurrency } from '@/realm/settings/useAppCurrency';
import { useTokenPrice } from '@/realm/tokenPrice';
import { RealmToken, getAvailableTokenBalance, useTokenByAssetId } from '@/realm/tokens';
import { Currency } from '@/screens/Settings/currency';
import { useTheme } from '@/theme/themes';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatTokenAmount } from '@/utils/formatTokenAmount';
import { isBtc } from '@/utils/isBtc';
import { unitConverter } from '@/utils/unitConverter';

import { Input } from '../../../components/Input';
import { useFormField } from '../utils/sendForm';

import loc from '/loc';

export type Props = {
  token: RealmToken;
  onChangeText?: (value: string) => void;
  network: Network;
  currentFeeEstimate?: string;
  onToggleCurrency?: (inputInFiatCurrency: boolean) => void;
};

export interface AmountInputRef {
  setAssetAmount: (text: string) => void;
  getAssetAmount: () => { amount: string; isMax: boolean };
  getFiatAmount: () => string;
  showFeeError: () => void;
}

const sanitizeValue = (value: string) => {
  let newValue = value.replace(',', '.');
  
  if (newValue.startsWith('.')) {
    newValue = `0${newValue}`;
  }
  
  if (/^0\d/.test(newValue)) {
    newValue = newValue.replace(/^0+/, '');
  }
  
  newValue = newValue.replace(/[^0-9.]+/g, '').replace(/(\..*?)\.+/g, '$1');
  return newValue;
};

export const AmountInput = React.forwardRef<AmountInputRef, Props>(({ token, network, currentFeeEstimate, onToggleCurrency }, ref) => {
  const [assetAmount, setAssetAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const { colors } = useTheme();
  const [inputInFiatCurrency, setInputInFiatCurrency] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMaxAmount, setIsMaxAmount] = useState(false);
  const [shouldValidate, setShouldValidate] = useState(false);
  const { currency, currencyInfo } = useAppCurrency();

  const getFiatAmount = useCallback(() => fiatAmount, [fiatAmount]);
  const exchangeRate = useTokenPrice({ assetId: token.assetId }) ?? 0;

  const feeToken = useTokenByAssetId(token.wallet.nativeTokenCaipId, token.walletId);
  const isNativeToken = token.assetId === feeToken.assetId;

  const amounts = useMemo(() => {
    const feeAmount = unitConverter.smallUnit2TokenUnit(currentFeeEstimate ?? 0, feeToken.metadata.decimals);
    const feeTokenBalanceAmount = unitConverter.smallUnit2TokenUnit(new BigNumber(feeToken.balance), feeToken.metadata.decimals);
    const balanceAmount = unitConverter.smallUnit2TokenUnit(new BigNumber(getAvailableTokenBalance(token)), token.metadata.decimals);
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
  }, [currentFeeEstimate, currency, feeToken.balance, feeToken.metadata.decimals, isNativeToken, token]);

  const setInputFiatCurrency = (value: boolean) => {
    setInputInFiatCurrency(value);
    if (onToggleCurrency) {
      onToggleCurrency(value);
    }
  };

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
      setAssetAmount(
        formatTokenAmount(new BigNumber(newFiatAmount).dividedBy(exchangeRate).toFixed(token.metadata.decimals), {
          currency: Currency.USD, 
          highPrecision: true,
          isBtc: isBtc(token),
        }),
      );
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
    }),
    [assetAmount, getFiatAmount, isMaxAmount, showFeeError, updateFiatAmount],
  );
  const inputValue = (inputInFiatCurrency ? fiatAmount : assetAmount).replace('.', currencyInfo.decimalSeparator);

  const onChangeAmount = useCallback(
    (changedValue: string) => {
      setIsMaxAmount(false);
      const newAmount = sanitizeValue(changedValue);
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

  const footerLeft =
    !!inputValue && !!exchangeRate && assetAmount && fiatAmount
      ? `${
          inputInFiatCurrency
            ? formatTokenAmount(unitConverter.smallUnit2TokenUnit(assetAmount, 0 ).toString(10), {
                currency,
                highPrecision: true,
                isBtc: isBtc({ assetId: token.assetId }),
              })
            : formatCurrency(fiatAmount, { currency })
        } ${inputInFiatCurrency ? token.metadata.symbol : ''}`
      : undefined;

  const fiatTotalBalance = useTokenBalanceConvertedToAppCurrency(token);
  const balanceValue =
    inputInFiatCurrency && fiatTotalBalance ? formatCurrency(fiatTotalBalance, { currency }) : `${amounts.balanceAmountFormatted} ${token.metadata.symbol}`;
  const balanceValueFormatted = useBalanceDisplay(balanceValue);
  const balanceDisplay = useBalanceDisplay(loc.send.balance);

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

  return (
    <Animated.View layout={CurvedTransition}>
      <View style={styles.sectionHeader}>
        <Label type="boldTitle2">{loc.send.amountHeader}</Label>

        {showToggleCurrency && (
          <Toggle
            disabled={!exchangeRate}
            handleTap={!exchangeRate ? handleDisabledToggle : undefined}
            toggleStyle={styles.toggle}
            leftText={token ? token.metadata.symbol : network.nativeTokenSymbol || ''}
            rightText={currency}
            onChange={setInputFiatCurrency}
            testID="AmountToggle"
          />
        )}
      </View>
      <View>
        <Input
          testID="AmountInput"
          inputTestID="AmountNativeInput"
          autoFocus
          onFocus={clearErrors}
          errorText={errorMessage}
          onBlur={verifyBalance}
          blurOnSubmit={false}
          left={<Label type="boldDisplay4">{inputInFiatCurrency && inputValue ? currencyInfo.sign : undefined}</Label>}
          containerStyle={styles.inputContainer}
          maxLength={20}
          onChangeText={onChangeAmount}
          value={inputValue}
          placeholder={loc.send.enterAmount}
          placeholderTextColor={colors.light50}
          onSubmitEditing={Keyboard.dismiss}
          keyboardType="numeric"
          footerLeft={footerLeft}
          footerRight={footerRight}
          type="boldDisplay4"
          placeholderType="regularTitle2"
          errorMessageTestID="AmountInputError"
          borderColorOnFocus="kraken"
          backgroundColor="dark50"
          inputWrapperStyle={styles.inputWrapper}
          inputStyle={styles.input}
          style={styles.innerContainerStyle}
        />
        <Button text={loc.send.max} onPress={handleMaxButtonPress} style={styles.maxButton} testID="MaxAmountButton" />
      </View>
    </Animated.View>
  );
});

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
  maxButton: {
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
  toggle: {
    height: 32,
  },
});
