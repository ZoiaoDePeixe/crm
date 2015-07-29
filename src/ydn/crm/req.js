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
  DNT_ADD: 'dnt-add',
  DNT_QUERY: 'dnt-query',
  DNT_REMOVE: 'dnt-remove',
  EXPORT_RECORD: 'export-record',
  ECHO: 'echo',
  FEED_LOG: 'feed-log', // list of log
  FEED_LOG_INFO: 'feed-log-info', // list of info log
  /**
   * send feedback.
   * @see ydn.crm.app.App#sendFeedback
   */
  FEEDBACK: 'feedback',
  /**
   * Get list of calenders.
   * @see ydn.ds.gapps.cal.list
   */
  GAPPS_LIST_CAL: 'ga-lc',
  /**
   * Create a new calender.
   * @see ydn.ds.gapps.cal.create
   */
  GAPPS_NEW_CAL: 'ga-nc',
  /**
   * Get sugar crm detail. This is entry to start sugarcrm app.
   * @see ydn.crm.app.EventPage#getSugar
   */
  GET_SUGAR: 'get-sugar',
  GDATA_CONTACT_MERGE: 'gdata-cm', // merge contact data
  GDATA_COUNT: 'gdata-dc', // count contact data
  /**
   * list by 'email' or 'externalid'
   * @see {ydn.crm.app.App#gdataQuery}
   */
  GDATA_LIST_CONTACT: 'gdata-list-contact',
  /**
   * update calendar event from server
   * @see ydn.crm.app.App#handleGDataRequest
   */
  GDATA_UPDATE: 'gdata-update',
  LIST_SUGAR: 'list-sugarcrm', // list sugarcrm about
  LIST_SUGAR_DOMAIN: 'list-sugarcrm-domain', // list sugarcrm domain
  /**
   * Log message data in background page.
   * @see ydn.debug.ILogger.log
   */
  LOG: 'log',
  /**
   * Set logging preference for analytic.
   * For getting preference, read directly from `chrome.storage.sync`.
   * @see ydn.crm.ui.UserSetting#handleRequest
   */
  LOGGING_PREF_ANALYTIC: 'lg-pref-qa',
  /**
   * Set logging preference for debug.
   * @see ydn.crm.ui.UserSetting#handleRequest
   */
  LOGGING_PREF_DEBUG: 'lg-pref-bg',
  LOGIN_INFO: 'login-info', // google user info, email and id
  LOGGED_IN: 'logged-in', // has been logged to server.
  LOGGED_OUT: 'logged-out',
  /**
   * update sugarcrm credential and login
   * @see {ydn.crm.app.App#initSugarClient}
   */
  LOGIN_SUGAR: 'login-su',
  NEW_ENTRY: 'new-entry',
  /**
   * create a new sugar channel, if not already exist.
   * @see {ydn.crm.app.App#initSugarClient}
   */
  NEW_SUGAR: 'new-sugarcrm',
  NUKE: 'nk', // clear db
  REMOVE_SUGAR: 'remove-sugar',
  REQUEST: 'request', // send request to database
  REQUEST_HOST_PERMISSION: 'request-host-permission',
  SERVER_AUDIT_LOG: 'server-audit-log',
  /**
   * get social activity feed.
   * @see ydn.so.Loader#getFeed
   */
  SOCIAL_FEED: 'social-feed',
  /**
   * get social profile
   * @see ydn.so.MetaData#query
   */
  SOCIAL_PROFILE: 'social-profile',
  /**
   * get social profile
   * @see ydn.so.Loader#getProfileDetail
   */
  SOCIAL_PROFILE_DETAIL: 'social-profile-detail',
  /**
   * @see ydn.crm.su.HttpClient#sniffServerInfo
   */
  SUGAR_SERVER_INFO: 'sugar-server-info',
  SYNC: 'sync', // begin sync between gdata and record
  /**
   * sync a given sync record
   * @see {ydn.crm.app.App#syncFor}
   */
  SYNC_FOR: 'sync-for',
  SYNC_GET_LAST: 'sync-gl', // get last sync time
  /**
   * query sync record data
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
   * user license.
   * @see {ydn.crm.AppSetting#getUserLicense}
   */
  USER_LICENSE: 'user-license',
  /**
   * setting user setting
   * @see ydn.crm.AppSetting#getUserSettingOnServer
   */
  USER_SETTING_SERVER_GET: 'us-server-get',
  /**
   * setting user setting
   * @see ydn.crm.AppSetting#setUserSettingOnServer
   */
  USER_SETTING_SERVER_SET: 'us-server-set'
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
  SUGARCRM_CACHE_UPDATE: 'sugarcrm-ca-up',
  LOGGED_OUT: 'logout',
  LOGGED_IN: 'login',
  NEW_TRACKING_POINT: 'new-tracing-point'
};


/**
 * Request to background thread for specific sugarcrm.
 * @enum {string}
 */
ydn.crm.ch.SReq = {
  /**
   * Inquery about domain, username, login, host permission
   */
  ABOUT: 'about',
  /**
   * @see ydn.crm.su.Client#listActivityStream
   */
  ACTIVITY_STREAM: 'activity-stream',
  ACTIVITY_UPCOMING: 'activity-upcoming',
  CLEAR_CACHE: 'clear-cache', // delete database
  /**
   * Count number of record in a module either from server or client.
   * @see ydn.crm.su.Client#handleCount_
   */
  COUNT: 'count',
  DELETE_RECORD: 'delete-record', //
  /**
   * sugarcrm detail info
   * @see {ydn.crm.su.Client#getDetails}
   */
  DETAILS: 'details',
  /**
   * <pre> {
   *   'module': 'Contacts',
   *   'id': '371f00e7-739a-eb65-3c2b-547fd5a2f235'
   * }
   * </pre>
   * fetch entry from server.
   * @see ydn.crm.su.Client#fetchEntry
   * @see QUERY_ENTRY
   * @see GET
   */
  FETCH: 'fetch',
  FETCH_MODULE: 'fetch-module', // fetch module entries
  /**
   * Retrieve a list of upcoming activities including Calls, Meetings,Tasks and Opportunities
   * @see ydn.crm.su.Client#fetchUpcomingActivities
   */
  FETCH_UPCOMING_ACTIVITIES: 'fetch-up-act',
  /**
   * Get module entry in database and finally from server.
   * <pre>{
   *   'module': 'Contacts',
   *   'id': '371f00e7-739a-eb65-3c2b-547fd5a2f235'
   * }</pre>
   * get module entry by id or index key.
   * @see ydn.crm.su.Client#getEntry
   * @see #FETCH
   * @see #QUERY_ENTRY
   */
  FIND: 'find',
  /**
   * Get module entry in database and finally from server.
   * <pre>{
   *   'module': 'Contacts',
   *   'id': '371f00e7-739a-eb65-3c2b-547fd5a2f235'
   * }</pre>
   * get module entry by id or index key.
   * @see ydn.crm.su.Client#getEntry
   * @see #FETCH
   * @see #FIND
   */
  GET: 'get',
  /**
   * @see ydn.crm.su.Client#getFavoritesAsync
   */
  GET_FAVORITE_ASYNC: 'get-favorite-async',
  IMPORT_GDATA: 'import-gdata',
  INFO_MODULE: 'info-module', // list module field
  KEYS: 'keys', // list keys
  /**
   * link contact gdata with sugar record.
   * @see {ydn.crm.app.App#link}
   * @see #UNLINK
   */
  LINK: 'link',  // should be GDATA_LINK
  /**
   * list of available modules.
   * @see {ydn.crm.su.Client#getAvailableModules}
   */
  LIST_MODULE: 'list-module',
  /**
   * list all name and id in module.
   * @see {ydn.crm.su.Client#listName}
   */
  LIST_NAME: 'list-name',
  /**
   * List upcoming activities.
   * @see ydn.crm.su.Client#listUpcomingAsync_
   */
  LIST_UPCOMING_ASYNC: 'list-upcoming-async',
  /**
   * Do silence login with stored credentials.
   * @see ydn.crm.su.Client#login
   */
  LOGIN: 'login',
  /**
   * current login user record (Users module)
   * @see ydn.crm.su.Client#getLoginUser
   */
  LOGIN_USER: 'login-user',
  /**
   * login information or user setting in sugarcrm
   * @see {ydn.crm.su.Client#login_info_}
   */
  LOGIN_INFO: 'login-info',
  /**
   * create a new record
   * @see ydn.crm.su.Client#putRecord
   */
  NEW_RECORD: 'new-record',
  PUT_RECORD: 'put-record', //
  /**
   * Generic query
   * @see CrmApp.ReqQuery for query format.
   * @see {ydn.crm.su.Client#query}
   */
  QUERY: 'query',
  /**
   * Query record by email on server.
   * @see {ydn.crm.su.Client#queryByEmailOnServer}
   */
  QUERY_BY_EMAIL_ON_SERVER: 'query-by-email-on-server',
  /**
   * List embedded records.
   * @see {ydn.crm.su.Client#queryEmbedded}
   */
  QUERY_EMBEDDED: 'query-embedded',
  /**
   * Get entry from database and then from server.
   * @see {ydn.crm.su.Client#queryEntry}
   * @see #GET
   * @see #FETCH
   */
  QUERY_ENTRY: 'query-entry',
  /**
   * List related records. Result are return in progress event.
   * @see {ydn.crm.su.Client#queryRelated}
   */
  QUERY_RELATED_ASYNC: 'query-related-async',
  /**
   * List related records by emails.
   * @see {ydn.crm.su.Client#queryRelatedByEmail}
   */
  QUERY_RELATED: 'query-related',
  /**
   * Query records similar to given gdata contact entry.
   * @see {ydn.crm.su.Client#querySimilar}
   */
  QUERY_SIMILAR: 'query-similar',
  REST: 'rest', // SugarCRM REST request
  /**
   * client side free text query for full text search
   * @see {ydn.crm.su.Client#search}
   */
  SEARCH: 'search',
  /**
   * server side search
   * @see {ydn.crm.su.Client#searchByModule}
   */
  SEARCH_BY_MODULE: 'se-bm',
  SERVER_INFO: 'server-info',
  /**
   * set relationship
   * @see ydn.crm.su.Client#setRelationships
   */
  SET_REL: 'set-rel',
  /**
   * statistic of cached data
   * @see ydn.crm.su.Client#getStats
   */
  STATS: 'stats',
  /**
   * remove sync record that link contact gdata with sugar record.
   * @see {ydn.crm.app.App#unlink}
   * @see #LINK
   */
  UNLINK: 'unlink',
  /**
   * upload document or note attachment.
   * @see ydn.crm.su.Client#handleUpload_
   * @see ydn.crm.su.Client#upload
   */
  UPLOAD: 'upload',
  /**
   * Show sugarcrm module sync information.
   * @see ydn.crm.su.RecordUpdater#auditCheckPoint
   */
  UPDATE_AUDIT: 'update-audio',
  /**
   * Remove cached records.
   * @see ydn.crm.su.Client#clearCache
   */
  UPDATE_CLEAR: 'update-clear', //
  /**
   * begin database update process
   * @see ydn.crm.su.Client#updateNow_
   */
  UPDATE_NOW: 'update-now', //
  /**
   * Remove sync checkpoint.
   * @see ydn.crm.su.RecordUpdater#resetCheckPoint
   */
  UPDATE_RESET_CHECKPOINT: 'update-reset',
  VALUES: 'values' // record values query
};

