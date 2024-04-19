/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal.js";
import { Any } from "./google/protobuf/any";

export const protobufPackage = "pocketjs";

export interface ProtoStdTx {
  msg: Any | undefined;
  fee: Coin[];
  signature: ProtoStdSignature | undefined;
  memo: string;
  entropy: number;
}

export interface ProtoStdSignature {
  publicKey: Uint8Array;
  Signature: Uint8Array;
}

export interface StdSignDoc {
  ChainID: string;
  fee: Uint8Array;
  memo: string;
  msg: Uint8Array;
  entropy: number;
}

export interface Coin {
  denom: string;
  amount: string;
}

/**
 * DecCoin defines a token with a denomination and a decimal amount.
 *
 * NOTE: The amount field is an Dec which implements the custom method
 * signatures required by gogoproto.
 */
export interface DecCoin {
  denom: string;
  amount: string;
}

export interface MsgProtoStake {
  pubKey: Uint8Array;
  chains: string[];
  value: string;
}

export interface MsgBeginUnstake {
  Address: Uint8Array;
}

export interface MsgUnjail {
  AppAddr: Uint8Array;
}

export interface MsgProtoNodeStake8 {
  Publickey: Uint8Array;
  Chains: string[];
  value: string;
  ServiceUrl: string;
  OutAddress: Uint8Array;
  RewardDelegators: { [key: string]: number };
}

export interface MsgProtoNodeStake8_RewardDelegatorsEntry {
  key: string;
  value: number;
}

export interface MsgBeginNodeUnstake8 {
  Address: Uint8Array;
  Signer: Uint8Array;
}

export interface MsgNodeUnjail {
  ValidatorAddr: Uint8Array;
}

export interface MsgNodeUnjail8 {
  ValidatorAddr: Uint8Array;
  Signer: Uint8Array;
}

export interface MsgSend {
  FromAddress: Uint8Array;
  ToAddress: Uint8Array;
  amount: string;
}

export interface MsgDAOTransfer {
  fromAddress: Uint8Array;
  toAddress: Uint8Array;
  amount: string;
  action: string;
}

export interface Upgrade {
  height: number;
  version: string;
  oldUpgradeHeight: number;
  features: string[];
}

export interface MsgUpgrade {
  address: Uint8Array;
  upgrade: Upgrade | undefined;
}

export interface MsgChangeParam {
  FromAddress: Uint8Array;
  paramKey: string;
  paramVal: Uint8Array;
}

function createBaseProtoStdTx(): ProtoStdTx {
  return { msg: undefined, fee: [], signature: undefined, memo: "", entropy: 0 };
}

export const ProtoStdTx = {
  encode(message: ProtoStdTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.msg !== undefined) {
      Any.encode(message.msg, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.fee) {
      Coin.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.signature !== undefined) {
      ProtoStdSignature.encode(message.signature, writer.uint32(26).fork()).ldelim();
    }
    if (message.memo !== "") {
      writer.uint32(34).string(message.memo);
    }
    if (message.entropy !== 0) {
      writer.uint32(40).int64(message.entropy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProtoStdTx {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProtoStdTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.msg = Any.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.fee.push(Coin.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.signature = ProtoStdSignature.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.memo = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.entropy = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ProtoStdTx {
    return {
      msg: isSet(object.msg) ? Any.fromJSON(object.msg) : undefined,
      fee: globalThis.Array.isArray(object?.fee) ? object.fee.map((e: any) => Coin.fromJSON(e)) : [],
      signature: isSet(object.signature) ? ProtoStdSignature.fromJSON(object.signature) : undefined,
      memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
      entropy: isSet(object.entropy) ? globalThis.Number(object.entropy) : 0,
    };
  },

  toJSON(message: ProtoStdTx): unknown {
    const obj: any = {};
    if (message.msg !== undefined) {
      obj.msg = Any.toJSON(message.msg);
    }
    if (message.fee?.length) {
      obj.fee = message.fee.map((e) => Coin.toJSON(e));
    }
    if (message.signature !== undefined) {
      obj.signature = ProtoStdSignature.toJSON(message.signature);
    }
    if (message.memo !== "") {
      obj.memo = message.memo;
    }
    if (message.entropy !== 0) {
      obj.entropy = Math.round(message.entropy);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProtoStdTx>, I>>(base?: I): ProtoStdTx {
    return ProtoStdTx.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProtoStdTx>, I>>(object: I): ProtoStdTx {
    const message = createBaseProtoStdTx();
    message.msg = (object.msg !== undefined && object.msg !== null) ? Any.fromPartial(object.msg) : undefined;
    message.fee = object.fee?.map((e) => Coin.fromPartial(e)) || [];
    message.signature = (object.signature !== undefined && object.signature !== null)
      ? ProtoStdSignature.fromPartial(object.signature)
      : undefined;
    message.memo = object.memo ?? "";
    message.entropy = object.entropy ?? 0;
    return message;
  },
};

function createBaseProtoStdSignature(): ProtoStdSignature {
  return { publicKey: new Uint8Array(0), Signature: new Uint8Array(0) };
}

export const ProtoStdSignature = {
  encode(message: ProtoStdSignature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey.length !== 0) {
      writer.uint32(10).bytes(message.publicKey);
    }
    if (message.Signature.length !== 0) {
      writer.uint32(18).bytes(message.Signature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProtoStdSignature {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProtoStdSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicKey = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.Signature = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ProtoStdSignature {
    return {
      publicKey: isSet(object.publicKey) ? bytesFromBase64(object.publicKey) : new Uint8Array(0),
      Signature: isSet(object.Signature) ? bytesFromBase64(object.Signature) : new Uint8Array(0),
    };
  },

  toJSON(message: ProtoStdSignature): unknown {
    const obj: any = {};
    if (message.publicKey.length !== 0) {
      obj.publicKey = base64FromBytes(message.publicKey);
    }
    if (message.Signature.length !== 0) {
      obj.Signature = base64FromBytes(message.Signature);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProtoStdSignature>, I>>(base?: I): ProtoStdSignature {
    return ProtoStdSignature.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProtoStdSignature>, I>>(object: I): ProtoStdSignature {
    const message = createBaseProtoStdSignature();
    message.publicKey = object.publicKey ?? new Uint8Array(0);
    message.Signature = object.Signature ?? new Uint8Array(0);
    return message;
  },
};

function createBaseStdSignDoc(): StdSignDoc {
  return { ChainID: "", fee: new Uint8Array(0), memo: "", msg: new Uint8Array(0), entropy: 0 };
}

export const StdSignDoc = {
  encode(message: StdSignDoc, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ChainID !== "") {
      writer.uint32(10).string(message.ChainID);
    }
    if (message.fee.length !== 0) {
      writer.uint32(18).bytes(message.fee);
    }
    if (message.memo !== "") {
      writer.uint32(26).string(message.memo);
    }
    if (message.msg.length !== 0) {
      writer.uint32(34).bytes(message.msg);
    }
    if (message.entropy !== 0) {
      writer.uint32(40).int64(message.entropy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StdSignDoc {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStdSignDoc();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ChainID = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.fee = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.memo = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.msg = reader.bytes();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.entropy = longToNumber(reader.int64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StdSignDoc {
    return {
      ChainID: isSet(object.ChainID) ? globalThis.String(object.ChainID) : "",
      fee: isSet(object.fee) ? bytesFromBase64(object.fee) : new Uint8Array(0),
      memo: isSet(object.memo) ? globalThis.String(object.memo) : "",
      msg: isSet(object.msg) ? bytesFromBase64(object.msg) : new Uint8Array(0),
      entropy: isSet(object.entropy) ? globalThis.Number(object.entropy) : 0,
    };
  },

  toJSON(message: StdSignDoc): unknown {
    const obj: any = {};
    if (message.ChainID !== "") {
      obj.ChainID = message.ChainID;
    }
    if (message.fee.length !== 0) {
      obj.fee = base64FromBytes(message.fee);
    }
    if (message.memo !== "") {
      obj.memo = message.memo;
    }
    if (message.msg.length !== 0) {
      obj.msg = base64FromBytes(message.msg);
    }
    if (message.entropy !== 0) {
      obj.entropy = Math.round(message.entropy);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StdSignDoc>, I>>(base?: I): StdSignDoc {
    return StdSignDoc.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StdSignDoc>, I>>(object: I): StdSignDoc {
    const message = createBaseStdSignDoc();
    message.ChainID = object.ChainID ?? "";
    message.fee = object.fee ?? new Uint8Array(0);
    message.memo = object.memo ?? "";
    message.msg = object.msg ?? new Uint8Array(0);
    message.entropy = object.entropy ?? 0;
    return message;
  },
};

function createBaseCoin(): Coin {
  return { denom: "", amount: "" };
}

export const Coin = {
  encode(message: Coin, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Coin {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCoin();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.denom = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.amount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Coin {
    return {
      denom: isSet(object.denom) ? globalThis.String(object.denom) : "",
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
    };
  },

  toJSON(message: Coin): unknown {
    const obj: any = {};
    if (message.denom !== "") {
      obj.denom = message.denom;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Coin>, I>>(base?: I): Coin {
    return Coin.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Coin>, I>>(object: I): Coin {
    const message = createBaseCoin();
    message.denom = object.denom ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
};

function createBaseDecCoin(): DecCoin {
  return { denom: "", amount: "" };
}

export const DecCoin = {
  encode(message: DecCoin, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.denom !== "") {
      writer.uint32(10).string(message.denom);
    }
    if (message.amount !== "") {
      writer.uint32(18).string(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecCoin {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecCoin();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.denom = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.amount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DecCoin {
    return {
      denom: isSet(object.denom) ? globalThis.String(object.denom) : "",
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
    };
  },

  toJSON(message: DecCoin): unknown {
    const obj: any = {};
    if (message.denom !== "") {
      obj.denom = message.denom;
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DecCoin>, I>>(base?: I): DecCoin {
    return DecCoin.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DecCoin>, I>>(object: I): DecCoin {
    const message = createBaseDecCoin();
    message.denom = object.denom ?? "";
    message.amount = object.amount ?? "";
    return message;
  },
};

function createBaseMsgProtoStake(): MsgProtoStake {
  return { pubKey: new Uint8Array(0), chains: [], value: "" };
}

export const MsgProtoStake = {
  encode(message: MsgProtoStake, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pubKey.length !== 0) {
      writer.uint32(10).bytes(message.pubKey);
    }
    for (const v of message.chains) {
      writer.uint32(18).string(v!);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgProtoStake {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgProtoStake();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pubKey = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.chains.push(reader.string());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.value = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgProtoStake {
    return {
      pubKey: isSet(object.pubKey) ? bytesFromBase64(object.pubKey) : new Uint8Array(0),
      chains: globalThis.Array.isArray(object?.chains) ? object.chains.map((e: any) => globalThis.String(e)) : [],
      value: isSet(object.value) ? globalThis.String(object.value) : "",
    };
  },

  toJSON(message: MsgProtoStake): unknown {
    const obj: any = {};
    if (message.pubKey.length !== 0) {
      obj.pubKey = base64FromBytes(message.pubKey);
    }
    if (message.chains?.length) {
      obj.chains = message.chains;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgProtoStake>, I>>(base?: I): MsgProtoStake {
    return MsgProtoStake.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgProtoStake>, I>>(object: I): MsgProtoStake {
    const message = createBaseMsgProtoStake();
    message.pubKey = object.pubKey ?? new Uint8Array(0);
    message.chains = object.chains?.map((e) => e) || [];
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseMsgBeginUnstake(): MsgBeginUnstake {
  return { Address: new Uint8Array(0) };
}

export const MsgBeginUnstake = {
  encode(message: MsgBeginUnstake, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Address.length !== 0) {
      writer.uint32(10).bytes(message.Address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBeginUnstake {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBeginUnstake();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Address = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgBeginUnstake {
    return { Address: isSet(object.Address) ? bytesFromBase64(object.Address) : new Uint8Array(0) };
  },

  toJSON(message: MsgBeginUnstake): unknown {
    const obj: any = {};
    if (message.Address.length !== 0) {
      obj.Address = base64FromBytes(message.Address);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgBeginUnstake>, I>>(base?: I): MsgBeginUnstake {
    return MsgBeginUnstake.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgBeginUnstake>, I>>(object: I): MsgBeginUnstake {
    const message = createBaseMsgBeginUnstake();
    message.Address = object.Address ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgUnjail(): MsgUnjail {
  return { AppAddr: new Uint8Array(0) };
}

export const MsgUnjail = {
  encode(message: MsgUnjail, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.AppAddr.length !== 0) {
      writer.uint32(10).bytes(message.AppAddr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUnjail {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUnjail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.AppAddr = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUnjail {
    return { AppAddr: isSet(object.AppAddr) ? bytesFromBase64(object.AppAddr) : new Uint8Array(0) };
  },

  toJSON(message: MsgUnjail): unknown {
    const obj: any = {};
    if (message.AppAddr.length !== 0) {
      obj.AppAddr = base64FromBytes(message.AppAddr);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUnjail>, I>>(base?: I): MsgUnjail {
    return MsgUnjail.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUnjail>, I>>(object: I): MsgUnjail {
    const message = createBaseMsgUnjail();
    message.AppAddr = object.AppAddr ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgProtoNodeStake8(): MsgProtoNodeStake8 {
  return {
    Publickey: new Uint8Array(0),
    Chains: [],
    value: "",
    ServiceUrl: "",
    OutAddress: new Uint8Array(0),
    RewardDelegators: {},
  };
}

export const MsgProtoNodeStake8 = {
  encode(message: MsgProtoNodeStake8, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Publickey.length !== 0) {
      writer.uint32(10).bytes(message.Publickey);
    }
    for (const v of message.Chains) {
      writer.uint32(18).string(v!);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    if (message.ServiceUrl !== "") {
      writer.uint32(34).string(message.ServiceUrl);
    }
    if (message.OutAddress.length !== 0) {
      writer.uint32(42).bytes(message.OutAddress);
    }
    Object.entries(message.RewardDelegators).forEach(([key, value]) => {
      MsgProtoNodeStake8_RewardDelegatorsEntry.encode({ key: key as any, value }, writer.uint32(50).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgProtoNodeStake8 {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgProtoNodeStake8();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Publickey = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.Chains.push(reader.string());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.value = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.ServiceUrl = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.OutAddress = reader.bytes();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          const entry6 = MsgProtoNodeStake8_RewardDelegatorsEntry.decode(reader, reader.uint32());
          if (entry6.value !== undefined) {
            message.RewardDelegators[entry6.key] = entry6.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgProtoNodeStake8 {
    return {
      Publickey: isSet(object.Publickey) ? bytesFromBase64(object.Publickey) : new Uint8Array(0),
      Chains: globalThis.Array.isArray(object?.Chains) ? object.Chains.map((e: any) => globalThis.String(e)) : [],
      value: isSet(object.value) ? globalThis.String(object.value) : "",
      ServiceUrl: isSet(object.ServiceUrl) ? globalThis.String(object.ServiceUrl) : "",
      OutAddress: isSet(object.OutAddress) ? bytesFromBase64(object.OutAddress) : new Uint8Array(0),
      RewardDelegators: isObject(object.RewardDelegators)
        ? Object.entries(object.RewardDelegators).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: MsgProtoNodeStake8): unknown {
    const obj: any = {};
    if (message.Publickey.length !== 0) {
      obj.Publickey = base64FromBytes(message.Publickey);
    }
    if (message.Chains?.length) {
      obj.Chains = message.Chains;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.ServiceUrl !== "") {
      obj.ServiceUrl = message.ServiceUrl;
    }
    if (message.OutAddress.length !== 0) {
      obj.OutAddress = base64FromBytes(message.OutAddress);
    }
    if (message.RewardDelegators) {
      const entries = Object.entries(message.RewardDelegators);
      if (entries.length > 0) {
        obj.RewardDelegators = {};
        entries.forEach(([k, v]) => {
          obj.RewardDelegators[k] = Math.round(v);
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgProtoNodeStake8>, I>>(base?: I): MsgProtoNodeStake8 {
    return MsgProtoNodeStake8.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgProtoNodeStake8>, I>>(object: I): MsgProtoNodeStake8 {
    const message = createBaseMsgProtoNodeStake8();
    message.Publickey = object.Publickey ?? new Uint8Array(0);
    message.Chains = object.Chains?.map((e) => e) || [];
    message.value = object.value ?? "";
    message.ServiceUrl = object.ServiceUrl ?? "";
    message.OutAddress = object.OutAddress ?? new Uint8Array(0);
    message.RewardDelegators = Object.entries(object.RewardDelegators ?? {}).reduce<{ [key: string]: number }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = globalThis.Number(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseMsgProtoNodeStake8_RewardDelegatorsEntry(): MsgProtoNodeStake8_RewardDelegatorsEntry {
  return { key: "", value: 0 };
}

export const MsgProtoNodeStake8_RewardDelegatorsEntry = {
  encode(message: MsgProtoNodeStake8_RewardDelegatorsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).uint32(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgProtoNodeStake8_RewardDelegatorsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgProtoNodeStake8_RewardDelegatorsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = reader.uint32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgProtoNodeStake8_RewardDelegatorsEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? globalThis.Number(object.value) : 0,
    };
  },

  toJSON(message: MsgProtoNodeStake8_RewardDelegatorsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgProtoNodeStake8_RewardDelegatorsEntry>, I>>(
    base?: I,
  ): MsgProtoNodeStake8_RewardDelegatorsEntry {
    return MsgProtoNodeStake8_RewardDelegatorsEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgProtoNodeStake8_RewardDelegatorsEntry>, I>>(
    object: I,
  ): MsgProtoNodeStake8_RewardDelegatorsEntry {
    const message = createBaseMsgProtoNodeStake8_RewardDelegatorsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? 0;
    return message;
  },
};

function createBaseMsgBeginNodeUnstake8(): MsgBeginNodeUnstake8 {
  return { Address: new Uint8Array(0), Signer: new Uint8Array(0) };
}

export const MsgBeginNodeUnstake8 = {
  encode(message: MsgBeginNodeUnstake8, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.Address.length !== 0) {
      writer.uint32(10).bytes(message.Address);
    }
    if (message.Signer.length !== 0) {
      writer.uint32(18).bytes(message.Signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBeginNodeUnstake8 {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBeginNodeUnstake8();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.Address = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.Signer = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgBeginNodeUnstake8 {
    return {
      Address: isSet(object.Address) ? bytesFromBase64(object.Address) : new Uint8Array(0),
      Signer: isSet(object.Signer) ? bytesFromBase64(object.Signer) : new Uint8Array(0),
    };
  },

  toJSON(message: MsgBeginNodeUnstake8): unknown {
    const obj: any = {};
    if (message.Address.length !== 0) {
      obj.Address = base64FromBytes(message.Address);
    }
    if (message.Signer.length !== 0) {
      obj.Signer = base64FromBytes(message.Signer);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgBeginNodeUnstake8>, I>>(base?: I): MsgBeginNodeUnstake8 {
    return MsgBeginNodeUnstake8.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgBeginNodeUnstake8>, I>>(object: I): MsgBeginNodeUnstake8 {
    const message = createBaseMsgBeginNodeUnstake8();
    message.Address = object.Address ?? new Uint8Array(0);
    message.Signer = object.Signer ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgNodeUnjail(): MsgNodeUnjail {
  return { ValidatorAddr: new Uint8Array(0) };
}

export const MsgNodeUnjail = {
  encode(message: MsgNodeUnjail, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ValidatorAddr.length !== 0) {
      writer.uint32(10).bytes(message.ValidatorAddr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgNodeUnjail {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgNodeUnjail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ValidatorAddr = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgNodeUnjail {
    return { ValidatorAddr: isSet(object.ValidatorAddr) ? bytesFromBase64(object.ValidatorAddr) : new Uint8Array(0) };
  },

  toJSON(message: MsgNodeUnjail): unknown {
    const obj: any = {};
    if (message.ValidatorAddr.length !== 0) {
      obj.ValidatorAddr = base64FromBytes(message.ValidatorAddr);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgNodeUnjail>, I>>(base?: I): MsgNodeUnjail {
    return MsgNodeUnjail.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgNodeUnjail>, I>>(object: I): MsgNodeUnjail {
    const message = createBaseMsgNodeUnjail();
    message.ValidatorAddr = object.ValidatorAddr ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgNodeUnjail8(): MsgNodeUnjail8 {
  return { ValidatorAddr: new Uint8Array(0), Signer: new Uint8Array(0) };
}

export const MsgNodeUnjail8 = {
  encode(message: MsgNodeUnjail8, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ValidatorAddr.length !== 0) {
      writer.uint32(10).bytes(message.ValidatorAddr);
    }
    if (message.Signer.length !== 0) {
      writer.uint32(18).bytes(message.Signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgNodeUnjail8 {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgNodeUnjail8();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.ValidatorAddr = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.Signer = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgNodeUnjail8 {
    return {
      ValidatorAddr: isSet(object.ValidatorAddr) ? bytesFromBase64(object.ValidatorAddr) : new Uint8Array(0),
      Signer: isSet(object.Signer) ? bytesFromBase64(object.Signer) : new Uint8Array(0),
    };
  },

  toJSON(message: MsgNodeUnjail8): unknown {
    const obj: any = {};
    if (message.ValidatorAddr.length !== 0) {
      obj.ValidatorAddr = base64FromBytes(message.ValidatorAddr);
    }
    if (message.Signer.length !== 0) {
      obj.Signer = base64FromBytes(message.Signer);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgNodeUnjail8>, I>>(base?: I): MsgNodeUnjail8 {
    return MsgNodeUnjail8.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgNodeUnjail8>, I>>(object: I): MsgNodeUnjail8 {
    const message = createBaseMsgNodeUnjail8();
    message.ValidatorAddr = object.ValidatorAddr ?? new Uint8Array(0);
    message.Signer = object.Signer ?? new Uint8Array(0);
    return message;
  },
};

function createBaseMsgSend(): MsgSend {
  return { FromAddress: new Uint8Array(0), ToAddress: new Uint8Array(0), amount: "" };
}

export const MsgSend = {
  encode(message: MsgSend, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.FromAddress.length !== 0) {
      writer.uint32(10).bytes(message.FromAddress);
    }
    if (message.ToAddress.length !== 0) {
      writer.uint32(18).bytes(message.ToAddress);
    }
    if (message.amount !== "") {
      writer.uint32(26).string(message.amount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSend {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSend();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.FromAddress = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.ToAddress = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.amount = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSend {
    return {
      FromAddress: isSet(object.FromAddress) ? bytesFromBase64(object.FromAddress) : new Uint8Array(0),
      ToAddress: isSet(object.ToAddress) ? bytesFromBase64(object.ToAddress) : new Uint8Array(0),
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
    };
  },

  toJSON(message: MsgSend): unknown {
    const obj: any = {};
    if (message.FromAddress.length !== 0) {
      obj.FromAddress = base64FromBytes(message.FromAddress);
    }
    if (message.ToAddress.length !== 0) {
      obj.ToAddress = base64FromBytes(message.ToAddress);
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSend>, I>>(base?: I): MsgSend {
    return MsgSend.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSend>, I>>(object: I): MsgSend {
    const message = createBaseMsgSend();
    message.FromAddress = object.FromAddress ?? new Uint8Array(0);
    message.ToAddress = object.ToAddress ?? new Uint8Array(0);
    message.amount = object.amount ?? "";
    return message;
  },
};

function createBaseMsgDAOTransfer(): MsgDAOTransfer {
  return { fromAddress: new Uint8Array(0), toAddress: new Uint8Array(0), amount: "", action: "" };
}

export const MsgDAOTransfer = {
  encode(message: MsgDAOTransfer, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fromAddress.length !== 0) {
      writer.uint32(10).bytes(message.fromAddress);
    }
    if (message.toAddress.length !== 0) {
      writer.uint32(18).bytes(message.toAddress);
    }
    if (message.amount !== "") {
      writer.uint32(26).string(message.amount);
    }
    if (message.action !== "") {
      writer.uint32(34).string(message.action);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDAOTransfer {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDAOTransfer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.fromAddress = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.toAddress = reader.bytes();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.amount = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.action = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgDAOTransfer {
    return {
      fromAddress: isSet(object.fromAddress) ? bytesFromBase64(object.fromAddress) : new Uint8Array(0),
      toAddress: isSet(object.toAddress) ? bytesFromBase64(object.toAddress) : new Uint8Array(0),
      amount: isSet(object.amount) ? globalThis.String(object.amount) : "",
      action: isSet(object.action) ? globalThis.String(object.action) : "",
    };
  },

  toJSON(message: MsgDAOTransfer): unknown {
    const obj: any = {};
    if (message.fromAddress.length !== 0) {
      obj.fromAddress = base64FromBytes(message.fromAddress);
    }
    if (message.toAddress.length !== 0) {
      obj.toAddress = base64FromBytes(message.toAddress);
    }
    if (message.amount !== "") {
      obj.amount = message.amount;
    }
    if (message.action !== "") {
      obj.action = message.action;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDAOTransfer>, I>>(base?: I): MsgDAOTransfer {
    return MsgDAOTransfer.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDAOTransfer>, I>>(object: I): MsgDAOTransfer {
    const message = createBaseMsgDAOTransfer();
    message.fromAddress = object.fromAddress ?? new Uint8Array(0);
    message.toAddress = object.toAddress ?? new Uint8Array(0);
    message.amount = object.amount ?? "";
    message.action = object.action ?? "";
    return message;
  },
};

function createBaseUpgrade(): Upgrade {
  return { height: 0, version: "", oldUpgradeHeight: 0, features: [] };
}

export const Upgrade = {
  encode(message: Upgrade, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.height !== 0) {
      writer.uint32(8).int64(message.height);
    }
    if (message.version !== "") {
      writer.uint32(18).string(message.version);
    }
    if (message.oldUpgradeHeight !== 0) {
      writer.uint32(24).int64(message.oldUpgradeHeight);
    }
    for (const v of message.features) {
      writer.uint32(34).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Upgrade {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpgrade();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.height = longToNumber(reader.int64() as Long);
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.version = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.oldUpgradeHeight = longToNumber(reader.int64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.features.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Upgrade {
    return {
      height: isSet(object.height) ? globalThis.Number(object.height) : 0,
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      oldUpgradeHeight: isSet(object.oldUpgradeHeight) ? globalThis.Number(object.oldUpgradeHeight) : 0,
      features: globalThis.Array.isArray(object?.features) ? object.features.map((e: any) => globalThis.String(e)) : [],
    };
  },

  toJSON(message: Upgrade): unknown {
    const obj: any = {};
    if (message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.oldUpgradeHeight !== 0) {
      obj.oldUpgradeHeight = Math.round(message.oldUpgradeHeight);
    }
    if (message.features?.length) {
      obj.features = message.features;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Upgrade>, I>>(base?: I): Upgrade {
    return Upgrade.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Upgrade>, I>>(object: I): Upgrade {
    const message = createBaseUpgrade();
    message.height = object.height ?? 0;
    message.version = object.version ?? "";
    message.oldUpgradeHeight = object.oldUpgradeHeight ?? 0;
    message.features = object.features?.map((e) => e) || [];
    return message;
  },
};

function createBaseMsgUpgrade(): MsgUpgrade {
  return { address: new Uint8Array(0), upgrade: undefined };
}

export const MsgUpgrade = {
  encode(message: MsgUpgrade, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address.length !== 0) {
      writer.uint32(10).bytes(message.address);
    }
    if (message.upgrade !== undefined) {
      Upgrade.encode(message.upgrade, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpgrade {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpgrade();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.upgrade = Upgrade.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpgrade {
    return {
      address: isSet(object.address) ? bytesFromBase64(object.address) : new Uint8Array(0),
      upgrade: isSet(object.upgrade) ? Upgrade.fromJSON(object.upgrade) : undefined,
    };
  },

  toJSON(message: MsgUpgrade): unknown {
    const obj: any = {};
    if (message.address.length !== 0) {
      obj.address = base64FromBytes(message.address);
    }
    if (message.upgrade !== undefined) {
      obj.upgrade = Upgrade.toJSON(message.upgrade);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpgrade>, I>>(base?: I): MsgUpgrade {
    return MsgUpgrade.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpgrade>, I>>(object: I): MsgUpgrade {
    const message = createBaseMsgUpgrade();
    message.address = object.address ?? new Uint8Array(0);
    message.upgrade = (object.upgrade !== undefined && object.upgrade !== null)
      ? Upgrade.fromPartial(object.upgrade)
      : undefined;
    return message;
  },
};

function createBaseMsgChangeParam(): MsgChangeParam {
  return { FromAddress: new Uint8Array(0), paramKey: "", paramVal: new Uint8Array(0) };
}

export const MsgChangeParam = {
  encode(message: MsgChangeParam, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.FromAddress.length !== 0) {
      writer.uint32(10).bytes(message.FromAddress);
    }
    if (message.paramKey !== "") {
      writer.uint32(18).string(message.paramKey);
    }
    if (message.paramVal.length !== 0) {
      writer.uint32(26).bytes(message.paramVal);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgChangeParam {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgChangeParam();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.FromAddress = reader.bytes();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.paramKey = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.paramVal = reader.bytes();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgChangeParam {
    return {
      FromAddress: isSet(object.FromAddress) ? bytesFromBase64(object.FromAddress) : new Uint8Array(0),
      paramKey: isSet(object.paramKey) ? globalThis.String(object.paramKey) : "",
      paramVal: isSet(object.paramVal) ? bytesFromBase64(object.paramVal) : new Uint8Array(0),
    };
  },

  toJSON(message: MsgChangeParam): unknown {
    const obj: any = {};
    if (message.FromAddress.length !== 0) {
      obj.FromAddress = base64FromBytes(message.FromAddress);
    }
    if (message.paramKey !== "") {
      obj.paramKey = message.paramKey;
    }
    if (message.paramVal.length !== 0) {
      obj.paramVal = base64FromBytes(message.paramVal);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgChangeParam>, I>>(base?: I): MsgChangeParam {
    return MsgChangeParam.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgChangeParam>, I>>(object: I): MsgChangeParam {
    const message = createBaseMsgChangeParam();
    message.FromAddress = object.FromAddress ?? new Uint8Array(0);
    message.paramKey = object.paramKey ?? "";
    message.paramVal = object.paramVal ?? new Uint8Array(0);
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}