


export interface paths {
  "/v1/analyse/address": {
    
    post: operations["AnalyseAddress"];
  };
  "/v1/analyse/domains": {
    
    post: operations["AnalyseDomains"];
  };
  "/v1/analyse/url": {
    
    post: operations["AnalyseUrl"];
  };
  "/v1/balances": {
    
    get: operations["GetBalances"];
  };
  "/v1/broadcast": {
    
    post: operations["Broadcast"];
  };
  "/v1/explore": {
    
    get: operations["GetMainPageContent"];
  };
  "/v1/explore/{pageSlug}": {
    
    get: operations["GetPageContentBySlug"];
  };
  "/v1/fee": {
    
    get: operations["GetFees"];
  };
  "/v1/nfts": {
    
    get: operations["GetNfts"];
  };
  "/v1/positions": {
    
    get: operations["GetPositions"];
  };
  "/v2/positions": {
    
    get: operations["GetPositionsV2"];
  };
  "/pow/request": {
    
    post: operations["GetChallenge"];
  };
  "/pow/submit": {
    
    post: operations["SubmitSolution"];
  };
  "/v1/price": {
    
    get: operations["GetPriceData"];
  };
  "/v2/price": {
    
    get: operations["GetPriceDataV2"];
  };
  "/v1/priceHistory": {
    
    get: operations["GetPriceHistoryData"];
  };
  "/v1/resolveAddressLabels": {
    
    get: operations["ResolveEnsAddresses"];
  };
  "/v1/resolveName": {
    
    get: operations["ResolveEnsName"];
  };
  "/v1/simulate": {
    
    post: operations["Simulate"];
  };
  "/v1/tokenlist": {
    
    get: operations["GetTokenList"];
  };
  "/v1/tokenMarketData": {
    
    get: operations["GetTokenMarketData"];
  };
  "/v1/tokenMetadata": {
    
    get: operations["GetTokenMetadata"];
  };
  "/v1/transactions": {
    
    get: operations["GetTransactions"];
  };
  "/v1/transaction": {
    
    get: operations["GetTransactionStatus"];
  };
  "/v1/utxo": {
    
    get: operations["GetUtxo"];
  };
  "/version": {
    
    get: operations["GetVersion"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    AddressAnalysisWarning: {
      
      severity: "CRITICAL" | "WARNING" | "INFO";
      message: string;
    };
    AddressAnalysisInfo: {
      
      prevSendCount?: number;
    };
    AnalyseAddressResult: {
      address: string;
      network: string;
      warnings: components["schemas"]["AddressAnalysisWarning"][];
      info: components["schemas"]["AddressAnalysisInfo"];
    };
    "Result_AnalyseAddressResult-Array_": {
      content: components["schemas"]["AnalyseAddressResult"][];
    };
    ErrorResult: {
      message: string;
      params?: string;
    };
    DomainAnalysisWarning: {
      
      severity: "CRITICAL" | "WARNING";
      message: string;
    };
    DomainAnalysis: {
      domain: string;
      
      status: "PROCESSED" | "PROCESSING" | "UNPROCESSABLE";
      warnings: components["schemas"]["DomainAnalysisWarning"][];
    };
    AnalyseDomainsResult: {
      analyses: components["schemas"]["DomainAnalysis"][];
    };
    Result_AnalyseDomainsResult_: {
      content: components["schemas"]["AnalyseDomainsResult"];
    };
    AnalyseUrlResult: {
      url: string;
      isMalicious: boolean | null;
    };
    Result_AnalyseUrlResult_: {
      content: components["schemas"]["AnalyseUrlResult"];
    };
    BlockChainExplorer: {
      url: string;
      name: string;
    };
    SocialLink: {
      url: string;
      name: string;
    };
    TokenReputation: {
      tokenLists: string[];
    } | {
      blacklists: string[];
    };
    TokenMetadata: {
      isSpam?: boolean;
      reputation?: components["schemas"]["TokenReputation"];
      tokenAddress?: string;
      links?: components["schemas"]["SocialLink"][];
      explorers?: components["schemas"]["BlockChainExplorer"][];
      description?: string;
      priceUSD?: string;
      logoUrl?: string;
      subLabels?: string[];
      label?: string;
      symbol?: string;
      
      decimals: number;
    };
    
    InternalBalance: {
      token: string;
      value: string;
      metadata?: components["schemas"]["TokenMetadata"];
    };
    "Result_InternalBalance-Array_": {
      content: components["schemas"]["InternalBalance"][];
    };
    BroadcastReceipt: {
      transactionId: string;
    };
    Result_BroadcastReceipt_: {
      content: components["schemas"]["BroadcastReceipt"];
    };
    
    "ExploreContentVariant.Text": "Text";
    
    ExploreTextContent: {
      body?: string;
      title?: string;
      id: string;
    };
    ExploreTextContentRow: {
      content: components["schemas"]["ExploreTextContent"][];
      variant: components["schemas"]["ExploreContentVariant.Text"];
      id: string;
    };
    
    "ExploreContentVariant.Card": "Card";
    
    ExploreCardSize: "Large" | "Medium" | "Small";
    ExploreLinkExternal: {
      text: string;
      
      isInternal: false;
      url: string;
    };
    ExploreLinkInternal: {
      text: string;
      
      isInternal: true;
      slug: string;
    };
    ExploreLink: components["schemas"]["ExploreLinkExternal"] | components["schemas"]["ExploreLinkInternal"];
    ExploreCardContent: {
      link?: components["schemas"]["ExploreLink"];
      buttonLink?: string;
      buttonText?: string;
      floatingIcon?: string;
      background: string;
      size: components["schemas"]["ExploreCardSize"];
      body?: string;
      title?: string;
      id: string;
    };
    ExploreCardContentRow: {
      content: components["schemas"]["ExploreCardContent"][];
      variant: components["schemas"]["ExploreContentVariant.Card"];
      id: string;
    };
    
    "ExploreContentVariant.List": "List";
    
    ExploreListIconVariant: "Square" | "RoudedCorners" | "Circle";
    ExploreListItemContent: {
      link?: components["schemas"]["ExploreLink"];
      buttonLink?: string;
      buttonText?: string;
      iconVariant?: components["schemas"]["ExploreListIconVariant"];
      icon?: string;
      body?: string;
      title?: string;
      id: string;
    };
    ExploreListContent: {
      items: components["schemas"]["ExploreListItemContent"][];
      title?: string;
      id: string;
    };
    ExploreListContentRow: {
      content: components["schemas"]["ExploreListContent"][];
      variant: components["schemas"]["ExploreContentVariant.List"];
      id: string;
    };
    
    "ExploreContentVariant.Hero": "Hero";
    
    ExploreHeroVariant: "Card" | "FullBleed";
    ExploreHeroContent: {
      cta?: components["schemas"]["ExploreListItemContent"];
      background: string;
      body?: string;
      title: string;
      variant: components["schemas"]["ExploreHeroVariant"];
      id: string;
    };
    ExploreHeroContentRow: {
      content: components["schemas"]["ExploreHeroContent"][];
      variant: components["schemas"]["ExploreContentVariant.Hero"];
      id: string;
    };
    
    ExploreContentRow: components["schemas"]["ExploreTextContentRow"] | components["schemas"]["ExploreCardContentRow"] | components["schemas"]["ExploreListContentRow"] | components["schemas"]["ExploreHeroContentRow"];
    "Result_ExploreContentRow-Array_": {
      content: components["schemas"]["ExploreContentRow"][];
    };
    
    FeeOptionKind: "slow" | "medium" | "fast" | "default";
    DefaultFeeOption: {
      
      estimatedTimeBlocks?: number;
      token: string;
      amount: string;
      kind: components["schemas"]["FeeOptionKind"];
    };
    EVMFeeOption1559: {
      
      estimatedTimeBlocks?: number;
      
      is1559: true;
      kind: components["schemas"]["FeeOptionKind"];
      maxPriorityFeePerGas: string;
      maxFeePerGas: string;
    };
    EVMFeeOptionPre1559: {
      
      estimatedTimeBlocks?: number;
      
      is1559: false;
      kind: components["schemas"]["FeeOptionKind"];
      fee: string;
    };
    EVMFeeOption: components["schemas"]["EVMFeeOption1559"] | components["schemas"]["EVMFeeOptionPre1559"];
    SolanaFeeOption: {
      
      estimatedTimeBlocks?: number;
      kind: components["schemas"]["FeeOptionKind"];
      
      computeUnitPriceMicroLamports: number;
      
      computeUnitLimit: number;
    };
    FeeOption: components["schemas"]["DefaultFeeOption"] | components["schemas"]["EVMFeeOption"] | components["schemas"]["SolanaFeeOption"];
    "Result_FeeOption-Array_": {
      content: components["schemas"]["FeeOption"][];
    };
    
    NFT: {
      
      amount?: number;
      token: string;
    };
    "Result_NFT-Array_": {
      content: components["schemas"]["NFT"][];
    };
    ProtocolPositionToken: {
      address: string;
      network: string;
      symbol: string;
      
      decimals: number;
      
      price: number;
      tokens?: components["schemas"]["ProtocolPositionToken"][];
      
      balanceUsdValue?: number;
      
      balance?: number;
    };
    ProtocolTypedLabel: {
      label: string | number;
      
      type?: "dollar" | "pct";
    };
    ProtocolAncillaryStat: {
      label: string;
      value: string | number;
      
      type?: "string" | "number" | "dollar" | "pct" | "translation";
    };
    ProtocolPositionMetadata: {
      label?: string;
      subLabels?: components["schemas"]["ProtocolTypedLabel"][];
      imageUrls?: string[];
      pricePerShare?: number[];
      ancillaryStats?: components["schemas"]["ProtocolAncillaryStat"][];
    };
    ProtocolPosition: {
      
      type: "app-token" | "contract-position";
      network: string;
      address: string;
      category: string;
      usdValue: string | number;
      tokens: components["schemas"]["ProtocolPositionToken"][];
      metadata: components["schemas"]["ProtocolPositionMetadata"];
    };
    ProtocolProduct: {
      label: string;
      positions: components["schemas"]["ProtocolPosition"][];
      metadata: components["schemas"]["ProtocolAncillaryStat"][];
    };
    
    DeFiProtocol: {
      id: string;
      address: string;
      network: string;
      protocolId: string;
      protocolName: string;
      products: components["schemas"]["ProtocolProduct"][];
      
      protocolUsdBalance: number;
      protocolImageUrl?: string;
    };
    "Result_DeFiProtocol-Array_": {
      content: components["schemas"]["DeFiProtocol"][];
    };
    FiatRates: {
      [key: string]: string;
    };
    "Result__positions-DeFiProtocol-Array--fiatRates-FiatRates__": {
      content: {
        fiatRates: components["schemas"]["FiatRates"];
        positions: components["schemas"]["DeFiProtocol"][];
      };
    };
    Challenge: {
      d: string;
      
      expiry: number;
      
      ts: number;
      
      v: 1;
    };
    TokenPrice: {
      exchange?: string;
      provider: string;
      value: string;
      token: string;
    };
    "Result_TokenPrice-or-null_": {
      content: components["schemas"]["TokenPrice"] | null;
    };
    TokenPriceFiatValue: {
      source: string;
      changePercentage24HR?: string;
      value: string;
    };
    TokenPriceV2: {
      fiatValue: {
        [key: string]: components["schemas"]["TokenPriceFiatValue"];
      };
      assetId: string;
    };
    "Result_TokenPriceV2-or-null_": {
      content: components["schemas"]["TokenPriceV2"] | null;
    };
    PriceHistoryItem: {
      
      timestamp: number;
      
      value: number;
    };
    PriceHighLowHistoryItem: {
      
      high: number;
      
      low: number;
    };
    PriceHighLowHistory: {
      day?: components["schemas"]["PriceHighLowHistoryItem"];
      week?: components["schemas"]["PriceHighLowHistoryItem"];
      month?: components["schemas"]["PriceHighLowHistoryItem"];
      year?: components["schemas"]["PriceHighLowHistoryItem"];
      all?: components["schemas"]["PriceHighLowHistoryItem"];
    };
    PriceHistory: {
      prices: components["schemas"]["PriceHistoryItem"][];
      highLow: components["schemas"]["PriceHighLowHistory"];
    };
    "Result_PriceHistory-or-null_": {
      content: components["schemas"]["PriceHistory"] | null;
    };
    
    PriceHistoryGranularity: "DAY" | "WEEK" | "MONTH" | "YEAR" | "ALL";
    
    SupportedCurrency: "USD" | "EUR" | "GBP" | "CAD" | "AUD" | "CHF" | "JPY";
    ResolvedAddressLabels: {
      name: string;
      type: string;
    } | null;
    "Result_ResolvedAddressLabels-Array_": {
      content: components["schemas"]["ResolvedAddressLabels"][];
    };
    ENSResolvedName: {
      
      expiresAt?: number;
      address?: string;
      registered: boolean;
      owner?: string;
      manager?: string | null;
      expired?: boolean;
      
      gracePeriodExpiresAt?: number;
      gracePeriodExpired?: boolean;
      contentHash?: string | null;
      email?: string | null;
      avatar?: string;
      url?: string;
    };
    ResolvedName: components["schemas"]["ENSResolvedName"];
    "Result_ResolvedName-or-null_": {
      content: components["schemas"]["ResolvedName"] | null;
    };
    
    ReceiveAsset: {
      amount: string;
      assetId: string;
      sender: string;
      
      type: "receive";
    };
    
    SendAsset: {
      amount: string;
      assetId: string;
      recipient: string;
      
      type: "send";
    };
    
    MintAsset: {
      spentToken?: components["schemas"]["SendAsset"];
      amount?: string;
      assetId: string;
      
      type: "mint";
    };
    
    PurchaseAsset: {
      spentToken: components["schemas"]["SendAsset"];
      amount?: string;
      assetId: string;
      
      type: "purchase";
    };
    
    SoldAsset: {
      receivedToken?: components["schemas"]["ReceiveAsset"];
      amount?: string;
      assetId: string;
      
      type: "sale";
    };
    
    SwapAssets: {
      spent: components["schemas"]["SendAsset"];
      receive: components["schemas"]["ReceiveAsset"];
      
      type: "swap";
    };
    
    Deposit: {
      receivedToken?: components["schemas"]["ReceiveAsset"];
      depositedAmounts: {
          amount: string;
          assetId: string;
        }[];
      
      type: "deposit";
    };
    
    TokenApproval: {
      amount?: string;
      assetId: string;
      grantee: string;
      
      type: "token-approval";
    };
    TransactionEffect: components["schemas"]["ReceiveAsset"] | components["schemas"]["SendAsset"] | components["schemas"]["MintAsset"] | components["schemas"]["PurchaseAsset"] | components["schemas"]["SoldAsset"] | components["schemas"]["SwapAssets"] | components["schemas"]["Deposit"] | components["schemas"]["TokenApproval"];
    
    PreventativeAction: "BLOCK" | "WARN" | "NONE";
    SimulationWarning: {
      
      severity: "CRITICAL" | "WARNING";
      message: string;
    };
    EVMSimulationResult: {
      
      status: "success" | "failure";
      effects?: components["schemas"]["TransactionEffect"][];
      preventativeAction?: components["schemas"]["PreventativeAction"];
      warnings?: components["schemas"]["SimulationWarning"][];
      
      gasUsed: number;
      
      nonce: number;
    };
    SolanaSimulationResult: {
      
      status: "success" | "failure";
      effects?: components["schemas"]["TransactionEffect"][];
      preventativeAction?: components["schemas"]["PreventativeAction"];
      warnings?: components["schemas"]["SimulationWarning"][];
      fee: string;
      compiledTransaction: string;
    };
    ISimulationResult: {
      
      status: "success" | "failure";
      effects?: components["schemas"]["TransactionEffect"][];
      preventativeAction?: components["schemas"]["PreventativeAction"];
      warnings?: components["schemas"]["SimulationWarning"][];
    };
    SimulationResult: components["schemas"]["EVMSimulationResult"] | components["schemas"]["SolanaSimulationResult"] | components["schemas"]["ISimulationResult"];
    Result_SimulationResult_: {
      content: components["schemas"]["SimulationResult"];
    };
    SolanaSimulationInputCompiled: {
      dAppOrigin?: string;
      signatory?: string;
      transaction: string;
    };
    SerializedSolanaInstruction: {
      data: string;
      programId: string;
      keys: {
          isWritable: boolean;
          isSigner: boolean;
          pubkey: string;
        }[];
    };
    SolanaSimulationInputPlain: {
      dAppOrigin?: string;
      signatory?: string;
      atas?: {
          instruction: components["schemas"]["SerializedSolanaInstruction"];
          address: string;
        }[];
      feePayer: string;
      instructions: components["schemas"]["SerializedSolanaInstruction"][];
    };
    SolanaSimulationInput: components["schemas"]["SolanaSimulationInputCompiled"] | components["schemas"]["SolanaSimulationInputPlain"];
    
    EVMTransactionSimulationInput: {
      dAppOrigin?: string;
      
      type?: number;
      
      nonce?: number;
      maxPriorityFeePerGas?: string;
      maxFeePerGas?: string;
      gasPrice?: string;
      
      gasLimit?: number;
      value?: string;
      data?: string;
      chainId: string;
      from: string;
      to: string;
    };
    UnsignedTypedStructuredData: {
      message: {
        [key: string]: unknown;
      };
      domain: {
        [key: string]: unknown;
      };
      primaryType: string;
      types: {
        [key: string]: {
            type: string;
            name: string;
          }[];
      };
    };
    EVMMessageSimulationInput: {
      unsignedTypedData?: components["schemas"]["UnsignedTypedStructuredData"];
      unsignedPersonalSignMessage?: string;
      unsignedMessage?: string;
      dAppOrigin?: string;
      signatory: string;
    };
    EVMSimulationInput: components["schemas"]["EVMTransactionSimulationInput"] | components["schemas"]["EVMMessageSimulationInput"];
    SimulationInput: components["schemas"]["SolanaSimulationInput"] | components["schemas"]["EVMSimulationInput"];
    TokenCountType: {
      blacklists: {
        [key: string]: number;
      };
      whitelists: {
        [key: string]: number;
      };
    };
    AggregatedTokenListType: {
      lists: string[];
      logoURI?: string;
      
      decimals?: number;
      symbol?: string;
      name?: string;
      contract_address: string;
      
      chainId: number;
      caipId: string;
    };
    "Result__tokenCount-TokenCountType--whitelist-AggregatedTokenListType-Array--blacklist-AggregatedTokenListType-Array--__": {
      content: {
        blacklist: components["schemas"]["AggregatedTokenListType"][];
        whitelist: components["schemas"]["AggregatedTokenListType"][];
        tokenCount: components["schemas"]["TokenCountType"];
      };
    };
    PriceChangePercentage: {
      
      hour: number;
      
      day: number;
      
      week: number;
      
      month: number;
      
      year: number;
      
      all: number;
    };
    TokenMarketData: {
      
      allTimeHigh: number;
      
      allTimeLow: number;
      
      fullyDilutedValuation: number;
      
      marketCap: number;
      
      circulatingSupply: number;
      
      maxSupply: number;
      
      totalSupply: number;
      
      priceChange24HR: number;
      
      priceHigh24HR: number;
      
      priceLow24HR: number;
      
      volume24HR: number;
      priceChangePercentage: components["schemas"]["PriceChangePercentage"];
    };
    "Result_TokenMarketData-or-null_": {
      content: components["schemas"]["TokenMarketData"] | null;
    };
    NFTTrait: {
      value?: string | number | boolean;
      name: string;
    };
    NFTMetadata: {
      isSpam?: boolean;
      reputation?: components["schemas"]["TokenReputation"];
      backgroundColor?: string;
      traits?: components["schemas"]["NFTTrait"][];
      collection?: {
        imageUrl?: string;
        symbol?: string;
        name?: string;
        id: string;
      };
      
      signature?: string;
      contentType?: string;
      contentUrl?: string;
      description?: string;
      name?: string;
      
      isNFT: true;
    };
    TokenMetadataResponse: (components["schemas"]["TokenMetadata"] | components["schemas"]["NFTMetadata"]) | null;
    Result_TokenMetadataResponse_: {
      content: components["schemas"]["TokenMetadataResponse"];
    };
    
    TransactionCategory: "send" | "receive" | "token_receive" | "token_send" | "token_swap" | "nft_sale" | "nft_purchase" | "nft_send" | "nft_receive" | "airdrop" | "mint" | "deposit" | "withdraw" | "approve" | "revoke" | "contract_interaction";
    
    Transaction: {
      protocolInfo?: {
        possibleSpam?: boolean;
        category?: components["schemas"]["TransactionCategory"];
        projectId: string;
      };
      effects: components["schemas"]["TransactionEffect"][];
      metadata?: {
        actionName?: string;
        target?: string;
      };
      fee?: {
        amount: string;
        token: string;
      };
      
      kind: "sent" | "affected";
      
      status: "succeeded" | "failed";
      
      timestamp: number;
      id: string;
    };
    Page_Transaction_: {
      content: components["schemas"]["Transaction"][];
      cursor?: string;
    };
    TransactionStatusComplete: {
      
      blockNumber: number;
      
      status: "confirmed" | "failed";
    };
    TransactionStatusIncomplete: {
      
      status: "unknown" | "pending";
    };
    TransactionStatus: components["schemas"]["TransactionStatusComplete"] | components["schemas"]["TransactionStatusIncomplete"];
    NetworkState: {
      
      latestConfirmedBlock: number;
    };
    TransactionStatusPublic: components["schemas"]["TransactionStatus"] & {
      meta: {
        networkState: components["schemas"]["NetworkState"];
      };
    };
    Result_TransactionStatusPublic_: {
      content: components["schemas"]["TransactionStatusPublic"];
    };
    UTXO: {
      
      blockNumber?: number;
      script: string;
      value: string;
      
      index: number;
      transactionId: string;
    };
    "Result_UTXO-Array_": {
      content: components["schemas"]["UTXO"][];
    };
  };
  responses: {
  };
  parameters: {
  };
  requestBodies: {
  };
  headers: {
  };
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  
  AnalyseAddress: {
    
    requestBody: {
      content: {
        "application/json": {
          toAddress: string;
          fromAddress: string;
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_AnalyseAddressResult-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  AnalyseDomains: {
    
    requestBody: {
      content: {
        "application/json": {
          domains: string[];
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_AnalyseDomainsResult_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  AnalyseUrl: {
    
    requestBody: {
      content: {
        "application/json": {
          address?: string;
          url?: string;
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_AnalyseUrlResult_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetBalances: {
    parameters: {
      query: {
        
        address: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_InternalBalance-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  Broadcast: {
    parameters: {
      query: {
        
        network: string;
        
        data: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_BroadcastReceipt_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetMainPageContent: {
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_ExploreContentRow-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPageContentBySlug: {
    parameters: {
      path: {
        pageSlug: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_ExploreContentRow-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetFees: {
    parameters: {
      query: {
        
        network: string;
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_FeeOption-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetNfts: {
    parameters: {
      query: {
        
        address: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_NFT-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPositions: {
    parameters: {
      query: {
        
        address: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_DeFiProtocol-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPositionsV2: {
    parameters: {
      query: {
        
        address: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result__positions-DeFiProtocol-Array--fiatRates-FiatRates__"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetChallenge: {
    responses: {
      
      200: {
        content: {
          "application/json": {
            
            difficulty: number;
            target: string;
            signature: string;
            challenge: components["schemas"]["Challenge"];
          };
        };
      };
    };
  };
  
  SubmitSolution: {
    requestBody: {
      content: {
        "application/json": {
          signature: string;
          challenge: components["schemas"]["Challenge"];
          solution: string;
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": {
            key: string;
          };
        };
      };
    };
  };
  
  GetPriceData: {
    parameters: {
      query: {
        
        token: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TokenPrice-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPriceDataV2: {
    parameters: {
      query: {
        
        token: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TokenPriceV2-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetPriceHistoryData: {
    parameters: {
      query: {
        
        token: string;
        
        granularity: components["schemas"]["PriceHistoryGranularity"];
        
        currency?: components["schemas"]["SupportedCurrency"];
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_PriceHistory-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  ResolveEnsAddresses: {
    parameters: {
      query: {
        addresses: string[];
        network: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_ResolvedAddressLabels-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  ResolveEnsName: {
    parameters: {
      query: {
        name: string;
        network: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_ResolvedName-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  Simulate: {
    parameters: {
      query: {
        
        network: string;
      };
    };
    
    requestBody: {
      content: {
        "application/json": components["schemas"]["SimulationInput"];
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_SimulationResult_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTokenList: {
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result__tokenCount-TokenCountType--whitelist-AggregatedTokenListType-Array--blacklist-AggregatedTokenListType-Array--__"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTokenMarketData: {
    parameters: {
      query: {
        
        token: string;
        
        currency?: components["schemas"]["SupportedCurrency"];
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TokenMarketData-or-null_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTokenMetadata: {
    parameters: {
      query: {
        
        token: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TokenMetadataResponse_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTransactions: {
    parameters: {
      query: {
        
        address: string;
        
        network: string;
        
        cursor?: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Page_Transaction_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetTransactionStatus: {
    parameters: {
      query: {
        
        transactionId: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_TransactionStatusPublic_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetUtxo: {
    parameters: {
      query: {
        address: string;
        
        network: string;
        
        backend?: string;
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Result_UTXO-Array_"];
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
  
  GetVersion: {
    responses: {
      
      200: {
        content: {
          "application/json": {
            version: string;
          };
        };
      };
      
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResult"];
        };
      };
    };
  };
}
