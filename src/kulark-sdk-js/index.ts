

export class KLSdk {
  static instance: KLSdk;
  constructor () {
    if (typeof KLSdk.instance === 'object') {
      return KLSdk.instance;
    }
    KLSdk.instance = this;
    return this;
  }

  setScreenShareMode(isScreenShare: boolean) {
    
  }
}