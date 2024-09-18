export const TYPE_ERC721 = 'erc721';
export const TYPE_ERC1155 = 'erc1155';








export enum TRANSACTION_TYPES {
  CONTRACT_INTERACTION = 'contract-interaction',
  MINT = 'mint',
  NFT_MINT = 'nft-mint',
  NFT_BUY = 'nft-buy',
  NFT_SELL = 'nft-sell',
  DEPOSIT = 'deposit',
  RECEIVE = 'receive',
  NFT_RECEIVE = 'nft-receive',
  SEND = 'send',
  NFT_SEND = 'nft-send',
  SWAP = 'swap',
  
  
  
  TOKEN_APPROVAL = 'token-approval', 
  TOKEN_APPROVAL_UNLIMITED = 'token-approval-unlimited', 
}


export enum TRANSACTION_PENDING_TYPES {
  SEND = 'pending-send',
  RECEIVE = 'pending-receive',
}
