const appRequestQueue: (() => Promise<void>)[] = [];
const appRequestState = { inProgress: false };

let walletConnectRequestsDelayTimeout: NodeJS.Timeout;
const REQUEST_DELAY_TIME = 2000;

let unblockWalletConnectEventsTimeout: NodeJS.Timeout;
const UNBLOCK_TIME = 5000;

export const enqueueAppRequest = (appRequest: () => Promise<void>) => {
  if (appRequestQueue.length || appRequestState.inProgress) {
    appRequestQueue.push(appRequest);
  } else {
    appRequestState.inProgress = true;
    appRequest().then(() => {
      appRequestState.inProgress = false;
      dequeueAppRequest();
    });
  }
};
const dequeueAppRequest = () => {
  if (appRequestQueue.length > 0) {
    walletConnectRequestsDelayTimeout = setTimeout(() => {
      if (appRequestState.inProgress) {
        return;
      }
      const nextAppRequest = appRequestQueue.shift();

      if (nextAppRequest) {
        appRequestState.inProgress = true;
        nextAppRequest().then(() => {
          appRequestState.inProgress = false;
          dequeueAppRequest();
        });
      }
    }, REQUEST_DELAY_TIME);
  }
};

export const blockWalletConnectRequests = () => {
  clearTimeout(walletConnectRequestsDelayTimeout);
  appRequestState.inProgress = true;
};

export const unblockWalletConnectRequests = () => {
  appRequestState.inProgress = false;
  dequeueAppRequest();
};

export const performActionAndBlockWalletConnectEvents = async (requestFn: () => Promise<unknown>) => {
  clearTimeout(unblockWalletConnectEventsTimeout);
  blockWalletConnectRequests();
  try {
    return await requestFn();
  } finally {
    unblockWalletConnectEventsTimeout = setTimeout(unblockWalletConnectRequests, UNBLOCK_TIME);
  }
};
