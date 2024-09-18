import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { Currency, getCurrencyInfo } from '@/screens/Settings/currency';
import { formatCurrency } from '@/utils/formatCurrency';

import { colorsControl } from '@/utils/storybook';

import { AnimatedNumbers } from './AnimatedNumbers';

import type { Meta, StoryObj } from '@storybook/react';

const AnimatedNumbersMeta: Meta<typeof AnimatedNumbers> = {
  title: 'AnimatedNumbers',
  component: AnimatedNumbers,
  argTypes: {
    color: colorsControl,
    ticker: {
      options: [Currency.USD, Currency.EUR, Currency.GBP, Currency.CAD, Currency.AUD, Currency.CHF, Currency.JPY],
      mapping: {
        [Currency.USD]: getCurrencyInfo(Currency.USD).symbol,
        [Currency.EUR]: getCurrencyInfo(Currency.EUR).symbol,
        [Currency.GBP]: getCurrencyInfo(Currency.GBP).symbol,
        [Currency.CAD]: getCurrencyInfo(Currency.CAD).symbol,
        [Currency.AUD]: getCurrencyInfo(Currency.AUD).symbol,
        [Currency.CHF]: getCurrencyInfo(Currency.CHF).symbol,
        [Currency.JPY]: getCurrencyInfo(Currency.JPY).symbol,
      },
      control: { type: 'select' },
    },
    tickerFontSize: {
      control: { type: 'number', min: 10, max: 1200, step: 1 },
    },
    tickerBottomOffset: {
      control: { type: 'number', min: 0, max: 1200, step: 1 },
    },
    type: {
      options: ['headerBalance', 'boldLargeMonospace', 'boldTitleMarketDataPercentageLarge', 'boldTitleMarketDataPercentage'],
      control: { type: 'select' },
    },
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value as number);

    useEffect(() => {
      const interval = setInterval(() => {
        setValue(val => val - 10);
      }, 1800);

      return () => {
        clearInterval(interval);
      };
    }, []);

    useEffect(() => {
      if (args.value) {
        setValue(args.value as number);
      }
    }, [args.value]);

    const currency = useMemo(() => {
      switch (args.ticker) {
        case 'USD':
          return Currency.USD;
        case 'EUR':
          return Currency.EUR;
        case 'GBP':
          return Currency.GBP;
        case 'CAD':
          return Currency.CAD;
        case 'AUD':
          return Currency.AUD;
        case 'CHF':
          return Currency.CHF;
        case 'JPY':
          return Currency.JPY;
        default:
          return Currency.USD;
      }
    }, [args.ticker]);

    return <AnimatedNumbers {...args} value={formatCurrency(value, { currency, hideCurrencySign: false })} />;
  },
  decorators: [
    Story => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default AnimatedNumbersMeta;

type Story = StoryObj<typeof AnimatedNumbers>;

export const Basic: Story = {
  args: {
    type: 'headerBalance',
    ticker: getCurrencyInfo(Currency.USD).symbol,
    value: 4000,
    color: 'kraken',
    fontSize: 56,
    glyphSize: 41,
    prefix: '',
    suffix: '',
  },
};
