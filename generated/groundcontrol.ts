


export interface paths {
  "/ping": {
    get: operations["PingGet"];
    post: operations["Ping"];
  };
  "/majorTomToGroundControl": {
    post: operations["Register"];
  };
  "/unsubscribe": {
    post: operations["Unsubscribe"];
  };
  "/setTokenConfiguration": {
    post: operations["SetTokenConfiguration"];
  };
  "/getTokenConfiguration": {
    post: operations["GetTokenConfiguration"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    PaymentReceivedEvent: {
      
      type: "payment-received";
      network: string;
      amount: string;
      currency: string;
      address: string;
    };
    NFTReceivedEvent: {
      
      type: "nft-received";
      network: string;
      currency: string;
      amount?: string;
      address: string;
    };
    TransactionConfirmed: {
      
      type: "transaction-confirmed";
      transactionId: string;
      network: string;
    };
    LightningInvoiceSettled: {
      
      type: "lightning-invoice-settled";
      sat: string;
      memo: string;
      hash: string;
    };
    Event: components["schemas"]["PaymentReceivedEvent"] | components["schemas"]["NFTReceivedEvent"] | components["schemas"]["TransactionConfirmed"] | components["schemas"]["LightningInvoiceSettled"] | components["schemas"]["UnconfirmedEvent"];
    UnconfirmedEvent: {
      
      type: "unconfirmed";
      transactionId: string;
      event: components["schemas"]["Event"];
    };
    IBody: {
      addresses?: string[];
      hashes?: string[];
      txids?: string[];
      token: string;
      os: string;
    };
    TokenConfigurationType: {
      app_version: string;
      lang: string;
      level_tips: boolean;
      level_price: boolean;
      level_news: boolean;
      level_transactions: boolean;
      level_all: boolean;
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

  PingGet: {
    responses: {
      
      200: {
        content: {
          "application/json": string;
        };
      };
    };
  };
  Ping: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["Event"];
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["Event"];
        };
      };
    };
  };
  Register: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["IBody"];
      };
    };
    responses: {
      
      204: {
        content: never;
      };
    };
  };
  Unsubscribe: {
    requestBody: {
      content: {
        "application/json": {
          os: string;
          token: string;
          txids?: string[];
          hashes?: string[];
          addresses?: string[];
        };
      };
    };
    responses: {
      
      204: {
        content: never;
      };
    };
  };
  SetTokenConfiguration: {
    requestBody: {
      content: {
        "application/json": {
          os: string;
          token: string;
        } & components["schemas"]["TokenConfigurationType"];
      };
    };
    responses: {
      
      204: {
        content: never;
      };
    };
  };
  GetTokenConfiguration: {
    requestBody: {
      content: {
        "application/json": {
          os: string;
          token: string;
        };
      };
    };
    responses: {
      
      200: {
        content: {
          "application/json": components["schemas"]["TokenConfigurationType"];
        };
      };
    };
  };
}
