export const injectProviderScript = `(function () {
  window.isNativeApp = true;
  const eventHandlers = {};

  function generateRequestId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  const provider = {
    isMetaMask: true,
    request: payload => {
      const id = generateRequestId();
      const requestPayload = {
        id: id,
        method: payload.method,
        params: payload.params,
      };
      window.ReactNativeWebView.postMessage(JSON.stringify(requestPayload));
      return new Promise(resolve => {
        const messageHandler = function(event) {
          const response = JSON.parse(event.data);
          if (response.id === requestPayload.id) {
            resolve(response.result);
            // Remove the listener after it's used
            window.removeEventListener('message', messageHandler);
          }
        };
    
        window.addEventListener('message', messageHandler);
      });
    },
    on: (event, handler) => {
      if (!eventHandlers[event]) {
        eventHandlers[event] = [];
      }
      eventHandlers[event].push(handler);
    },
    dispatchEvent: (event, data) => {
      if (eventHandlers[event]) {
        eventHandlers[event].forEach(handler => handler(data));
      }
    },
    removeListener: (event, handler) => {
      if (eventHandlers[event]) {
        eventHandlers[event] = eventHandlers[event].filter(h => h !== handler);
      }
    }
  };

  window.addEventListener('message', function (event) {
    try {
      const response = JSON.parse(event.data);
  
      if (response.method && eventHandlers[response.method]) {
        provider.dispatchEvent(response.method, response.result);
      }
    } catch (error) {
      console.error("Error processing incoming event:", error);
    }
  });

  window.ethereum = provider;
  
  
  
  function announceProvider() {
    const info = {
      uuid: generateRequestId(),
      name: "Kraken Wallet",
      icon: "data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyNTAiIHZpZXdCb3g9IjAgMCAyNTAgMjUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTI1IDI0OS43NDZDMTkxLjY1IDI0OS43NDYgMjQ1LjcgMTk2LjE0NiAyNDUuNyAxMzAuMDQ2QzI0NS43IDYzLjk0NTcgMTkxLjY1IDEwLjM0NTcgMTI1IDEwLjM0NTdDNTguMzQ5NiAxMC4zOTU3IDQuMjk5NTYgNjMuOTQ1NyA0LjI5OTU2IDEzMC4wNDZDNC4yOTk1NiAxOTYuMTQ2IDU4LjM0OTYgMjQ5Ljc0NiAxMjUgMjQ5Ljc0NloiIGZpbGw9IiM3NTM4RjUiLz4KPHBhdGggZD0iTTEyNC45ODQgNjUuMTk5MkM4Ny4xNTk5IDY1LjE5OTIgNTYuNSA5Ni40Mjk4IDU2LjUgMTM0Ljk1NFYxNjQuODQ3QzU2LjUgMTcwLjM0NSA2MC44NzU0IDE3NC44IDY2LjI3NjYgMTc0LjhDNzEuNjc3NyAxNzQuOCA3Ni4wODUyIDE3MC4zNDUgNzYuMDg1MiAxNjQuODQ3VjEzNC45NTRDNzYuMDg1MiAxMjkuNDM5IDgwLjQ0NDUgMTI0Ljk4NCA4NS44NjE3IDEyNC45ODRDOTEuMjYyOSAxMjQuOTg0IDk1LjYzODMgMTI5LjQzOSA5NS42MzgzIDEzNC45NTRWMTY0Ljg0N0M5NS42MzgzIDE3MC4zNDUgMTAwLjAxNCAxNzQuOCAxMDUuNDE1IDE3NC44QzExMC44MzIgMTc0LjggMTE1LjIwNyAxNzAuMzQ1IDExNS4yMDcgMTY0Ljg0N1YxMzQuOTU0QzExNS4yMDcgMTI5LjQzOSAxMTkuNTgzIDEyNC45ODQgMTI0Ljk4NCAxMjQuOTg0QzEzMC40MDEgMTI0Ljk4NCAxMzQuNzkzIDEyOS40MzkgMTM0Ljc5MyAxMzQuOTU0VjE2NC44NDdDMTM0Ljc5MyAxNzAuMzQ1IDEzOS4xNjggMTc0LjggMTQ0LjU2OSAxNzQuOEMxNDkuOTcgMTc0LjggMTU0LjM0NiAxNzAuMzQ1IDE1NC4zNDYgMTY0Ljg0N1YxMzQuOTU0QzE1NC4zNDYgMTI5LjQzOSAxNTguNzIxIDEyNC45ODQgMTY0LjE1NCAxMjQuOTg0QzE2OS41NTUgMTI0Ljk4NCAxNzMuOTMxIDEyOS40MzkgMTczLjkzMSAxMzQuOTU0VjE2NC44NDdDMTczLjkzMSAxNzAuMzQ1IDE3OC4zMDYgMTc0LjggMTgzLjcyMyAxNzQuOEMxODkuMTI1IDE3NC44IDE5My41IDE3MC4zNDUgMTkzLjUgMTY0Ljg0N1YxMzQuOTU0QzE5My41IDk2LjQyOTggMTYyLjgyNCA2NS4xOTkyIDEyNC45ODQgNjUuMTk5MloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
      rdns: "com.kraken-wallet"
    };
    window.dispatchEvent(
      new CustomEvent("eip6963:announceProvider", {
        detail: Object.freeze({ info, provider }),
      })
    );
  }
  
  window.addEventListener(
    "eip6963:requestProvider",
    (event) => {  
      announceProvider();
    }
  );
  announceProvider();
})();
true;
`;

export const injectGetPageInformationScript = `
const injectedJavaScript = 
    (function() {
      const faviconLink = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
      const faviconUrl = faviconLink ? faviconLink.href : '';
      const baseUrl = window.location.origin;
      window.ReactNativeWebView.postMessage(JSON.stringify({ method: 'wallet-get-page-info', params: [faviconUrl, baseUrl] }));
    })();
    true; 
  ;
  `;
