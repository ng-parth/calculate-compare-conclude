import * as serviceWorker from "../serviceWorker";
import waSwConfig from './../sw/wa/swConfig';
import letsgoSwConfig from './../sw/letsgo/swConfig';

export const APP_NAMES = {
  LETS_GO: {
    name: 'LETS_GO',
    domains: ['go.ng-parth.xyz', 'lets-go.ng-parth.xyz'],
  },
  WA_ME: {
    name: 'WA_ME',
    domains: ['wa.ng-parth.xyz', 'wame.ng-parth.xyz', 'wa_me.ng-parth.xyz'],
  },
}
const getAppConfig = appName => {
  let config = {};
  switch (appName) {
    case APP_NAMES.LETS_GO.name:
      config = {
        manifest: 'manifest.letsgo.json',
        favicon: 'favicon.letsgo.ico',
        title: 'Lets Go!',
        swConfig: letsgoSwConfig,
      }
      break;
    case APP_NAMES.WA_ME.name:
      config = {
        manifest: 'manifest.wame.json',
        favicon: 'favicon.wame.ico',
        title: 'Whatsapp without saving contact',
        swConfig: waSwConfig,
      }
      break;
    default:
      config = {
        manifest: 'manifest.json',
        favicon: 'assets/logos/favicon.ico',
        title: 'Calculate, Compare & Conclude',
      };
  }
  return config;
}


export const updateManifestFile = appName => {
  const {
    manifest = null,
    favicon = null,
    title = 'Calculate, Compare & Conclude',
    swConfig = null,
  } = getAppConfig(appName);
  if (manifest) {
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
  }

  if (favicon) {
    // <link rel="icon" href="%PUBLIC_URL%/favicon.ico"/>
    const faviconEl = document.querySelector('link[rel="icon"]');
    faviconEl.href = `${process.env.PUBLIC_URL}/${favicon}`;
  }

  const titleEl = document.querySelector('title');
  titleEl.innerText = title;
  if (swConfig) {
    setTimeout(() => {
      serviceWorker.register(swConfig);
    }, 200)
  }
}
