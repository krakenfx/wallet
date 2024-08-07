import { hdkey } from '@ethereumjs/wallet';

import { arrayify, isHexString as isEthersHexString } from '@ethersproject/bytes';
import { SignTypedDataVersion, TypedMessage, signTypedData } from '@metamask/eth-sig-util';
import { isValidAddress, toBuffer, toChecksumAddress } from 'ethereumjs-util';
import { BigNumberish, TransactionRequest as EthersTransactionRequest, JsonRpcProvider, Wallet, keccak256 } from 'ethers';
import { omit, startsWith } from 'lodash';

import { EVMFeeOption, EVMMessageSimulationInput, EVMSimulationInput, SimulationInput, Transaction } from '@/api/types';
import { AssetMetadata } from '@/realm/assetMetadata';
import { RealmNft } from '@/realm/nfts';
import { RealmToken } from '@/realm/tokens';
import { SuperBigNumber } from '@/utils/SuperBigNumber';

import { getEVMNFTProtocolType, getNFTTransferCall, getTokenTransferCall } from '../protocols/ethereum';

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
} from './base';
import { HarmonyTransport } from './HarmonyTransport';
import { IWalletStorage, WalletStorage } from './walletState';

export interface SignTransactionRequest {
  from?: string;
  to: string;
  gas?: BigNumberish;
  value?: BigNumberish;
  data?: string;
  nonce?: string;
  dAppOrigin?: string;
}

export class Etherscan implements BlockExplorer {
  constructor(public host: string) {}

  transactionUri(txId: string): string {
    return `https://${this.host}/tx/${txId}`;
  }
}

export class EVMNetwork implements Network<EthersTransactionRequest, SignTransactionRequest, EVMFeeOption> {
  label: string;
  blockExplorer?: BlockExplorer;
  nativeTokenDecimals: number;
  chainId: number;
  nativeTokenSymbol: NativeTokenSymbol;
  caipId: string;
  nativeTokenCaipId: string;
  icon: NetworkIcon;
  paymentUriPrefix = 'ethereum';
  disable1559: boolean;
  isTestnet: boolean;
  nativeTokenLabel?: string;
  defaultGasLimit?: number;

  constructor(config: {
    label: string;
    icon?: NetworkIcon;
    blockExplorer?: BlockExplorer;
    chainId: number;
    nativeTokenSymbol: NativeTokenSymbol;
    nativeTokenSlipId: number;
    nativeTokenLabel?: string;
    disable1559?: boolean;
    isTestnet?: boolean;
    defaultGasLimit?: number;
  }) {
    this.label = config.label;
    this.blockExplorer = config.blockExplorer;
    this.nativeTokenDecimals = 18;
    this.chainId = config.chainId;
    this.nativeTokenSymbol = config.nativeTokenSymbol;
    this.caipId = `eip155:${config.chainId}`;
    this.nativeTokenCaipId = `${this.caipId}/slip44:${config.nativeTokenSlipId}`;
    this.disable1559 = config?.disable1559 ?? false;
    this.isTestnet = config.isTestnet ?? false;
    this.nativeTokenLabel = config.nativeTokenLabel;
    this.defaultGasLimit = config.defaultGasLimit;
    this.icon =
      config.icon ||
      (({ opacity }) => ({
        id: 'eth',
        fgColor: ['#6c4dc2', '#99e3ed', -45],
        bgColor: `rgba(103, 126, 227, ${opacity})`,
      }));
  }

  isAddressValid(address: string): boolean {
    return isValidAddress(address);
  }

  async getPrivateKey(data: WalletDataWithSeed) {
    const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(Buffer.from(data.seed.data));
    const root = hdWallet.derivePath("m/44'/60'/0'/0");
    const child = root.deriveChild(data.accountIdx ?? 0);
    const wallet = child.getWallet();
    return wallet.getPrivateKeyString();
  }

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx?: number): ExtendedPublicKeyAndChainCode {
    const hdWallet = hdkey.EthereumHDKey.fromMasterSeed(Buffer.from(seed));
    const root = hdWallet.derivePath("m/44'/60'/0'/0");
    const child = root.deriveChild(accountIdx ?? 0);
    const wallet = child.getWallet();
    return { extendedPublicKey: Buffer.from(wallet.getPublicKey()) };
  }

  async deriveAddress(data: WalletData) {
    const publicKeyBuffer = Buffer.from(data.extendedPublicKey);
    const publicKeyHash = keccak256(publicKeyBuffer);
    const address = '0x' + publicKeyHash.slice(-40);
    return toChecksumAddress(address);
  }

  async deriveAllAddresses(data: WalletData): Promise<string[]> {
    return [await this.deriveAddress(data)];
  }

  getDerivationPath(accountIdx?: number) {
    return `m/44'/60'/0'/0/${accountIdx}`;
  }

  async createPaymentTransaction(wallet: WalletData, to: string, amount: StringNumber): Promise<SignTransactionRequest> {
    return {
      to,
      value: BigInt(amount),
    };
  }

  async createNFTTransferTransaction(data: WalletData, to: string, nft: RealmNft): Promise<SignTransactionRequest> {
    const address = await this.deriveAddress(data);
    const callData = getNFTTransferCall(
      {
        chainId: this.chainId,
        contractAddress: nft.metadata.collectionId,
        type: getEVMNFTProtocolType(nft.assetId)?.erc,
      },
      address,
      to,
      nft.metadata.tokenId,
    );

    return {
      data: callData,
      from: address,
      to: nft.metadata.collectionId,
    };
  }

  async createTokenTransferTransaction(data: WalletData, to: string, token: RealmToken, amount: StringNumber): Promise<SignTransactionRequest> {
    const contractAddress = token.assetId.split(':').reverse()[0]?.toLowerCase();

    const callData = getTokenTransferCall(
      {
        chainId: this.chainId,
        contractAddress,
      },
      await this.deriveAddress(data),
      to,
      amount,
    );

    return {
      data: callData,
      from: await this.deriveAddress(data),
      to: contractAddress,
    };
  }

  async signTransaction(data: WalletDataWithSeed, txPayload: EthersTransactionRequest): Promise<string> {
    const pk = await this.getPrivateKey(data);
    const wallet = new Wallet(pk);
    return await wallet.signTransaction(txPayload);
  }

  async signMessage(data: WalletDataWithSeed, message: Parameters<typeof arrayify>[0]): Promise<string> {
    const pk = await this.getPrivateKey(data);
    const wallet = new Wallet(pk);
    return wallet.signMessage(arrayify(message));
  }

  async signPersonalMessage(data: WalletDataWithSeed, message: string | Uint8Array): Promise<string> {
    const pk = await this.getPrivateKey(data);
    const wallet = new Wallet(pk);

    return await wallet.signMessage(typeof message === 'string' && isHexString(addHexPrefix(message)) ? arrayify(addHexPrefix(message)) : message);
  }

  async signTypedDataMessage(data: WalletDataWithSeed, message: any): Promise<string> {
    const pk = await this.getPrivateKey(data);
    const wallet = new Wallet(pk);

    const pkeyBuffer = toBuffer(addHexPrefix(wallet.privateKey));
    let parsedData = message;
    try {
      parsedData = typeof message === 'string' && JSON.parse(message);
    } catch (e) {}

    let version = 'v1';
    if (typeof parsedData === 'object' && (parsedData.types || parsedData.primaryType || parsedData.domain)) {
      version = 'v4';
    }

    return signTypedData({
      data: parsedData as TypedMessage<TypedDataTypes>,
      privateKey: pkeyBuffer,
      version: version.toUpperCase() as SignTypedDataVersion,
    });
  }

  formatTransactionFee(amount: string): string {
    const fee = new SuperBigNumber(amount).dividedBy(new SuperBigNumber(10).pow(9));
    return `${fee.isLessThan(1) ? fee.toFixed(4) : fee.toFixed(0)} Gwei`;
  }
}

export class EVMHarmonyTransport extends HarmonyTransport<EthersTransactionRequest, SignTransactionRequest, unknown, EVMNetwork> {
  async prepareTransaction(
    network: EVMNetwork,
    walletData: WalletData,
    _state: WalletStorage<unknown>,
    transaction: SignTransactionRequest,
    fee?: EVMFeeOption,
    final?: boolean,
  ): Promise<PreparedTransaction<EthersTransactionRequest>> {
    const harmony = await this.getHarmony();
    const thisAddress = await network.deriveAddress(walletData);

    const txPayload: EthersTransactionRequest = {
      to: transaction.to,
      from: transaction.from || thisAddress,
      chainId: hexStr(network.chainId),
      data: transaction.data,
      value: hexStr(transaction.value),

      gasLimit: transaction.gas ? Number(transaction.gas) : undefined,
      nonce: transaction.nonce ? Number(transaction.nonce) : undefined,
    };

    if (final) {
      setTransactionGasFee(txPayload, fee);
    }

    const { content } = await harmony.POST('/v1/simulate', {
      params: { query: { network: network.caipId } },
      body: {
        ...txPayload,
        dAppOrigin: transaction.dAppOrigin,
      } as EVMSimulationInput as unknown as SimulationInput,
    });

    if (!('nonce' in content)) {
      throw new Error('Unexpected simulation result');
    }

    txPayload.nonce = txPayload.nonce ?? content.nonce;
    txPayload.gasLimit = txPayload.gasLimit ?? padGasLimit(content.gasUsed);

    return {
      data: txPayload,
      isError: content.status === 'failure',
      effects: content.effects,
      preventativeAction: content.preventativeAction,
      warnings: content.warnings,
    };
  }

  async prepareMessage({ network, walletData, ...rest }: Omit<EVMMessageSimulationInput, 'signatory'> & { network: EVMNetwork; walletData: WalletData }) {
    const harmony = await this.getHarmony();
    const thisAddress = await network.deriveAddress(walletData);

    const { content } = await harmony.POST('/v1/simulate', {
      params: { query: { network: network.caipId } },
      body: {
        ...rest,
        signatory: thisAddress,
      },
    });

    return {
      isError: content.status === 'failure',
      preventativeAction: content.preventativeAction,
      warnings: content.warnings,
    };
  }

  async estimateTransactionCost(
    network: EVMNetwork,
    wallet: WalletData,
    tx: PreparedTransaction<EthersTransactionRequest>,
    fee: EVMFeeOption,
  ): Promise<TotalFee> {
    return await estimateTransactionCost(network, wallet, tx, fee);
  }

  async estimateDefaultTransactionCost(network: EVMNetwork, wallet: WalletData, store: unknown, fee: EVMFeeOption): Promise<TotalFee> {
    if (!network.defaultGasLimit) {
      throw Error('Estimate not supported, missing default gas limit');
    }
    return await estimateTransactionCost(network, wallet, { data: { gasLimit: network.defaultGasLimit } }, fee);
  }

  async analyseAddress(network: EVMNetwork, wallet: WalletData, toAddress: string) {
    const harmony = await this.getHarmony();
    const thisAddress = await network.deriveAddress(wallet);

    const resp = await harmony.POST('/v1/analyse/address', {
      body: {
        fromAddress: thisAddress,
        toAddress,
      },
    });
    return resp;
  }
}

function setTransactionGasFee(tx: EthersTransactionRequest, fee: EVMFeeOption | undefined) {
  if (!fee) {
    return;
  }
  if (fee.is1559 === true) {
    tx.maxPriorityFeePerGas = fee.maxPriorityFeePerGas;
    tx.maxFeePerGas = fee.maxFeePerGas;
    tx.type = 2;
  } else {
    tx.gasPrice = fee.fee;
  }
}

export class EVMRPCTransport implements Transport<unknown, SignTransactionRequest, unknown, EVMNetwork, EVMFeeOption> {
  provider: JsonRpcProvider;
  constructor(private rpcUri: string) {
    this.provider = new JsonRpcProvider(this.rpcUri);
  }

  async getTransactionStatus(network: EVMNetwork, txid: string): Promise<boolean> {
    const tx = await this.provider.getTransactionReceipt(txid);
    return (tx?.status ?? 0) > 0;
  }

  async getFeesEstimate(network: EVMNetwork): Promise<FeeOptions<EVMFeeOption>> {
    const feeData = await this.provider.getFeeData();

    if (feeData.maxFeePerGas != null && feeData.maxPriorityFeePerGas != null && !network.disable1559) {
      return {
        options: [
          {
            is1559: true,
            kind: 'medium',
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas.toString(),
            maxFeePerGas: feeData.maxFeePerGas.toString(),
          },
        ],
      };
    } else if (feeData.gasPrice !== null) {
      return {
        options: [
          {
            is1559: false,
            kind: 'medium',
            fee: feeData.gasPrice.toString(),
          },
        ],
      };
    }

    throw new Error('Unable to determine fee data');
  }

  fetchBalance(
    _network: Network<unknown, unknown>,
    _wallet: WalletData,
    _data: IWalletStorage<unknown>,
    _getTokenMetadata?: (assetId: string) => Promise<AssetMetadata>,
  ): Promise<BalanceResponse[]> {
    throw new Error('Method not implemented.');
  }

  estimateDefaultTransactionCost(): Promise<TotalFee> {
    throw new Error('Method not implemented.');
  }

  async fetchTransactions(
    _network: EVMNetwork,
    _wallet: WalletData,
    _data: IWalletStorage<unknown>,
    _handle: (txs: Transaction[]) => Promise<boolean>,
  ): Promise<void> {}

  async prepareTransaction(network: EVMNetwork, walletData: WalletData, state: unknown, transaction: SignTransactionRequest, fee?: EVMFeeOption) {
    const thisAddress = await network.deriveAddress(walletData);

    const nonce = Number(transaction.nonce ?? (await this.provider.getTransactionCount(await network.deriveAddress(walletData))));

    const txPayload: EthersTransactionRequest = {
      to: transaction.to,
      from: transaction.from || thisAddress,
      nonce,
      gasLimit: Number(transaction.gas),
      chainId: network.chainId,
      data: transaction.data,
      value: transaction.value ?? null,
    };

    const latestBlock = await this.provider.getBlock('latest');
    if (!latestBlock) {
      throw new Error('Could not query latest block');
    }

    if (!txPayload.gasLimit) {
      try {
        txPayload.gasLimit = await estimateGasWithPadding(txPayload, this.provider, latestBlock.gasLimit);
      } catch (e) {
        console.error(e);
        throw new Error('unable to determine a gas limit');
      }
    }

    setTransactionGasFee(txPayload, fee);

    return {
      data: txPayload,
    };
  }

  async estimateTransactionCost(
    network: EVMNetwork,
    wallet: WalletData,
    tx: PreparedTransaction<EthersTransactionRequest>,
    fee: EVMFeeOption,
  ): Promise<TotalFee> {
    return await estimateTransactionCost(network, wallet, tx, fee);
  }

  async broadcastTransaction(network: EVMNetwork, txhex: string): Promise<string> {
    const response = await this.provider.broadcastTransaction(txhex);
    return response.hash;
  }
}

async function estimateTransactionCost(
  network: EVMNetwork,
  wallet: WalletData,
  tx: PreparedTransaction<EthersTransactionRequest>,
  fee: EVMFeeOption,
): Promise<TotalFee> {
  if (!tx.data.gasLimit) {
    throw new Error('prepared tx object is missing gas limit');
  }
  let amount;
  if (fee.is1559 === true) {
    amount = BigInt(tx.data.gasLimit) * BigInt(fee.maxFeePerGas);
  } else {
    amount = BigInt(tx.data.gasLimit) * BigInt(fee.fee);
  }

  return {
    token: network.nativeTokenCaipId,
    amount: amount.toString(),
  };
}

const addHexPrefix = (value: string): string => (startsWith(value, '0x') ? value : `0x${value}`);

const isHexString = (value: string): boolean => isEthersHexString(value);

interface MessageTypeProperty {
  name: string;
  type: string;
}

interface TypedDataTypes {
  EIP712Domain: MessageTypeProperty[];
  [additionalProperties: string]: MessageTypeProperty[];
}

export async function estimateGasWithPadding(
  txPayload: EthersTransactionRequest,
  provider: JsonRpcProvider,
  latestBlockGasLimit: bigint,
  paddingFactor: number = 1.1,
): Promise<bigint> {
  const payloadForEstimate = omit(txPayload, ['gasPrice', 'maxFeePerGas', 'maxPriorityFeePerGas', 'gasLimit']);
  const estimatedGas = await provider.estimateGas(payloadForEstimate);

  const adjustedBlockGasLimit = (latestBlockGasLimit * 90n) / 100n;

  const paddedGas = padGasLimit(estimatedGas, paddingFactor);

  if (adjustedBlockGasLimit > paddedGas) {
    return paddedGas;
  }

  if (estimatedGas <= adjustedBlockGasLimit) {
    return estimatedGas;
  }

  return adjustedBlockGasLimit;
}

function padGasLimit(gas: bigint | number, paddingFactor: number = 1.1) {
  return (BigInt(gas) * BigInt(Math.round(paddingFactor * 100))) / 100n;
}

export function hexStr(data: BigNumberish | undefined) {
  if (data === undefined) {
    return undefined;
  }
  if (typeof data === 'string' && data.startsWith('0x')) {
    return data;
  }
  return '0x' + data.toString(16);
}
