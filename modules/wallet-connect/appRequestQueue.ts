



const appRequestQueue: (() => Promise<void>)[] = [];
const appRequestState = { inProgress: false };
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
    setTimeout(() => {
      const nextAppRequest = appRequestQueue.shift();

      if (nextAppRequest) {
        appRequestState.inProgress = true;
        nextAppRequest().then(() => {
          appRequestState.inProgress = false;
          dequeueAppRequest();
        });
      }
    }, 2000 );
  }
};
