// source: https://github.com/pokt-network/pocket-js/blob/main/packages/transaction-builder/src/models/msgs/msg-proto-send.ts
import { Buffer } from 'buffer'
import { Any } from './generated/google/protobuf/any'
import { MsgSend } from './generated/tx-signer'

/**
 * Model representing a MsgSend to send POKT from one account to another
 */
export class MsgProtoSend {
  public readonly fromAddress: string
  public readonly toAddress: string
  public readonly amount: string
  public readonly KEY: string = '/x.nodes.MsgSend'
  public readonly AMINO_KEY: string = 'pos/Send'

  /**
   * Constructor this message
   * @param {string} fromAddress - Origin address
   * @param {string} toAddress - Destination address
   * @param {string} amount - Amount to be sent, needs to be a valid number greater than 0
   * @param {CoinDenom | undefined} amountDenom  - Amount value denomination
   */
  public constructor(fromAddress: string, toAddress: string, amount: string) {
    this.fromAddress = fromAddress
    this.toAddress = toAddress
    this.amount = amount

    if (fromAddress === toAddress) {
      throw new Error('fromAddress cannot be equal to toAddress')
    }

    const amountNumber = Number(this.amount)

    if (isNaN(amountNumber)) {
      throw new Error('Amount is not a valid number')
    } else if (amountNumber < 0) {
      throw new Error('Amount < 0')
    }
  }
  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {object} - Msg type key value.
   * @memberof MsgSend
   */
  public toStdSignDocMsgObj(): object {
    return {
      type: this.AMINO_KEY,
      value: {
        amount: this.amount,
        from_address: this.fromAddress.toLowerCase(),
        to_address: this.toAddress.toLowerCase(),
      },
    }
  }

  /**
   * Converts an Msg Object to StdSignDoc
   * @returns {any} - Msg type key value.
   * @memberof MsgSend
   */
  public toStdTxMsgObj(): any {
    const data = {
      FromAddress: Buffer.from(this.fromAddress, 'hex'),
      ToAddress: Buffer.from(this.toAddress, 'hex'),
      amount: this.amount,
    }

    const result = Any.fromJSON({
      typeUrl: this.KEY,
      value: Buffer.from(MsgSend.encode(data).finish()).toString('base64'),
    })

    return result
  }
}