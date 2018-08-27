/* globals ChromeUtils, ExtensionAPI */
const BrowserWindowTracker = ChromeUtils.import('resource:///modules/BrowserWindowTracker.jsm', null).BrowserWindowTracker;
const UI_IFRAME_ELEM_ID = 'cliqzTopBarIframe';
const injectNotificationFrameIfNeeded = (doc, url, height) => {
  let resolver;
  const promise = new Promise((resolve) => { resolver = resolve; });
  const panel = doc.getElementById('browser-panel') || doc.getElementById('main-window');
  const contentDeck = doc.getElementById('content-deck');
  let iframe = doc.getElementById(UI_IFRAME_ELEM_ID);
  if (!iframe) {
    iframe = doc.createElementNS('http://www.w3.org/1999/xhtml', 'iframe');
    iframe.id = UI_IFRAME_ELEM_ID;
    iframe.tabIndex = -1;
  }

  function onIframeReady() {
    iframe.style.height = height;
    iframe.style.width = '100%';
    iframe.style.overflow = 'auto';
    iframe.style.position = 'relative';
    iframe.style.minHeight = '0';
    iframe.style.zIndex = '99999';
    resolver();
  }

  iframe.src = url;
  panel.insertBefore(iframe, contentDeck);
  iframe.addEventListener('load', onIframeReady, true);

  return promise;
};

this.cliqzTopBar = class extends ExtensionAPI {
  getAPI() {
    return {
      cliqzTopBar: {
        showTopBar: (url, height) => {
          injectNotificationFrameIfNeeded(
            BrowserWindowTracker.getTopWindow().document,
            url,
            height
          );
        },
        setHeight: (height) => {
          const doc = BrowserWindowTracker.getTopWindow().document;
          const iframe = doc.getElementById(UI_IFRAME_ELEM_ID);
          if (iframe) {
            iframe.style.height = height;
          }
        },
        hideTopBar: () => {
          const doc = BrowserWindowTracker.getTopWindow().document;
          const iframe = doc.getElementById(UI_IFRAME_ELEM_ID);
          if (iframe) {
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
          }
        },
      }
    };
  }
};
