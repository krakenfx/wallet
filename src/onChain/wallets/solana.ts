import * as splToken from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import { ComputeBudgetProgram, Connection, clusterApiUrl } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import bs58 from 'bs58';
import * as ed25519 from 'ed25519-hd-key';
import nacl from 'tweetnacl';

import { Buffer } from 'buffer';

import type { SolanaAddressLookupTableEntry, SolanaFeeOption, SolanaSimulationInput, SolanaSimulationResult } from '@/api/types';
import type { Nft } from '@/realm/nfts';
import type { RealmToken } from '@/realm/tokens';

import { HarmonyTransport } from './HarmonyTransport';

import type {
  BlockExplorer,
  ExtendedPublicKeyAndChainCode,
  NativeTokenSymbol,
  Network,
  NetworkIcon,
  PreparedTransaction,
  TotalFee,
  WalletData,
  WalletDataWithSeed,
} from './base';
import type { WalletStorage } from './walletState';

function getSolanaKeyPair(seedHex: string, derivationPath: string): web3.Keypair {
  const privateKey = ed25519.derivePath(derivationPath, seedHex).key;
  return web3.Keypair.fromSeed(privateKey);
}

export function getMintFromSPLToken(caipId: string) {
  const [_chain, tokenIdPart] = caipId.split('/', 2) as [string, string];
  const [_type, address] = tokenIdPart.split(':', 2);
  return address;
}

export function serializeInstruction(inst: web3.TransactionInstruction) {
  return {
    keys: inst.keys.map(key => {
      return {
        pubkey: key.pubkey.toString(),
        isSigner: key.isSigner,
        isWritable: key.isWritable,
      };
    }),
    programId: inst.programId.toString(),
    data: inst.data.toString('base64'),
  };
}

type SolanaTransactionPlan = {
  atas?: {
    address: web3.PublicKey;
    mint: web3.PublicKey;
    owner: web3.PublicKey;
    programId: web3.PublicKey;
  }[];

  instructions: web3.TransactionInstruction[];
  lookupTables?: SolanaAddressLookupTableEntry[];
};

type SolanaPreparedTransaction = {
  tx: web3.Transaction | web3.VersionedTransaction;
  fee: string;
};

export class SolanaHarmonyTransport extends HarmonyTransport<SolanaPreparedTransaction, SolanaTransactionPlan, unknown> {
  async prepareTransaction(
    network: Network,
    walletData: WalletData,
    store: WalletStorage<unknown>,
    transaction: SolanaTransactionPlan | { dAppOrigin: string; transaction: string },
    feeOption?: SolanaFeeOption,
  ): Promise<PreparedTransaction<SolanaPreparedTransaction>> {
    const harmony = await this.getHarmony();
    const payer = await network.deriveAddress(walletData);

    let txPayload: SolanaSimulationInput;
    if ('transaction' in transaction) {
      txPayload = { ...transaction, signatory: payer };
    } else {
      const instructions = transaction.instructions.map(inst => serializeInstruction(inst));

      if (feeOption) {
        instructions.unshift(
          serializeInstruction(
            ComputeBudgetProgram.setComputeUnitPrice({
              microLamports: feeOption?.computeUnitPriceMicroLamports,
            }),
          ),
        );
      }

      txPayload = {
        atas: transaction.atas?.map(ata => {
          return {
            address: ata.address.toString(),
            instruction: serializeInstruction(
              splToken.createAssociatedTokenAccountIdempotentInstruction(
                new web3.PublicKey(payer),
                ata.address,
                ata.owner,
                ata.mint,
                ata.programId,
                splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
              ),
            ),
          };
        }),
        instructions,
        clientLookupTables: transaction?.lookupTables ?? [],
        feePayer: payer.toString(),
      };
    }

    const result = (
      await harmony.POST('/v1/simulate', {
        params: { query: { network: network.caipId } },
        body: {
          ...txPayload,
        },
      })
    ).content as unknown as SolanaSimulationResult;

    const { fee: baseFee, compiledTransaction, preventativeAction, status, warnings, effects } = result;

    return {
      data: {
        tx: web3.VersionedTransaction.deserialize(Buffer.from(compiledTransaction, 'base64')),
        fee: baseFee,
      },
      isError: status === 'failure',
      preventativeAction,
      warnings,
      effects,
    };
  }

  async estimateTransactionCost(
    network: SolanaNetwork,
    wallet: WalletData,
    tx: PreparedTransaction<SolanaPreparedTransaction>,
    fee: SolanaFeeOption,
  ): Promise<TotalFee> {
    const computeUnitBudget = 200_000;
    const totalFeeMicroLamports = fee.computeUnitPriceMicroLamports * computeUnitBudget;
    const totalFeeLamports = Math.floor(totalFeeMicroLamports / 1000 / 1000);

    return {
      token: network.nativeTokenCaipId,
      amount: BigNumber.sum(tx.data.fee, totalFeeLamports).toFixed(),
    };
  }

  async estimateDefaultTransactionCost(network: SolanaNetwork): Promise<TotalFee> {
    return {
      token: network.nativeTokenCaipId,
      amount: '5000',
    };
  }
}

export class Solscan implements BlockExplorer {
  constructor(public cluster?: string) {}

  transactionUri(txId: string): string {
    const clusterQuery = this.cluster ? `?cluster=${this.cluster}` : '';
    return `https://solscan.io/tx/${txId}${clusterQuery}`;
  }
}

export class SolanaNetwork implements Network<SolanaPreparedTransaction, SolanaTransactionPlan, SolanaFeeOption> {
  label: string;
  blockExplorer: BlockExplorer;
  caipId: string;
  nativeTokenCaipId: string;
  nativeTokenDecimals: number;
  nativeTokenSymbol: NativeTokenSymbol;
  krakenConnectNetworkId: string = 'ae4e3bdf-b9dd-4bd9-9489-0be0d118a3fd';
  krakenConnectMethodId: string = '8f33e1a7-eb86-4534-8f61-8e9a2759dcc5';
  krakenConnectMethodName: string = 'Solana';
  paymentUriPrefix = 'solana';
  isTestnet: boolean;
  icon: NetworkIcon = ({ opacity }) => ({
    id: 'sol',
    fgColor: ['#8f4cf5', '#08c893', -45],
    bgColor: `rgba(167, 115, 255, ${opacity})`,
  });

  constructor(config: {
    label: string;
    blockExplorer: BlockExplorer;
    caipId: string;
    nativeTokenSymbol: NativeTokenSymbol;
    nativeTokenCaipId: string;
    isTestnet?: boolean;
  }) {
    this.label = config.label;
    this.nativeTokenDecimals = 9;
    this.nativeTokenSymbol = config.nativeTokenSymbol;
    this.caipId = config.caipId;
    this.nativeTokenCaipId = config.nativeTokenCaipId;
    this.blockExplorer = config.blockExplorer;
    this.isTestnet = config.isTestnet ?? false;
  }

  private async getKeypair(data: WalletDataWithSeed): Promise<web3.Keypair> {
    return await getSolanaKeyPair(Buffer.from(data.seed.data).toString('hex'), this.getDerivationPath(data.accountIdx));
  }

  getExtendedPublicKey(seed: ArrayBuffer, accountIdx?: number): ExtendedPublicKeyAndChainCode {
    const keypair = getSolanaKeyPair(Buffer.from(seed).toString('hex'), this.getDerivationPath(accountIdx));
    return { extendedPublicKey: keypair.publicKey.toBuffer() };
  }

  async createSPLTransferTransaction(data: WalletData, to: string, splTokenId: string, amount: StringNumber): Promise<SolanaTransactionPlan> {
    const mintAddress = getMintFromSPLToken(splTokenId);
    const fromWallet = new web3.PublicKey(Buffer.from(data.extendedPublicKey));
    const toPubkey = new web3.PublicKey(to);
    const mintPubkey = new web3.PublicKey(mintAddress);

    const connection = new Connection(clusterApiUrl('mainnet-beta'));

    let programId = splToken.TOKEN_PROGRAM_ID;

    const mintAccountInfo = await connection.getAccountInfo(mintPubkey);
    if (mintAccountInfo) {
      programId = mintAccountInfo.owner.equals(splToken.TOKEN_2022_PROGRAM_ID) ? splToken.TOKEN_2022_PROGRAM_ID : splToken.TOKEN_PROGRAM_ID;
    }

    const fromAtaAccount = await splToken.getAssociatedTokenAddress(mintPubkey, fromWallet, false, programId, splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
    const toAtaAccount = await splToken.getAssociatedTokenAddress(mintPubkey, toPubkey, false, programId, splToken.ASSOCIATED_TOKEN_PROGRAM_ID);

    return {
      atas: [
        {
          address: toAtaAccount,
          mint: mintPubkey,
          owner: toPubkey,
          programId,
        },
      ],
      instructions: [splToken.createTransferInstruction(fromAtaAccount, toAtaAccount, fromWallet, parseInt(amount, 10), [], programId)],
    };
  }

  async createNFTTransferTransaction(data: WalletData, to: string, nft: Realmish<Nft>): Promise<SolanaTransactionPlan> {
    return this.createSPLTransferTransaction(data, to, nft.assetId, '1');
  }

  async createPaymentTransaction(data: WalletData, to: string, amount: StringNumber): Promise<SolanaTransactionPlan> {
    const fromPubkey = new web3.PublicKey(Buffer.from(data.extendedPublicKey));
    const toPubkey = new web3.PublicKey(to);

    return {
      instructions: [
        web3.SystemProgram.transfer({
          fromPubkey: fromPubkey,
          toPubkey: toPubkey,
          lamports: parseInt(amount, 10),
        }),
      ],
    };
  }

  async createTokenTransferTransaction(data: WalletData, to: string, token: RealmToken, amount: StringNumber): Promise<SolanaTransactionPlan> {
    return this.createSPLTransferTransaction(data, to, token.assetId, amount);
  }

  async deriveAddress(data: WalletData): Promise<string> {
    const solanaPublicKey = new web3.PublicKey(Buffer.from(data.extendedPublicKey));
    return solanaPublicKey.toString();
  }

  async deriveAllAddresses(data: WalletData): Promise<string[]> {
    return [await this.deriveAddress(data)];
  }

  getDerivationPath(accountIdx?: number): string {
    return `m/44'/501'/${accountIdx ?? 0}'/0'`;
  }

  isAddressValid(address: string): boolean {
    try {
      return Boolean(new web3.PublicKey(address));
    } catch (_: unknown) {
      return false;
    }
  }

  async signTransaction(data: WalletDataWithSeed, txPayload: SolanaPreparedTransaction): Promise<string> {
    const keyPair = await this.getKeypair(data);

    if ('version' in txPayload.tx) {
      txPayload.tx.sign([keyPair]);

      return Buffer.from(txPayload.tx.serialize()).toString('base64');
    }

    txPayload.tx.sign(keyPair);

    return txPayload.tx.serialize().toString('base64');
  }

  async signMessage(data: WalletDataWithSeed, message: string): Promise<{ signature: string }> {
    const keyPair = await this.getKeypair(data);
    const signature = nacl.sign.detached(bs58.decode(message), keyPair.secretKey);

    return { signature: bs58.encode(signature) };
  }
}
