import { Interface } from 'ethers';

const CRYPTOKITTIES_ADDRESS = '0x06012c8cf97bead5deae237070f9587f8e7a266d';

export function getNFTTransferCall(
  nft: {
    chainId: number;
    contractAddress: string;
    type?: string;
  },
  fromAddress: string,
  toAddress: string,
  tokenId: string,
) {
  if (nft.chainId === 1 && nft.contractAddress.toLowerCase() === CRYPTOKITTIES_ADDRESS) {
    const iface = new Interface(['function transfer(address,uint256)']);
    return iface.encodeFunctionData('transfer', [toAddress, tokenId]);
  } else if (nft?.type === 'erc1155') {
    const iface = new Interface(['function safeTransferFrom(address,address,uint256,uint256,bytes)']);
    return iface.encodeFunctionData('safeTransferFrom', [fromAddress, toAddress, tokenId, 1, '0x']);
  } else if (nft?.type === 'erc721') {
    const iface = new Interface(['function safeTransferFrom(address,address,uint256)']);
    return iface.encodeFunctionData('safeTransferFrom', [fromAddress, toAddress, tokenId]);
  }

  throw new Error('unsupported asset, not a supported NFT');
}

export function getTokenTransferCall(
  nft: {
    chainId: number;
    contractAddress: string;
  },
  fromAddress: string,
  toAddress: string,
  amount: string,
) {
  const iface = new Interface(['function transfer(address,uint256)']);
  return iface.encodeFunctionData('transfer', [toAddress, amount]);
}

export function getEVMNFTProtocolType(caipTokenId: string) {
  const [_, network, erc, contract, tokenId] = caipTokenId.match(/^([^/]+)\/(.+?):(.+?)\/(\d+)$/)!;
  return { network, erc, contract, tokenId };
}
