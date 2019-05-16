export class Environment {
  static application: Application;
  static staging: true;
  static production: false;
  static operation = `staging`;
}

interface Application {
  webDomain: string;
  api_protocol: string;
  domain: string;
  defaultRegion: string;
  websocketServer: string;
  marketUrl: string;
  productDocument: string;
  filingBook: string;

  redirect_uri: string;
  consoleAPI: string;
  authUrl: string;
  authRealm: string;
  authClientId: string;

  bssFront: string;
  bssAPI: string;
  serviceAPI: string;
}
