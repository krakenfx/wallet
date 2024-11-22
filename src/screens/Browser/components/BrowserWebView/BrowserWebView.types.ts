export interface BrowserWebViewRef {
  navigateBack: () => void;
  navigateForward: () => void;
  reloadPage: () => void;
  disconnect: () => void;
}
