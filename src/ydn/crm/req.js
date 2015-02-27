/**
 * @fileoverview About this file
 */


goog.provide('ydn.crm.ch.Req');
goog.provide('ydn.crm.ch.SReq');


/**
 * Request to background thread.
 * @enum {string}
 */
ydn.crm.ch.Req = {
  APP_SETTING: 'app-setting',
  ACK: 'ack', // acknowledge message
  BADGE_UPDATE: 'badge-update', // update browser action logo
  CLOSE: 'close',
  /**
   * @desc setting user setting
   * @see ydn.crm.AppSetting#setUserSettingOnServer
   */
  CHROME_LOCAL_KEY_WITH_SERVER: 'clkws',
  DNT_ADD: 'dnt-add',
  DNT_QUERY: 'dnt-query',
  DNT_REMOVE: 'dnt-remove',
  EXPORT_RECORD: 'export-record',
  ECHO: 'echo',
  FEED_LOG: 'feed-log', // list of log
  FEED_LOG_INFO: 'feed-log-info', // list of info log
  /**
   * @desc send feedback.
   * @see ydn.crm.app.App#sendFeedback
   */
  FEEDBACK: 'feedback',
  /**
   * @desc Get list of calenders.
   * @see ydn.ds.gapps.cal.list
   */
  GAPPS_LIST_CAL: 'ga-lc',
  /**
   * @desc Create a new calender.
   * @see ydn.ds.gapps.cal.create
   */
  GAPPS_NEW_CAL: 'ga-nc',
  GDATA_CONTACT_MERGE: 'gdcm', // merge contact data
  GDATA_COUNT: 'gdc', // count contact data
  /**
   * @desc list by 'email' or 'externalid'
   * @see {ydn.crm.app.App#gdataQuery}
   */
  GDATA_LIST_CONTACT: 'gdata-list-contact',
  GDATA_UPDATE: 'gdata-update',  // update from server
  LIST_SUGAR: 'list-sugarcrm', // list sugarcrm about
  LIST_SUGAR_DOMAIN: 'list-sugarcrm-domain', // list sugarcrm domain
  /**
   * @desc Log message data in background page.
   * @see ydn.debug.ILogger.log
   */
  LOG: 'log',
  /**
   * @desc Set logging preference for analytic.
   * For getting preference, read directly from `chrome.storage.sync`.
   * @see ydn.crm.ui.UserSetting#handleRequest
   */
  LOGGING_PREF_ANALYTIC: 'lg-pref-qa',
  /**
   * @desc Set logging preference for debug.
   * @see ydn.crm.ui.UserSetting#handleRequest
   */
  LOGGING_PREF_DEBUG: 'lg-pref-bg',
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
  /**
   * @desc get social activity feed.
   * @see ydn.so.Loader#getFeed
   */
  SOCIAL_FEED: 'social-feed',
  /**
   * @desc get social profile
   * @see ydn.so.MetaData#query
   */
  SOCIAL_PROFILE: 'social-profile',
  /**
   * @desc get social profile
   * @see ydn.so.Loader#getProfileDetail
   */
  SOCIAL_PROFILE_DETAIL: 'social-profile-detail',
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
  /**
   * @desc user license.
   * @see {ydn.crm.AppSetting#getUserLicense}
   */
  USER_LICENSE: 'user-license'
};


/**
 * Broadcast requests.
 * @enum {string}
 */
ydn.crm.ch.BReq = {
  // LIST_DOMAINS: 'list-sugarcrm-domains', // list of domain name of sugarcrm
  HOST_PERMISSION: 'host-permission',
  /**
   * SugarCRM message. Data object has, 'type', 'about' and 'domain' attribute.
   * 'type' could be 'init', 'login', or 'remove'. In case of login and init,
   * 'about' data is available.
   * @see ydn.crm.app.App#doSugarLogin
   * @see ydn.crm.app.App#initSugarClient_
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
ydn.crm.ch.SReq = {
  ABOUT: 'about', // return domain, username
  ACTIVITY_STREAM: 'activity-stream',
  ACTIVITY_UPCOMING: 'activity-upcoming',
  CLEAR_CACHE: 'clear-cache', // delete database
  COUNT: 'count', // count number of record in a module
  DELETE_RECORD: 'delete-record', //
  /**
   * @desc sugarcrm detail info
   * @see {ydn.crm.su.Client#getDetails}
   */
  DETAILS: 'details',
  FETCH_MODULE: 'fetch-module', // fetch module entries
  /**
   * @desc get module entry by id or index key.
   * @see ydn.crm.su.Client#getEntry
   */
  GET: 'get',
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
   * @see {ydn.crm.su.Client#getAvailableModules}
   */
  LIST_MODULE: 'list-module',
  /**
   * @desc list all name and id in module.
   * @see {ydn.crm.su.Client#listName}
   */
  LIST_NAME: 'list-name',
  LOGIN: 'login',
  LOGIN_USER: 'login-user', // current login user record (Users module)
  /**
   * @desc login information or user setting in sugarcrm
   * @see {ydn.crm.su.Client#login_info_}
   */
  LOGIN_INFO: 'login-info',
  /**
   * @desc create a new record
   * @see ydn.crm.su.Client#putRecord
   */
  NEW_RECORD: 'new-record',
  PUT_RECORD: 'put-record', //
  /**
   * @desc Generic query
   * @see {ydn.crm.su.Client#query}
   */
  QUERY: 'query',
  /**
   * @desc List embedded records.
   * @see {ydn.crm.su.Client#queryEmbedded}
   */
  QUERY_EMBEDDED: 'query-embedded',
  /**
   * @desc List related records.
   * @see {ydn.crm.su.Client#queryRelated}
   */
  QUERY_RELATED: 'query-related',
  /**
   * @desc Query records similar to given gdata contact entry.
   * @see {ydn.crm.su.Client#querySimilar}
   */
  QUERY_SIMILAR: 'query-similar',
  REST: 'rest', // SugarCRM REST request
  /**
   * @desc free text query for full text search
   * @see {ydn.crm.su.Client#search}
   */
  SEARCH: 'search',
  SERVER_INFO: 'server-info',
  /**
   * @desc set relationship
   * @see ydn.crm.su.Client#setRelationships
   */
  SET_REL: 'set-rel',
  STATS: 'stats', // statistic of cached data
  /**
   * @desc remove sync record that link contact gdata with sugar record.
   * @see {ydn.crm.app.App#unlink}
   * @see #LINK
   */
  UNLINK: 'unlink',
  /**
   * @desc upload document.
   * @see ydn.crm.su.Client#handleUpload_
   */
  UPLOAD_DOC: 'upload-doc',
  UPDATE_NOW: 'update-now', // begin database update process
  VALUES: 'values' // record values query
};

