/* Code taken from Quasar
    https://github.com/quasarframework/quasar - https://github.com/quasarframework/quasar/blob/dev/LICENSE
 */
const getPlatformMatch = (userAgent) => {
    return /(ipad)/.exec(userAgent) ||
        /(ipod)/.exec(userAgent) ||
        /(windows phone)/.exec(userAgent) ||
        /(iphone)/.exec(userAgent) ||
        /(kindle)/.exec(userAgent) ||
        /(silk)/.exec(userAgent) ||
        /(android)/.exec(userAgent) ||
        /(win)/.exec(userAgent) ||
        /(mac)/.exec(userAgent) ||
        /(linux)/.exec(userAgent) ||
        /(cros)/.exec(userAgent) ||
        /(playbook)/.exec(userAgent) ||
        /(bb)/.exec(userAgent) ||
        /(blackberry)/.exec(userAgent) ||
        []
}

const getPlatform = (userAgent) => {
    userAgent = (userAgent || navigator.userAgent || navigator.vendor || window.opera).toLowerCase()

    const
        platformMatch = getPlatformMatch(userAgent),
        matched = getMatch(userAgent, platformMatch),
        browser = {}

    if (matched.browser) {
        browser[matched.browser] = true
        browser.version = matched.version
        browser.versionNumber = parseInt(matched.versionNumber, 10)
    }

    if (matched.platform) {
        browser[matched.platform] = true
    }

    const knownMobiles = browser.android ||
        browser.bb ||
        browser.blackberry ||
        browser.ipad ||
        browser.iphone ||
        browser.ipod ||
        browser.kindle ||
        browser.playbook ||
        browser.silk ||
        browser['windows phone']

    // These are all considered mobile platforms, meaning they run a mobile browser
    if (knownMobiles === true || userAgent.indexOf('mobile') > -1) {
        browser.mobile = true
    }
    // If it's not mobile we should consider it's desktop platform, meaning it runs a desktop browser
    // It's a workaround for anonymized user agents
    // (browser.cros || browser.mac || browser.linux || browser.win)
    else {
        browser.desktop = true
    }

    // Set iOS if on iPod, iPad or iPhone
    if (browser.ipod || browser.ipad || browser.iphone) {
        browser.ios = true
    }

    if (browser['windows phone']) {
        browser.winphone = true
        delete browser['windows phone']
    }

    // Chrome, Opera 15+, Vivaldi and Safari are webkit based browsers
    if (
        browser.chrome ||
        browser.opr ||
        browser.safari ||
        browser.vivaldi ||
        // we expect unknown, non iOS mobile browsers to be webkit based
        (
            browser.mobile === true &&
            browser.ios !== true &&
            knownMobiles !== true
        )
    ) {
        browser.webkit = true
    }

    // IE11 has a new token so we will assign it msie to avoid breaking changes
    if (browser.rv || browser.iemobile) {
        matched.browser = 'ie'
        browser.ie = true
    }

    // Edge is officially known as Microsoft Edge, so rewrite the key to match
    if (browser.edge) {
        matched.browser = 'edge'
        browser.edge = true
    }

    // Blackberry browsers are marked as Safari on BlackBerry
    if (browser.safari && browser.blackberry || browser.bb) {
        matched.browser = 'blackberry'
        browser.blackberry = true
    }

    // Playbook browsers are marked as Safari on Playbook
    if (browser.safari && browser.playbook) {
        matched.browser = 'playbook'
        browser.playbook = true
    }

    // Opera 15+ are identified as opr
    if (browser.opr) {
        matched.browser = 'opera'
        browser.opera = true
    }

    // Stock Android browsers are marked as Safari on Android.
    if (browser.safari && browser.android) {
        matched.browser = 'android'
        browser.android = true
    }

    // Kindle browsers are marked as Safari on Kindle
    if (browser.safari && browser.kindle) {
        matched.browser = 'kindle'
        browser.kindle = true
    }

    // Kindle Silk browsers are marked as Safari on Kindle
    if (browser.safari && browser.silk) {
        matched.browser = 'silk'
        browser.silk = true
    }

    if (browser.vivaldi) {
        matched.browser = 'vivaldi'
        browser.vivaldi = true
    }

    // Assign the name and platform variable
    browser.name = matched.browser
    browser.platform = matched.platform

    return browser
}


const getMatch = (userAgent, platformMatch) => {
    const match = /(edge)\/([\w.]+)/.exec(userAgent) ||
        /(opr)[\/]([\w.]+)/.exec(userAgent) ||
        /(vivaldi)[\/]([\w.]+)/.exec(userAgent) ||
        /(chrome)[\/]([\w.]+)/.exec(userAgent) ||
        /(iemobile)[\/]([\w.]+)/.exec(userAgent) ||
        /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
        /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent) ||
        /(webkit)[\/]([\w.]+)/.exec(userAgent) ||
        /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent) ||
        /(msie) ([\w.]+)/.exec(userAgent) ||
        userAgent.indexOf('trident') >= 0 && /(rv)[: ]([\w.]+)/.exec(userAgent) ||
        userAgent.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(userAgent) ||
        []

    return {
        browser: match[5] || match[3] || match[1] || '',
        version: match[2] || match[4] || '0',
        versionNumber: match[4] || match[2] || '0',
        platform: platformMatch[0] || ''
    }
}

module.exports = getPlatform
