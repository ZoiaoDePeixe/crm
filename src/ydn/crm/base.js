/**
 * @fileoverview Base variables.
 */

goog.provide('ydn.crm.base');
goog.require('goog.async.Deferred');


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
  FRONT_END_SRC: 'front-end-src',
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
ydn.crm.base.LOGIN_ORIGIN = 'https://www.yathit.com'; // 'http://localhost:8080'; //


/**
 * @const
 * @type {string}
 */
ydn.crm.base.APP_ID = 'cm'; // cm


/**
 * @const
 * @type {string}
 */
ydn.crm.base.BASE_PATH = '';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.OPTION_PAGE = 'option-page.html';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.SETUP_PAGE = 'setup.html';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.HOST_PERMISSION_PAGE = 'host-permission.html';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.SVG_PAGE = 'image/all-icons.svg';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.INJ_TEMPLATE = 'inj-template.html';


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
  TEST: 'test',
  /* Use in simple popup page */
  POPUP_CONTENT: 'popup-content',
  CUSTOM_LOGGING: 'custom-logging'
};


/**
 * All keys used in localStorage.
 * @enum {string}
 */
ydn.crm.base.LocalStorageKey = {
  TEST: 'test'
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


/**
 * Application short_name. These value are used for setting default app setting.
 * @enum {string}
 */
ydn.crm.base.AppShortName = {
  EMAIL_TRACKER_GMAIL: 'Email Tracker for Gmail',
  EMAIL_TRACKER: 'Email Tracker',
  SUGARCRM: 'SugarCRM',
  OTHERS: ''
};


/**
 * @enum {string}
 */
ydn.crm.base.Feature = {
  GDATA_CONTACT: 'gc',
  TRACKING: 'tk',
  SUGARCRM: 'su'
};


/**
 * Message token broadcast across documents.
 * @enum {string}
 */
ydn.crm.base.BroadcastToken = {
  /**
   * @desc A window want to close itself, since it jobs has finished.
   */
  CLOSING: 'closing',
  /**
   * @desc Command to close window.
   */
  CLOSE: 'close'
};

