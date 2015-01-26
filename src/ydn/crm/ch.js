/**
 * @fileoverview About this file
 */

goog.provide('ydn.crm.Ch');
goog.provide('ydn.crm.Ch.Req');
goog.provide('ydn.crm.Ch.SReq');
goog.require('goog.async.Deferred');
goog.require('ydn.msg.Pipe');



/**
 * @constructor
 */
ydn.crm.Ch = function() {

};


/**
 * @final
 * @private
 * @type {Object.<ydn.msg.Pipe>}
 */
ydn.crm.Ch.channels_ = {};


/**
 * Get channel.
 * @param {string} name
 * @return {ydn.msg.Pipe}
 * @deprecated use ydn.msg instead
 */
ydn.crm.Ch.getChannel = function(name) {
  return ydn.crm.Ch.channels_[name];
};


/**
 * List channels, excluding main channel.
 * @return {Array.<string>}
 */
ydn.crm.Ch.list = function() {
  return Object.keys(/** @type {!Object} */ (ydn.crm.Ch.channels_));
};


/**
 * Request to background thread.
 * @enum {string}
 */
ydn.crm.Ch.Req = {
  APP_SETTING: 'app-setting',
  ACK: 'ack', // acknowledge message
  ANGLE_LIST: 'angle-list',
  BADGE_UPDATE: 'badge-update', // update browser action logo
  CLOSE: 'close',
  DNT_ADD: 'dnt-add',
  DNT_QUERY: 'dnt-query',
  DNT_REMOVE: 'dnt-remove',
  EXPORT_RECORD: 'export-record',
  ECHO: 'echo',
  FEED_LOG: 'feed-log', // list of log
  FEED_LOG_INFO: 'feed-log-info', // list of info log
  GDATA_UPDATE: 'gdata-update',  // update from server
  GDATA_CONTACT_MERGE: 'gdcm', // merge contact data
  GDATA_COUNT: 'gdc', // count contact data
  /**
   * @desc list by 'email' or 'externalid'
   * @see {ydn.crm.app.App#gdataQuery}
   */
  GDATA_LIST_CONTACT: 'gdata-list-contact',
  G_PLUS: 'google-plus',
  LIST_SUGAR: 'list-sugarcrm', // list sugarcrm about
  LIST_SUGAR_DOMAIN: 'list-sugarcrm-domain', // list sugarcrm domain
  LOG: 'log', // log bug
  LOGIN_INFO: 'login-info', // google user info, email and id
  LOGGED_IN: 'logged-in', // has been logged to server.
  LOGGED_OUT: 'logged-out',
  NEW_ENTRY: 'new-entry',
  /**
   * @desc create a new sugar channel, if not already exist.
   * @see {ydn.crm.app.App#initSugarClient}
   */
  NEW_SUGAR: 'new-sugarcrm',
  NUKE: 'nk', // clear db
  REMOVE_SUGAR: 'remove-sugar',
  REQUEST: 'request', // send request to database
  REQUEST_HOST_PERMISSION: 'request-host-permission',
  SERVER_AUDIT_LOG: 'server-audit-log',
  SOCIAL_PROFILE: 'social-profile',
  SUGAR_SERVER_INFO: 'sugar-server-info',
  SYNC: 'sync', // begin sync between gdata and record
  /**
   * @desc sync a given sync record
   * @see {ydn.crm.app.App#syncFor}
   */
  SYNC_FOR: 'sync-for',
  SYNC_GET_LAST: 'sync-gl', // get last sync time
  /**
   * @desc query sync record data
   * @see {ydn.crm.app.App#syncQuery}
   */
  SYNC_QUERY: 'sync-q',
  TOKEN_GDATA: 'token-gdata', //
  TOKEN_REVOKE_GDATA: 'token-revoke-gdata',
  TRACKING_CLEAR_DNT: 'tracking-clear-dnt',
  TRACKING_SELF_OPEN: 'tracking-self-open', // notify self access
  TRACKING_QUERY: 'tracking-query',
  TRACKING_UPDATE: 'tracking-update',
  TWITTER: 'twitter'
};


/**
 * Broadcast requests.
 * @enum {string}
 */
ydn.crm.Ch.BReq = {
  // LIST_DOMAINS: 'list-sugarcrm-domains', // list of domain name of sugarcrm
  HOST_PERMISSION: 'host-permission',
  /**
   * SugarCRM message. Data object has, 'type', 'about' and 'domain' attribute.
   * 'type' could be 'init', 'login', or 'remove'. In case of login and init,
   * 'about' data is available. In case of 'remove' only 'domain' is available.
   * @see ydn.crm.app.App#doSugarLogin
   * @see ydn.crm.app.App#handleClientLogin
   * @see ydn.crm.app.App#removeSugarClient
   */
  SUGARCRM: 'sugarcrm', // changes in sugarcrm instance. login, logout
  LOGGED_OUT: 'logout',
  LOGGED_IN: 'login',
  NEW_TRACKING_POINT: 'new-tracing-point'
};


/**
 * Request to background thread for specific sugarcrm.
 * @enum {string}
 */
ydn.crm.Ch.SReq = {
  ABOUT: 'about', // return domain, username
  ACTIVITY_STREAM: 'activity-stream',
  ACTIVITY_UPCOMING: 'activity-upcoming',
  CLEAR_CACHE: 'clear-cache', // delete database
  COUNT: 'count', // count number of record in a module
  DELETE_RECORD: 'delete-record', //
  /**
   * @desc sugarcrm detail info
   * @see {ydn.crm.sugarcrm.Client#getDetails}
   */
  DETAILS: 'details',
  FETCH_MODULE: 'fetch-module', // fetch module entries
  GET: 'get', // get module entry
  IMPORT_GDATA: 'import-gdata',
  INFO_MODULE: 'info-module', // list module field
  KEYS: 'keys', // list keys
  /**
   * @desc link contact gdata with sugar record.
   * @see {ydn.crm.app.App#link}
   * @see #UNLINK
   */
  LINK: 'link',  // should be GDATA_LINK
  /**
   * @desc list of available modules.
   * @see {ydn.crm.sugarcrm.Client#getAvailableModules}
   */
  LIST_MODULE: 'list-module',
  /**
   * @desc list all name and id in module.
   * @see {ydn.crm.sugarcrm.Client#listName}
   */
  LIST_NAME: 'list-name',
  LOGIN: 'login',
  LOGIN_USER: 'login-user', // current login user record (Users module)
  /**
   * @desc login information or user setting in sugarcrm
   * @see {ydn.crm.sugarcrm.Client#login_info_}
   */
  LOGIN_INFO: 'login-info',
  NEW_RECORD: 'new-record', // create a new record
  PUT_RECORD: 'put-record', //
  /**
   * @desc Generic query
   * @see {ydn.crm.sugarcrm.Client#query}
   */
  QUERY: 'query',
  /**
   * @desc List embedded records.
   * @see {ydn.crm.sugarcrm.Client#queryEmbedded}
   */
  QUERY_EMBEDDED: 'query-embedded',
  /**
   * @desc List related records.
   * @see {ydn.crm.sugarcrm.Client#queryRelated}
   */
  QUERY_RELATED: 'query-related',
  /**
   * @desc Query records similar to given gdata contact entry.
   * @see {ydn.crm.sugarcrm.Client#querySimilar}
   */
  QUERY_SIMILAR: 'query-similar',
  REST: 'rest', // SugarCRM REST request
  /**
   * @desc free text query for full text search
   * @see {ydn.crm.sugarcrm.Client#search}
   */
  SEARCH: 'search',
  SERVER_INFO: 'server-info',
  STATS: 'stats', // statistic of cached data
  /**
   * @desc remove sync record that link contact gdata with sugar record.
   * @see {ydn.crm.app.App#unlink}
   * @see #LINK
   */
  UNLINK: 'unlink',
  UPLOAD_DOC: 'upload-doc', // upload document.
  UPDATE_NOW: 'update-now', // begin database update process
  VALUES: 'values' // record values query
};

