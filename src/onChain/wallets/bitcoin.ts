import * as secp256k1 from '@bitcoinerlab/secp256k1';
import BigNumber from 'bignumber.js';
import BIP32Factory, { BIP32Interface } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import coinSelect from 'coinselect';
import coinSelectSplit from 'coinselect/split';
import { ECPairAPI, ECPairFactory } from 'ecpair';
import { flatMap, reverse } from 'lodash';

import { Buffer } from 'buffer';

import { BaseFeeOption, ReceiveAsset, SendAsset, Transaction, TransactionEffect } from '@/api/types';
import { RealmToken } from '@/realm/tokens';
import { runAfterUISync } from '@/utils/runAfterUISync';

import * as BlueElectrum from '../blueElectrumModules/BlueElectrum';
import { VOut } from '../blueElectrumModules/BlueElectrum';
import {
  HistoryItem,
  estimateFees,
  multiGetBalanceByAddress,
  multiGetHistoryByAddress,
  multiGetUtxoByAddress,
  splitIntoChunks,
  waitTillConnected,
} from '../blueElectrumModules/BlueElectrumTyped';
import {
  BalanceResponse,
  BlockExplorer,
  ExtendedPublicKeyAndChainCode,
  FeeOptions,
  NativeTokenSymbol,
  Network,
  NetworkIcon,
  PreparedTransaction,
  TotalFee,
  Transport,
  WalletData,
  WalletDataWithSeed,
} from '../wallets/base';
import { XPUB_PREFIX, refreshSequence, setXPubPrefix } from '../wallets/bitcoinHelpers';
import { IWalletStorage } from '../wallets/walletState';

import { ChainAgnostic } from './utils/ChainAgnostic';

import loc from '/loc';

const ECPair: ECPairAPI = ECPairFactory(secp256k1);

const bip32 = BIP32Factory(secp256k1);
const ELECTRUM_BTC_TO_INT_MULTIPLIER = 100000000;

type SegwitType = 'p2wpkh' | 'p2sh(p2wpkh)';

export type Utxo = {
  txid: string;
  vout: number;
  value: number;

  derivationPath: string;
  address: string;
};

type SendRequest = {
  to: string;
  amount: bigint;
  isMax?: boolean;
};

type SendTransaction = {
  psbt: bitcoin.Psbt;

  inputPaths: string[];

  utxos: Utxo[];
  changeAddress: string;
  request: SendRequest;

  fee: number;
};

type HDSequenceState = {
  receivingIndex: number;
  changeIndex: number;
};

export type BTCTransaction = Transaction & { inputs: string[]; outputs: string[] };

export type WalletState =
  | {
      sequence?: HDSequenceState;
    }
  | undefined;

export type GenerateAddress = (node: BIP32Interface) => string;

export type HDAddressChangeType = 'change' | 'receiving';

type BIP44Path = {
  purpose: string;
  coinType: number;
  account: number;
  type: HDAddressChangeType;
  index: number;
};

const BITCOIN_COINTYPE = 0;

export type PsbtInputExtended = Parameters<bitcoin.Psbt['addInput']>[0];
type UpdatePsbtInput = (wallet: WalletData, pbst: PsbtInputExtended, utxo: Utxo) => Promise<PsbtInputExtended>;

type BitcoinFeeOption = BaseFeeOption;

export class BitcoinNetwork implements Network<SendTransaction, SendRequest> {
  label: string = loc.network.bitcoin;
  blockExplorer: BlockExplorer = {
    transactionUri(txId: string) {
      return `https://mempool.space/tx/${txId}`;
    },
  };
  icon: NetworkIcon = ({ opacity }) => ({
    id: 'btc',
    fgColor: '#FFFFFF',
    bgColor: `rgba(255,138, 0, ${opacity})`,
  });
  caipId: string = ChainAgnostic.NETWORK_BITCOIN;
  nativeTokenCaipId: string = ChainAgnostic.COIN_BITCOIN;
  nativeTokenDecimals: number = 8;
  nativeTokenSymbol: NativeTokenSymbol = 'BTC';
  segwitType: SegwitType | undefined;
  generateAddress: GenerateAddress;
  prepareInput?: UpdatePsbtInput;
  derivationPath: Pick<BIP44Path, 'purpose'>;
  xpubPrefix?: string;

  constructor(opts: {
    segwitType?: SegwitType;
    derivationPath: Pick<BIP44Path, 'purpose'>;
    deriveAddress: (hdNode: BIP32Interface) => string;
    updatePsbtInput?: UpdatePsbtInput;
    xpubPrefix?: string;
  }) {
    this.segwitType = opts.segwitType;
    this.derivationPath = opts.derivationPath;
    this.generateAddress = opts.deriveAddress;
    this.prepareInput = opts.updatePsbtInput;
    this.xpubPrefix = opts.xpubPrefix;
  }

  createTokenTransferTransaction(_data: WalletData, _to: string, _token: RealmToken, _amount: StringNumber): Promise<SendRequest> {
    throw new Error('not implemented');
  }

  async createPaymentTransaction(wallet: WalletData, to: string, amount: StringNumber): Promise<SendRequest> {
    return {
      to,
      amount: BigInt(amount),
    };
  }

  async createMaxPaymentTransaction(wallet: WalletData, to: string, minAmount?: StringNumber): Promise<SendRequest> {
    return {
      to,
      amount: minAmount ? BigInt(minAmount) : 0n,
      isMax: true,
    };
  }

  async deriveAddress(wallet: WalletData): Promise<string> {
    return this.generateAddress(await this.getHDNodeForPath(wallet, { type: 'receiving', index: 0 }));
  }

  async getReceiveAddress(wallet: WalletData, storage: IWalletStorage<WalletState>): Promise<string> {
    return this.generateAddress(await this.getHDNodeForPath(wallet, { type: 'receiving', index: storage.state?.sequence?.receivingIndex ?? 0 }));
  }

  async deriveAllAddresses(data: WalletData, store: IWalletStorage<WalletState>, onlyPublic?: boolean): Promise<string[]> {
    return Object.keys(await this.getAllAddresses(data, store, !onlyPublic ?? true, true));
  }

  async getAllAddresses(
    wallet: WalletData,
    store: IWalletStorage<WalletState>,
    includeChange: boolean,
    includeReceive: boolean,
  ): Promise<{ [address: string]: string }> {
    const addresses: { [path: string]: string } = {};

    const add = async (index: number, type: HDAddressChangeType) => {
      const path = this.getPath({ index, type });
      const address = await this.getAddressForPath(store, wallet, path);
      addresses[address] = path;
    };
    const addAll = async (toIndex: number, type: HDAddressChangeType) => {
      const promises = [];
      for (let i = 0; i <= toIndex; i++) {
        promises.push(add(i, type));
      }
      return Promise.all(promises);
    };

    if (includeChange) {
      await addAll(store.state?.sequence?.changeIndex ?? 0, 'change');
    }

    if (includeReceive) {
      await addAll(store.state?.sequence?.receivingIndex ?? 0, 'receiving');
    }

    return addresses;
  }

  getPath(props: Pick<BIP44Path, 'type' | 'index'>) {
    const path: string[] = [props.type === 'change' ? '1' : '0', props.index.toString()];
    return path.join('/');
  }

  async getHDNodeForPath(wallet: WalletData, props: Pick<BIP44Path, 'type' | 'index'> | string) {
    const path = typeof props === 'string' ? props : this.getPath(props);
    const root = await runAfterUISync(() => deriveRoot(wallet), 3);
    return await runAfterUISync(() => root.derivePath(path), 3);
  }

  async getAddressForPath(store: IWalletStorage<WalletState>, wallet: WalletData, props: Pick<BIP44Path, 'type' | 'index'> | string) {
    const path = typeof props === 'string' ? props : this.getPath(props);

    const creatorFunc = async () => {
      const hdNode = await this.getHDNodeForPath(wallet, path);
      return runAfterUISync(() => this.generateAddress(hdNode), 3);
    };

    return store.getAddress(path, creatorFunc);
  }

  getDerivationPath(accountIdx?: number): string {
    const path: string[] = ['m', `${this.derivationPath.purpose}'`, `${BITCOIN_COINTYPE}'`, `${accountIdx ?? 0}'`];
    return path.join('/');
  }

  isAddressValid(address: string): boolean {
    try {
      bitcoin.address.toOutputScript(address);
      return true;
    } catch (e) {
      return false;
    }
  }

  async signTransaction(wallet: WalletDataWithSeed, tx: SendTransaction): Promise<string> {
    const root = deriveRootFromSeed(wallet);

    tx.psbt.txInputs.forEach((input, idx) => {
      const derivationPath = this.getDerivationPath(wallet.accountIdx);

      const wif = root.derivePath(derivationPath + '/' + tx.inputPaths[idx]).toWIF();
      const keyPair = ECPair.fromWIF(wif);
      tx.psbt.signInput(idx, keyPair);
    });

    return tx.psbt.finalizeAllInputs().extractTransaction().toHex();
  }

  formatTransactionFee(amount: string): string {
    return `${parseFloat(amount).toFixed()} Sats/vB`;
  }

  async getXYZPub(wallet: WalletDataWithSeed): Promise<string> {
    const rootPath = this.getDerivationPath(wallet.accountIdx);
    const bip32Interface = deriveRootFromSeed(wallet).derivePath(rootPath);
    const xpub = bip32Interface.neutered().toBase58();
    return setXPubPrefix(xpub, this.xpubPrefix ?? XPUB_PREFIX);
  }

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx?: number): ExtendedPublicKeyAndChainCode {
    const walletData = {
      accountIdx,
      seed: {
        data: seed,
      },
    };

    const rootPath = this.getDerivationPath(walletData.accountIdx);
    const bip32Interface = deriveRootFromSeed(walletData).derivePath(rootPath);
    return {
      extendedPublicKey: bip32Interface.publicKey,
      chainCode: bip32Interface.chainCode,
    };
  }
}

export class BitcoinElectrumTransport implements Transport<SendTransaction, SendRequest, WalletState, BitcoinNetwork, BitcoinFeeOption> {
  async fetchState(wallet: WalletData, network: BitcoinNetwork, store: IWalletStorage<WalletState>): Promise<WalletState> {
    const receivingIndex = await refreshSequence(store.state?.sequence?.receivingIndex ?? 0, async index => {
      return await network.getAddressForPath(store, wallet, { index, type: 'receiving' });
    });
    const changeIndex = await refreshSequence(store.state?.sequence?.changeIndex ?? 0, async index => {
      return await network.getAddressForPath(store, wallet, { index, type: 'change' });
    });
    return {
      sequence: {
        receivingIndex,
        changeIndex,
      },
    };
  }

  async prepareTransaction(
    network: BitcoinNetwork,
    wallet: WalletData,
    store: IWalletStorage<WalletState>,
    transaction: SendRequest,
    feeOption: BitcoinFeeOption,
  ): Promise<PreparedTransaction<SendTransaction>> {
    const utxos: (Utxo & {
      script?: { length: number };
    })[] = (await this.fetchUtxo(wallet, network, store)).map(utxo => {
      let extra;
      if (utxo.address.startsWith('bc1')) {
        extra = { script: { length: 27 } };
      } else if (utxo.address.startsWith('3')) {
        extra = { script: { length: 50 } };
      }

      return {
        txid: utxo.txId,
        vout: utxo.vout,
        value: utxo.value,
        ...extra,

        address: utxo.address,
        derivationPath: utxo.path,
      };
    });

    console.log(`[bitcoin/prepareTransaction] utxos available ${utxos.length}`, utxos);

    const changeAddress = await network.getAddressForPath(store, wallet, {
      index: store.state?.sequence?.changeIndex ?? 0,
      type: 'change',
    });

    const result = await this.selectUtxosBuildPsbt(network, wallet, utxos, transaction, changeAddress, feeOption);

    return {
      data: {
        ...result,
        utxos,
        changeAddress,
        request: transaction,
      },
    };
  }

  async selectUtxosBuildPsbt(
    network: BitcoinNetwork,
    wallet: WalletData,
    utxos: Utxo[],
    transaction: SendRequest,
    changeAddress: string,
    { amount }: BitcoinFeeOption,
  ) {
    const targets = [
      {
        address: transaction.to,

        value: transaction.isMax ? undefined : Number(transaction.amount),
      },
    ];

    // eslint-disable-next-line radix
    const { inputs, outputs, fee } = coinselect(utxos, targets, parseInt(amount), changeAddress);

    if (transaction.isMax) {
      const totalSent = outputs
        .filter(o => !!o.address)
        .map(o => o.value)
        .reduce((a, b) => a + b);
      if (totalSent < transaction.amount) {
        throw new Error('unable to send the required minimum');
      }
    }

    const inputPaths: string[] = [];
    const psbt = new bitcoin.Psbt();
    for (const input of inputs) {
      const psbtInput = {
        hash: input.txid,
        index: input.vout,
        sequence: defaultRBFSequence,
      };

      const finalPsbtInput = (await network.prepareInput?.(wallet, psbtInput, input)) ?? psbtInput;
      psbt.addInput(finalPsbtInput);
      inputPaths.push(input.derivationPath);
    }

    outputs.forEach(output => {
      if (!output.address) {
        output.address = changeAddress;
      }

      psbt.addOutput({
        address: output.address,
        value: output.value,
      });
    });

    return {
      psbt,
      inputPaths,
      fee,
    };
  }

  async estimateTransactionCost(
    network: BitcoinNetwork,
    wallet: WalletData,
    tx: PreparedTransaction<SendTransaction>,
    feeOption: BitcoinFeeOption,
  ): Promise<TotalFee> {
    const { fee } = await this.selectUtxosBuildPsbt(network, wallet, tx.data.utxos, tx.data.request, tx.data.changeAddress, feeOption);

    return {
      amount: fee.toString(),
      token: network.nativeTokenCaipId,
    };
  }

  async estimateDefaultTransactionCost(
    network: BitcoinNetwork,
    wallet: WalletData,
    store: IWalletStorage<WalletState>,
    feeOption: BitcoinFeeOption,
  ): Promise<TotalFee> {
    const amount = BigInt('546');
    const tx = await this.prepareTransaction(network, wallet, store, { amount, to: '' }, feeOption);
    const { fee } = await this.selectUtxosBuildPsbt(network, wallet, tx.data.utxos, tx.data.request, tx.data.changeAddress, feeOption);
    return {
      amount: fee.toString(),
      token: network.nativeTokenCaipId,
    };
  }

  async broadcastTransaction(network: BitcoinNetwork, signedTx: string): Promise<string> {
    await waitTillConnected();
    const broadcast = await BlueElectrum.broadcastV2(signedTx);

    let success: boolean;
    if (broadcast.indexOf('successfully') !== -1) {
      success = true;
    } else {
      success = broadcast.length === 64;
    }

    if (!success) {
      throw new Error('failed to submit transaction');
    }

    const tx = bitcoin.Transaction.fromHex(signedTx);
    return tx.getId();
  }

  async getFeesEstimate(network: BitcoinNetwork): Promise<FeeOptions<BitcoinFeeOption>> {
    const result = await estimateFees(1, 18, 144);
    return {
      options: [
        {
          kind: 'slow',
          amount: result.slow.toString(),
          estimatedTimeBlocks: 144,
          token: network.nativeTokenCaipId,
        },
        {
          kind: 'medium',
          amount: result.medium.toString(),
          estimatedTimeBlocks: 18,
          token: network.nativeTokenCaipId,
        },
        {
          kind: 'fast',
          amount: result.fast.toString(),
          estimatedTimeBlocks: 1,
          token: network.nativeTokenCaipId,
        },
      ],
    };
  }

  async getTransactionStatus(network: BitcoinNetwork, txid: string): Promise<boolean> {
    await waitTillConnected();
    const txdatas = await BlueElectrum.multiGetTransactionByTxid([txid], 1, true);
    return !!Object.values(txdatas)[0]?.confirmations;
  }

  async fetchBalance(network: BitcoinNetwork, wallet: WalletData, store: IWalletStorage<WalletState>): Promise<BalanceResponse[]> {
    await waitTillConnected();
    const balances = await multiGetBalanceByAddress(Object.keys(await network.getAllAddresses(wallet, store, true, true)));

    return [
      {
        balance: {
          token: ChainAgnostic.COIN_BITCOIN,
          value: balances.balance.toString(),
        },
        metadata: {
          symbol: 'BTC',
          label: 'Bitcoin',
          decimals: 8,
          reputation: {
            tokenLists: ['kraken'],
            blacklists: [],
          },
        },
      },
    ];
  }

  async fetchTransactions(
    network: BitcoinNetwork,
    wallet: WalletData,
    store: IWalletStorage<WalletState>,
    handle: (txs: BTCTransaction[]) => Promise<boolean>,
  ) {
    const changeAddresses = await network.getAllAddresses(wallet, store, true, false);
    const receiveAddresses = await network.getAllAddresses(wallet, store, false, true);
    const addressesToQuery = Object.keys({ ...changeAddresses, ...receiveAddresses });

    const txHistoryByAddress = await multiGetHistoryByAddress(addressesToQuery);

    const allHistoryItems = flatMap(Object.values(txHistoryByAddress));
    allHistoryItems.sort((a, b) => {
      const heightComparison = b.height - a.height;
      if (heightComparison === 0) {
        return a.tx_hash.localeCompare(b.tx_hash);
      }
      return heightComparison;
    });

    const dedupedHistoryItems: HistoryItem[] = [];
    for (let i = 0; i < allHistoryItems.length; i++) {
      if (i === allHistoryItems.length - 1 || allHistoryItems[i].tx_hash !== allHistoryItems[i + 1].tx_hash) {
        dedupedHistoryItems.push(allHistoryItems[i]);
      }
    }

    const chunkedHistoryItems = splitIntoChunks(dedupedHistoryItems, 200);

    for (const chunk of chunkedHistoryItems) {
      const hashes: { [key: string]: HistoryItem } = {};
      for (const tx of Object.values(chunk)) {
        hashes[tx.tx_hash] = tx;
      }
      const transactionDataById = await BlueElectrum.multiGetTransactionByTxid(Object.keys(hashes));

      const vinTxHashes = Object.values(transactionDataById)
        .flatMap(tx => tx.vin)
        .map(vin => vin.txid);
      const vinTxData = await BlueElectrum.multiGetTransactionByTxid(vinTxHashes);

      const transactions: BTCTransaction[] = chunk.map(tx => {
        const data = transactionDataById[tx.tx_hash];

        let effects = [];

        const getAddressFromVOut = (vout: VOut) =>
          'address' in vout.scriptPubKey ? vout.scriptPubKey.address : 'addresses' in vout.scriptPubKey ? vout.scriptPubKey.addresses[0] : undefined;

        let feeBalance = new BigNumber('0');
        const inputs = [];
        const outputs = [];

        let ownedAddressesSpent = new BigNumber('0');
        for (const vin of data.vin) {
          const address = getAddressFromVOut(vinTxData[vin.txid].vout[vin.vout]);
          if (!address) {
            continue;
          }
          const value = vinTxData[vin.txid].vout[vin.vout].value;

          if (addressesToQuery.indexOf(address) > -1) {
            ownedAddressesSpent = ownedAddressesSpent.plus(value);
          }

          feeBalance = feeBalance.plus(value);
          inputs.push(address);
        }

        let unownedOutAddresses: string[] = [];
        let unownedAddressesReceived = new BigNumber(0);
        let ownedAddressesReceived = new BigNumber(0);
        for (const vout of data.vout) {
          const address = getAddressFromVOut(vout);
          if (!address) {
            continue;
          }
          if (addressesToQuery.indexOf(address) > -1) {
            ownedAddressesReceived = ownedAddressesReceived.plus(vout.value);
          } else {
            unownedOutAddresses.push(address);
            unownedAddressesReceived = unownedAddressesReceived.plus(vout.value);
          }

          feeBalance = feeBalance.minus(vout.value);
          outputs.push(address);
        }

        const totalOwnedChange = ownedAddressesReceived.minus(ownedAddressesSpent);

        let kind;

        if (totalOwnedChange.gt(0)) {
          kind = 'affected' as const;
          let effect: ReceiveAsset = {
            assetId: network.nativeTokenCaipId,
            sender: '',
            amount: totalOwnedChange.multipliedBy(ELECTRUM_BTC_TO_INT_MULTIPLIER).toString(),
            type: 'receive',
          };
          effects.push(effect);
        } else if (unownedOutAddresses.length === 0) {
          kind = 'sent' as const;

          const receiveOutput = data.vout.filter(vout => (getAddressFromVOut(vout) ?? '') in receiveAddresses)?.[0];
          let amount, recipient;
          if (receiveOutput) {
            amount = new BigNumber(receiveOutput.value).multipliedBy(ELECTRUM_BTC_TO_INT_MULTIPLIER).toString();
            recipient = getAddressFromVOut(receiveOutput);
          } else {
            amount = ownedAddressesReceived.multipliedBy(ELECTRUM_BTC_TO_INT_MULTIPLIER).toString();
            recipient = getAddressFromVOut(data.vout[0]);
          }

          let effect: SendAsset = {
            assetId: network.nativeTokenCaipId,
            recipient: recipient ?? '',
            amount,
            type: 'send',
          };
          effects.push(effect);
        } else {
          kind = 'sent' as const;
          let effect: SendAsset = {
            assetId: network.nativeTokenCaipId,
            recipient: unownedOutAddresses[0] ?? '',
            amount: unownedAddressesReceived.multipliedBy(ELECTRUM_BTC_TO_INT_MULTIPLIER).toString(),
            type: 'send',
          };
          effects.push(effect);
        }

        return {
          id: data.txid,
          kind,
          inputs,
          outputs,
          fee:
            kind === 'sent'
              ? {
                  amount: feeBalance.toString(),
                  token: network.nativeTokenCaipId,
                }
              : undefined,
          timestamp: data.time,
          status: data.time ? 'succeeded' : ('pending' as any),
          effects: effects as TransactionEffect[],
        };
      });

      await handle(transactions);
    }
  }

  private async fetchUtxo(wallet: WalletData, network: BitcoinNetwork, state: IWalletStorage<WalletState>): Promise<(BlueElectrum.Utxo & { path: string })[]> {
    const addressToPath = await network.getAllAddresses(wallet, state, true, true);
    await waitTillConnected();
    const utxoByAddress = await multiGetUtxoByAddress(Object.keys(addressToPath));

    return flatMap(
      Object.entries(utxoByAddress).map(([address, utxos]) => {
        return utxos.map(utxo => {
          return {
            ...utxo,
            path: addressToPath[address],
          };
        });
      }),
    );
  }
}

type KnownReason = 'exceedingBalance';
export class PrepareError extends Error {
  constructor(readonly message: string, readonly reason?: KnownReason) {
    super(message);
    this.reason = reason;
  }
}

export function coinselect(
  utxos: Utxo[],
  targets: { address: string; value?: number }[],
  feeRate: number,
  changeAddress: string,
): {
  inputs: Utxo[];
  outputs: {
    address?: string;
    value: number;
  }[];
  fee: number;
} {
  if (!changeAddress) {
    throw new Error('No change address provided');
  }

  let algo = coinSelect;

  if (targets.some(i => i.value === undefined)) {
    algo = coinSelectSplit;
  }

  const { inputs, outputs, fee } = algo(utxos, targets, feeRate);

  if (!inputs || !outputs) {
    throw new PrepareError('Not enough balance', 'exceedingBalance');
  }

  return { inputs, outputs, fee };
}

export function getMasterFingerprintBuffer(masterFingerprint: number | undefined) {
  if (masterFingerprint) {
    let masterFingerprintHex = Number(masterFingerprint).toString(16);
    if (masterFingerprintHex.length < 8) {
      masterFingerprintHex = '0' + masterFingerprintHex;
    }
    const hexBuffer = Buffer.from(masterFingerprintHex, 'hex');
    return Buffer.from(reverse(hexBuffer));
  } else {
    return Buffer.from([0x00, 0x00, 0x00, 0x00]);
  }
}

export const defaultRBFSequence = 2147483648;
export const finalRBFSequence = 0xffffffff;

export function deriveRootFromSeed(wallet: Pick<WalletDataWithSeed, 'seed'>) {
  return bip32.fromSeed(Buffer.from(wallet.seed.data));
}

export function deriveRoot(wallet: WalletData) {
  const publicKey = Buffer.from(wallet.extendedPublicKey);
  if (wallet.chainCode) {
    const chainCode = Buffer.from(wallet.chainCode);
    return bip32.fromPublicKey(publicKey, chainCode);
  } else {
    throw new Error('[bitcoin] missing chainCode in wallet data');
  }
}
