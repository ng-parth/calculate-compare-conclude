import * as serviceWorker from "../serviceWorker";

export const APP_NAMES = {
  LETS_GO: 'LETS_GO',
  WA_ME: 'WA_ME',
}
const getAppConfig = appName => {
  let config = {};
  switch (appName) {
    case APP_NAMES.LETS_GO:
      config = {
        manifest: 'manifest.letsgo.json',
        favicon: 'favicon.letsgo.ico',
        title: 'Lets Go!',
      }
      break;
    case APP_NAMES.WA_ME:
      config = {
        manifest: 'manifest.wame.json',
        favicon: 'favicon.wame.ico',
        title: 'Whatsapp without saving contact',
      }
      break;
    default:
      config = {
        manifest: 'manifest.json',
        favicon: 'assets/logos/favicon.ico',
        title: 'Compare & Conclude',
      };
  }
  return config;
}


export const updateManifestFile = (appName, swConfig) => {
  const { manifest, favicon, title } = getAppConfig(appName);
  const manifestUrl = `${process.env.PUBLIC_URL}/${manifest}`;
  let manifestEl = document.querySelector('link[rel="manifest"]');
  if (!manifestEl) {
    manifestEl = document.createElement('link');
    manifestEl.href = manifestUrl;
    manifestEl.rel = 'manifest';
    document.getElementsByTagName('head')[0].appendChild(manifestEl);
  } else {
    manifestEl.href = manifestUrl;
    manifestEl.rel = 'manifest';
  }

  // <link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>
  const faviconEl = document.querySelector('link[rel="icon"]');
  faviconEl.href = `${process.env.PUBLIC_URL}/${favicon}`;

  const titleEl = document.querySelector('title');
  titleEl.innerText = title;
  setTimeout(() => {
    serviceWorker.register(swConfig);
  }, 500)
}
