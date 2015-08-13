/**
 * @fileoverview Base variables.
 */

goog.provide('ydn.crm.base');
goog.provide('ydn.crm.base.ContextPanelPosition');
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
 * Key used in window.localStorage
 * @enum {string}
 */
ydn.crm.base.LocalKey = {

};


/**
 * All keys used in chrome.local.
 * @enum {string}
 */
ydn.crm.base.ChromeLocalKey = {
  GCM_REG_ID: 'gcm-reg-id',
  CUSTOM_LOGGING: 'custom-logging',
  FRONT_END_SRC: 'front-end-src',
  /* Use in simple popup page */
  POPUP_CONTENT: 'popup-content',
  POSITION_HUD_BASE: 'po-hud-b',
  TRACK: 'ydn-crm-track',
  TEST: 'test'
};


/**
 * All keys used in chrome.storage.sync
 * @enum {string}
 */
ydn.crm.base.ChromeSyncKey = {
  CONTEXT_PANEL_POSITION: 'cp-po',
  CONTEXT_PANEL_STICKY_BTN_STATE: 'cp-bs',
  LOGGING_CAPTURE_ON_CONSOLE: 'lg-cc',
  LOGGING_BUG_REPORT: 'lg-br',
  LOGGING_ANALYTICS: 'lg-an',
  LOGGING_DEBUG: 'lg-db',
  USER_SETTING: 'user-setting',
  /**
   * SugarCRM module caching option
   * Value format example:
   * <pre>
   *   {
   *     'full': Array<ydn.crm.su.ModuleName>,
   *     'partial': Array<ydn.crm.su.ModuleName>
   *   }
   * </pre>
   * @see ydn.crm.su.RecordUpdater#update
   */
  SUGAR_CACHING_OPTION: 'su-ch-pro',
  SUGAR_SETTING: 'sugarcrm-setting'
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
ydn.crm.base.LOGIN_ORIGIN = 'https://www.yathit.com'; //'http://localhost:8080'; //


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
ydn.crm.base.LOGIN_PAGE = 'login.html';


/**
 * @const
 * @type {string}
 */
ydn.crm.base.URL_USER_PORTAL = 'https://www.yathit.com/portal/index.html';


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
 * List of keys available synchronously by caching.
 * @type {Array.<string>}
 */
ydn.crm.base.ChromeSyncKeysNow = [
  ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION
];


/**
 * All keys used in localStorage.
 * @enum {string}
 */
ydn.crm.base.LocalStorageKey = {
  TEST: 'test'
};


/**
 * @enum {string} type of license edition as define in {@link YdnCrm.UserLicense}
 */
ydn.crm.base.LicenseEdition = {
  BASIC: 'BASIC',
  EXPRESS: 'EXPRESS',
  STANDARD: 'STANDARD',
  TRIAL: 'TRIAL'
};


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
 * Feature name.
 * Note: Also use for displaying feature name to user.
 * @enum {string} Feature limited by user license.
 */
ydn.crm.base.Feature = {
  EDIT_RECORD: 'editing record',
  SYNC: 'sync',
  TEMPLATE: 'template',
  ATTACHMENT: 'attachment',
  SOCIAL: 'social',
  TRACKING: 'tracking'
};


/**
 * Message token broadcast across documents.
 * @enum {string}
 */
ydn.crm.base.BroadcastToken = {
  /**
   * A window want to close itself, since it jobs has finished.
   */
  CLOSING: 'closing',
  /**
   * Command to close window.
   */
  CLOSE: 'close'
};


/**
 * @param {string} id yathit login id.
 * @return {string} db name for user.
 */
ydn.crm.base.makeUserDbName = function(id) {
  return 'setting-' + id;
};


/**
 * Type of analytics, we want to collect.
 * @type {Object}
 */
ydn.crm.base.analytic = {
  app: {
    channelConnection: true
  },
  database: {
    stat: true
  },
  sugarcrm: {
    databaseSyncUpdate: true
  },
  sync: {
    sync: false
  },
  logging: {
    debugLogger: false
  }
};


/**
 * @define {string} link/email tracking origin server.
 */
ydn.crm.base.TRACKING_ORIGIN = 'https://yathit-app.appspot.com';


/**
 * @return {string}
 */
ydn.crm.base.getOptionPage = function() {
  return chrome.runtime.getURL(ydn.crm.base.OPTION_PAGE);
};


/**
 * @enum {string} position of context panel in Gmail.
 */
ydn.crm.base.ContextPanelPosition = {
  WIDGET: 'wg',
  INLINE: 'in',
  NONE: 'no',
  RIGHT_BAR: 'rb',
  STICKY: 'st'
};


/**
 * All positions.
 * @type {Array.<ydn.crm.base.ContextPanelPosition>}
 */
ydn.crm.base.ContextPanelPositions = [
  ydn.crm.base.ContextPanelPosition.WIDGET,
  ydn.crm.base.ContextPanelPosition.INLINE,
  ydn.crm.base.ContextPanelPosition.NONE,
  ydn.crm.base.ContextPanelPosition.RIGHT_BAR,
  ydn.crm.base.ContextPanelPosition.STICKY];


/**
 * List of error used in crm packages.
 * @enum {string}
 */
ydn.crm.base.ErrorName = {
  BACKEND_ERROR: 'BackendError',
  HOST_PERMISSION: 'HostPermissionError',
  INPUT_ARG: 'InputArgumentError',
  INVALID_LOGIN: 'InvalidLoginError',
  INVALID_SESSION: 'Invalid SessionError',
  NETWORK: 'NetworkError',
  NOT_AUTHORIZE: 'NotAuthorizeError',
  NOT_READY: 'NotReadyError'
};


/**
 * @type {ydn.crm.base.AppShortName}
 * @private
 */
ydn.crm.base.app_name_;


/**
 * App short_name as defined in manifest.
 * @return {ydn.crm.base.AppShortName}
 */
ydn.crm.base.getAppShortName = function() {
  if (!ydn.crm.base.app_name_) {
    var mani = chrome.runtime.getManifest();
    if (mani['short_name'] == ydn.crm.base.AppShortName.EMAIL_TRACKER) {
      ydn.crm.base.app_name_ = ydn.crm.base.AppShortName.EMAIL_TRACKER;
    } else if (mani['short_name'] == ydn.crm.base.AppShortName.EMAIL_TRACKER_GMAIL) {
      ydn.crm.base.app_name_ = ydn.crm.base.AppShortName.EMAIL_TRACKER_GMAIL;
    } else if (mani['short_name'] == ydn.crm.base.AppShortName.SUGARCRM) {
      ydn.crm.base.app_name_ = ydn.crm.base.AppShortName.SUGARCRM;
    } else {
      ydn.crm.base.app_name_ = ydn.crm.base.AppShortName.OTHERS;
      if (goog.DEBUG) {
        throw new Error('Invalid app name');
      }
    }
  }
  return ydn.crm.base.app_name_;
};


/**
 * Check for email tracker app.
 * @return {boolean}
 */
ydn.crm.base.isEmailTracker = function() {
  var app = ydn.crm.base.getAppShortName();
  return app == ydn.crm.base.AppShortName.EMAIL_TRACKER ||
      app == ydn.crm.base.AppShortName.EMAIL_TRACKER_GMAIL;
};


/**
 * Record key is externally defined and no index in store.
 * @const
 * @type {string} database object store name for storing general records.
 */
ydn.crm.base.STORE_GENERAL = 'general';


/**
 * Keys use in general store.
 * @enum {string}
 */
ydn.crm.base.GeneralStoreKey = {
  USER_LICENSE: 'user-license'
};


/**
 * Key for record store in server.
 * @enum {string}
 */
ydn.crm.base.KeyRecordOnServer = {
  /**
   * define in {@link YdnCrm.UserSettingGoogle}
   */
  USER_SETTING_GOOGLE: 'ws-us-go',
  /**
   * define in {@link YdnCrm.UserSettingGDataM8}
   */
  USER_SETTING_GDATA_CONTACT: 'ws-us-gdata-m8',
  /**
   * define in {@link YdnCrm.UserSettingGDataCal}
   */
  USER_SETTING_GDATA_CAL: 'ws-us-gdata-cal',
  /**
   * define in {@link YdnCrm.UserSettingSugarCrm}
   */
  USER_SETTING_SUGARCRM: 'ws-us-su'
};


/**
 * @const
 * @type {!Array<ydn.crm.base.KeyRecordOnServer>}
 */
ydn.crm.base.chromeLocalKeysWithServer = [
  ydn.crm.base.KeyRecordOnServer.USER_SETTING_GOOGLE,
  ydn.crm.base.KeyRecordOnServer.USER_SETTING_GDATA_CONTACT,
  ydn.crm.base.KeyRecordOnServer.USER_SETTING_GDATA_CAL,
  ydn.crm.base.KeyRecordOnServer.USER_SETTING_SUGARCRM];


