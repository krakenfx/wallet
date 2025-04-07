import { View } from 'react-native';

import { DepositOptionsCarouselUI } from '@/components/DepositOptionsCarousel/DepositOptionsCarouselUI';

import type { Meta, StoryObj } from '@storybook/react';

const DepositOptionsCarouselMeta: Meta<typeof DepositOptionsCarouselUI> = {
  title: 'DepositOptionsCarousel',
  component: DepositOptionsCarouselUI,
  decorators: [
    Story => (
      <View
        style={{
          paddingVertical: 300,
          paddingHorizontal: 30,
          justifyContent: 'center',
          flex: 1,
        }}>
        <Story />
      </View>
    ),
  ],
};

export default DepositOptionsCarouselMeta;

export const Basic: StoryObj<typeof DepositOptionsCarouselUI> = {
  args: {
    caption: 'caption text',
    cards: [
      {
        assetAddress: '0xabc123def456ghi789jkl012mno345pqr678stu9',
        assetId: '1',
        assetName: 'ETH Vault',
        assetNetwork: 'ethereum',
        assetSymbol: 'ETH',
        protocolDescription: 'A high-yield Ethereum staking vault.',
        protocolLogo: 'https://placehold.co/100x100',
        protocolName: 'Ethereum Staking',
        protocolApy: '5.4%',
        vaultAddress: '0xvaultabc123def456ghi789jkl012mno345pqr678',
        vaultNetwork: 'ethereum',
      },
      {
        assetAddress: '0x456def789ghi012jkl345mno678pqr901stu234vwx',
        assetId: '2',
        assetName: 'Base Stablecoin Vault',
        assetNetwork: 'base',
        assetSymbol: 'USDC',
        protocolDescription: 'Stablecoin yield farming on Base.',
        protocolLogo: 'https://placehold.co/100x100',
        protocolName: 'Base Yield Protocol',
        protocolApy: '7.2%',
        vaultAddress: '0xvault456def789ghi012jkl345mno678pqr901stu',
        vaultNetwork: 'base',
      },
      {
        assetAddress: '0x789ghi012jkl345mno678pqr901stu234vwx567yz',
        assetId: '3',
        assetName: 'Optimism Liquidity Pool',
        assetNetwork: 'optimism',
        assetSymbol: 'OP',
        protocolDescription: 'Liquidity provision for Optimism network.',
        protocolLogo: 'https://placehold.co/100x100',
        protocolName: 'Optimism Liquidity',
        protocolApy: '9.5%',
        vaultAddress: '0xvault789ghi012jkl345mno678pqr901stu234vwx',
        vaultNetwork: 'optimism',
      },
      {
        assetAddress: '0x012jkl345mno678pqr901stu234vwx567yz890abc',
        assetId: '4',
        assetName: 'Ethereum DeFi Pool',
        assetNetwork: 'ethereum',
        assetSymbol: 'DAI',
        protocolDescription: 'Decentralized lending on Ethereum.',
        protocolLogo: 'https://placehold.co/100x100',
        protocolName: 'Ethereum DeFi',
        protocolApy: '6.8%',
        vaultAddress: '0xvault012jkl345mno678pqr901stu234vwx567yz',
        vaultNetwork: 'ethereum',
      },
      {
        assetAddress: '0x345mno678pqr901stu234vwx567yz890abc123def',
        assetId: '5',
        assetName: 'Optimism Staking Pool',
        assetNetwork: 'optimism',
        assetSymbol: 'USDT',
        protocolDescription: 'USDT staking with high returns on Optimism.',
        protocolLogo: 'https://placehold.co/100x100',
        protocolName: 'Optimism Staking',
        protocolApy: '8.3%',
        vaultAddress: '0xvault345mno678pqr901stu234vwx567yz890abc',
        vaultNetwork: 'optimism',
      },
    ],
    isLoading: false,
  },
};
