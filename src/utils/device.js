let _isLow = null;

export function isLowEndDevice() {
  if (_isLow !== null) return _isLow;

  if (typeof window === 'undefined') {
    _isLow = true;
    return true;
  }

  const nav = navigator;
  const ua = (nav.userAgent || '').toLowerCase();

  const isOldIOS =
    /iphone|ipad|ipod/.test(ua) &&
    nav.maxTouchPoints > 0 &&
    !/os (1[4-9]|[2-9]\d)/.test(ua);

  const isOldAndroid =
    /android/.test(ua) &&
    !/android (1[0-9]|[2-9]\d)/.test(ua);

  const lowMemory = nav.deviceMemory && nav.deviceMemory < 2;
  const lowCores = nav.hardwareConcurrency && nav.hardwareConcurrency < 4;

  const isDesktop = !/mobile|tablet|android|iphone|ipad|ipod/i.test(ua);

  if (isDesktop) {
    _isLow = false;
    return false;
  }

  _isLow = isOldIOS || isOldAndroid || lowMemory || lowCores;
  return _isLow;
}
