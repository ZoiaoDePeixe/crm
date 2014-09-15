/**
 * @fileoverview Base variables.
 */

goog.provide('ydn.crm.base');
goog.require('goog.async.Deferred');


/**
 * @define {boolean} running in raw mode.
 */
ydn.crm.base.RAW = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.base.LOCAL_STORE_PREFIX = 'app';


/**
 * @enum {string}
 */
ydn.crm.base.SessionKey = {
  LAST_URL: 'lu'
};


/**
 * Key used in chrome.storage.local
 * @enum {string}
 */
ydn.crm.base.LocalKey = {
  WHAT: 'sd',
  USER_SETTING: 'st',
  TRACK: 'ydn-crm-track',
  APP_SRC: 'ydn-crm-src',
  LAST_LOGIN_USER_ID: 'last-login'
};


/**
 * @define {string} version major.
 */
ydn.crm.base.VERSION_MAJOR = '';


/**
 * @define {string} version minor.
 */
ydn.crm.base.VERSION_MINOR = '';


/**
 * @define {string} version patch.
 */
ydn.crm.base.VERSION_PATCH = '';


/**
 * @const
 * @type {string}
 */
ydn.crm.version = ydn.crm.base.VERSION_MAJOR + '.' +
    ydn.crm.base.VERSION_MINOR + '.' +
    ydn.crm.base.VERSION_PATCH;


/**
 * @const
 * @type {string}
 */
ydn.crm.VER = '0.12.0';


/**
 * @enum {string}
 */
ydn.crm.Version = {
  PREVIOUS: '0.10.17',
  STABLE: ydn.crm.VER,
  RC: ydn.crm.VER,
  BETA: ydn.crm.VER,
  EDGE: 'edge'
};


/**
 * Production track.
 * @enum {string}
 */
ydn.crm.base.Track = {
  PREVIOUS: 'Previous',
  STABLE: 'Stable',
  BETA: 'Beta',
  EDGE: 'Edge',
  RC: 'RC'
};


/**
 * @enum {string}
 */
ydn.crm.base.Theme = {
  DESKTOP: 'featured',
  SIMPLICITY: 'simplicity',
  MOBILE: 'mobile',
  TABLET: 'tablet'
};


/**
 * @const
 * @type {string}
 */
ydn.crm.base.THEME_DEFAULT = ydn.crm.base.Theme.DESKTOP;


/**
 * @define {string} login origin server.
 */
ydn.crm.base.LOGIN_ORIGIN = 'https://yathit-app.appspot.com'; // 'http://localhost:8080'; //


/**
 * @const
 * @type {string}
 */
ydn.crm.base.APP_ID = 'cm'; // cm


/**
 * @const
 * @type {string}
 */
ydn.crm.base.BASE_PATH = !COMPILED ? 'crm-ex/' : '';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.OPTION_PAGE = ydn.crm.base.BASE_PATH + 'option-page.html';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.SETUP_PAGE = ydn.crm.base.BASE_PATH + 'setup.html';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.HOST_PERMISSION_PAGE = ydn.crm.base.BASE_PATH + 'host-permission.html';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.SVG_PAGE = ydn.crm.base.BASE_PATH + 'image/all-icons.svg';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.INJ_TEMPLATE = ydn.crm.base.BASE_PATH + 'inj-template.html';


/**
 * All keys use in chrome.sync
 * @enum {string}
 */
ydn.crm.base.SyncKey = {
  USER_SETTING: 'user-setting',
  SUGAR_SETTING: 'sugar-setting'
};


/**
 * All keys used in chrome.local.
 * @enum {string}
 */
ydn.crm.base.ChromeSyncKey = {
  CONTEXT_PANEL_POSITION: 'cp-po',
  CONTEXT_PANEL_STICKY_BTN_STATE: 'cp-bs',
  LOGGING_CAPTURE_ON_CONSOLE: 'lg-cc',
  LOGGING_BUG_REPORT: 'lg-br'
};


/**
 * List of keys available synchronously by caching.
 * @type {Array.<string>}
 */
ydn.crm.base.ChromeSyncKeysNow = [ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION];


/**
 * All keys used in chrome.local.
 * @enum {string}
 */
ydn.crm.base.ChromeLocalKey = {
  TEST: 'test'
};


/**
 * All keys used in localStorage.
 * @enum {string}
 */
ydn.crm.base.LocalStorageKey = {
  TEST: 'test'
};


/**
 * Instead of creating a new tab, open like a dialog box.
 * @param {Event} e
 */
ydn.crm.base.openPageAsDialog = function(e) {
  e.preventDefault();
  var w = 200;
  var h = 100;
  var wh = e.target.getAttribute('data-window-height');
  var ww = e.target.getAttribute('data-window-width');
  if (ww) {
    w = parseInt(ww, 10);
  }
  if (wh) {
    h = parseInt(wh, 10);
  }
  // dual monitor solution
  var left = (window.innerWidth / 2) - (w / 2) + window.screenLeft;
  var top = (window.innerWidth / 2) - (h / 2) + window.screenTop;
  var url = e.target.href;
  window.open(url, undefined, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
};


/**
 * @typedef {{
 *   from_addr: string,
 *   to_addrs: string,
 *   date_sent: Date,
 *   html: string,
 *   subject: string,
 *   mailbox_id: string,
 *   message_id: string
 * }}
 */
ydn.crm.EmailInfo;

