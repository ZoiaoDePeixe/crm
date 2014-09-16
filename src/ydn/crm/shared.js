/**
 * @fileoverview Shared services.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.shared');
goog.require('goog.log');
goog.require('goog.net.XhrManager');
goog.require('ydn.client.AdaptorClient');
goog.require('ydn.client.Client');
goog.require('ydn.client.FilteredClient');
goog.require('ydn.client.OAuthProvider');
goog.require('ydn.client.Proxy');
goog.require('ydn.client.RichClient');
goog.require('ydn.client.SimpleClient');
goog.require('ydn.db.Storage');
goog.require('ydn.debug');
goog.require('ydn.debug.DbLogger');
goog.require('ydn.http');
goog.require('ydn.testing.ErrorLogger');


/**
 * @type {goog.debug.Logger}
 */
ydn.crm.shared.logger =
    goog.log.getLogger('ydn.crm');


/**
 * Log to console.
 */
ydn.crm.shared.log = function() {
  ydn.debug.log('ydn.crm', 'finer');
};


/**
 * @type {goog.net.XhrManager}
 * @private
 */
ydn.crm.shared.xhr_manager_;


/**
 * Get default xhr manager.
 * @return {!goog.net.XhrManager}
 */
ydn.crm.shared.getXhrManager = function() {
  if (!ydn.crm.shared.xhr_manager_) {
    /**
     * @final
     */
    ydn.crm.shared.xhr_manager_ = new goog.net.XhrManager(0);
  }
  return ydn.crm.shared.xhr_manager_;
};


/**
 * Storage for the app.
 * @type {ydn.db.Storage}
 */
ydn.crm.shared.app_db = null;


/**
 * Value of sync storage key, cached for async read.
 * @type {Object}
 * @protected
 */
ydn.crm.shared.sync_caches = {};


/**
 * Handle chrome.storage.local changes that related to app setting.
 * @param {Object} obj
 * @param {string} name
 * @protected
 */
ydn.crm.shared.handleStorageChange = function(obj, name) {
  // console.log(obj, name);
  if (name == 'sync') {
    if (goog.isObject(obj[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE])) {
      ydn.debug.captureOnConsole(!!obj[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE].newValue);
    }
    if (goog.isObject(obj[ydn.crm.base.ChromeSyncKey.LOGGING_BUG_REPORT])) {
      ydn.debug.DbLogger.instance.setCapturing(!!obj[ydn.crm.base.ChromeSyncKey.LOGGING_BUG_REPORT].newValue);
    }
    if (goog.isObject(obj[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION])) {
      // update with default value.
      ydn.crm.shared.sync_caches[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION] =
          obj[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION].newValue || ydn.crm.ui.ContextPanelPosition.INLINE;
    }
  }
};


/**
 * Value of sync storage key, cached for synchronous read.
 * @param {ydn.crm.base.ChromeSyncKey} key keys listed in ydn.crm.base.ChromeSyncKeysNow.
 * @return {*}
 */
ydn.crm.shared.getValueBySyncKey = function(key) {
  return ydn.crm.shared.sync_caches[key];
};


/**
 * Call to Google Analytics.
 *
 * @param {string} cmd 'send'
 * @param {string} event
 * @param {string} label 'image2'
 * @param {string=} opt_action 'clicked'
 */
ydn.crm.shared.ga = function(cmd, event, label, opt_action) {
  if (goog.global['googleAnalytic']) {
    goog.global['googleAnalytic'](cmd, event, label, opt_action);
  } else {
    var data = {
      'cmd': cmd,
      'event': event,
      'label': label,
      'action': opt_action || ''
    };
    ydn.debug.ILogger.instance.log(data);
  }
};


/**
 * @type {boolean} flag to indicated init() has been called.
 * @private
 */
ydn.crm.shared.init_ = false;


/**
 * Store name to store general data.
 * @type {string}
 */
ydn.crm.shared.APP_STORE_NAME_DEFAULT = 'default';


/**
 * Key name in default store for install id.
 * @type {string}
 */
ydn.crm.shared.INSTALL_ID_KEY = 'install-id';


/**
 * Install id, consider unchanged until app was uninstalled.
 * @type {string}
 */
ydn.crm.shared.install_id = '';


/**
 * @const
 * @type {number}
 */
ydn.crm.shared.uptime = goog.now();


/**
 * Get content script file name.
 * @return {!goog.async.Deferred}
 */
ydn.crm.shared.getContentScriptName = function() {
  var df = new goog.async.Deferred();
  var key = ydn.crm.base.LocalKey.TRACK;
  var base_path = 'jsc/';
  var fn_prefix = 'ydn.crm.sugarcrm-';
  chrome.storage.local.get(key, function(data) {
    var track = data[key];
    var fn = base_path + fn_prefix + ydn.crm.sugarcrm.Version.STABLE + '.js';
    if (navigator.onLine && track == ydn.crm.base.Track.EDGE) {
      fn = 'https://ydn-src-1.storage.googleapis.com/jsc/' + fn_prefix + 'edge.js';
    } else if (track == ydn.crm.base.Track.BETA) {
      fn = base_path + fn_prefix + ydn.crm.sugarcrm.Version.BETA + '.js';
    } else if (track == ydn.crm.base.Track.RC) {
      fn = base_path + fn_prefix + ydn.crm.sugarcrm.Version.RC + '.js';
    }
    df.callback(fn);
    var obj = {};
    obj[ydn.crm.base.LocalKey.SUGARCRM_SRC] = fn; // set for option page
    chrome.storage.local.set(obj);
  });
  return df;
};


/**
 * Initialize shared data.
 * Initialization is only done once, but this method can be call multiple time,
 * just to ignore repeat call.
 */
ydn.crm.shared.init = function() {
  if (ydn.crm.shared.init_) {
    return;
  }
  ydn.crm.shared.init_ = true;

  var title = 'Yathit CRM Bridge ydn.crm.version ' + ydn.crm.version;
  if (goog.DEBUG) {
    title += ' (dev)';
    ydn.debug.log('ydn.crm', 'fine');
    ydn.debug.log('ydn.crm.inj.App', 'finer');
    ydn.debug.log('ydn.ds', 'fine');
  }
  goog.global.console.info(title);
  goog.global.console.info('API documentation: http://dev.yathit.com/\n' +
      'Feedback and suggestion: https://yathit.uservoice.com/\n' +
      'Bug report: https://github.com/yathit/sugarcrm-gmail-chrome-extension');
  ydn.debug.captureOnConsole(false);

  ydn.crm.shared.getClient(); // initialize default client

  var log_store = ydn.debug.DbLogger.getStoreSchema();
  var app_schema = /** @type {Object} */ ({
    'stores': [{
      name: 'log',
      keyPath: 'key'
    }, log_store, {
      name: ydn.crm.shared.APP_STORE_NAME_DEFAULT,
      autoIncrement: true
    }]
  });
  var db_options = {
    'isSerial': false,
    'policy': 'multi',
    'mechanisms': ['indexeddb']
  };
  ydn.crm.shared.app_db = new ydn.db.Storage('ydn.crm',
      /** @type {!DatabaseSchema} */ (app_schema));
  ydn.debug.DbLogger.instance = new ydn.debug.DbLogger(ydn.crm.shared.app_db);
  ydn.debug.DbLogger.instance.setRecordLimit(10000);
  ydn.debug.DbLogger.instance.setLevelLimit(300);
  ydn.debug.DbLogger.instance.addFilter('ydn.db.tr.DbOperator');
  ydn.debug.DbLogger.instance.setCapturing(false); // default to log.

  ydn.crm.shared.app_db.onReady(function(x) {
    ydn.crm.shared.app_db.get(ydn.crm.shared.APP_STORE_NAME_DEFAULT, ydn.crm.shared.INSTALL_ID_KEY)
        .addCallback(function(obj) {
          if (!obj) {
            ydn.crm.shared.install_id = goog.now() + Math.random().toFixed(8).substr(2);
            obj = {};
            obj[ydn.crm.shared.INSTALL_ID_KEY] = ydn.crm.shared.install_id;
            ydn.crm.shared.app_db.put(ydn.crm.shared.APP_STORE_NAME_DEFAULT, obj, ydn.crm.shared.INSTALL_ID_KEY);
          } else {
            ydn.crm.shared.install_id = obj[ydn.crm.shared.INSTALL_ID_KEY];
          }
          ydn.debug.ILogger.instance.setSubfix(ydn.crm.shared.install_id);
        });
  });

  ydn.crm.shared.logger.info('Starting ydn.crm.App:' + ydn.crm.version);
  // local store application setting.
  var keys = [ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE,
    ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION,
    ydn.crm.base.ChromeSyncKey.LOGGING_BUG_REPORT];
  chrome.storage.sync.get(keys, function(x) {
    var ch = {};
    for (var i = 0; i < keys.length; i++) {
      if (goog.isDef(x[keys[i]])) {
        ch[keys[i]] = {
          'newValue': x[keys[i]]
        };
      }
    }
    ydn.crm.shared.handleStorageChange(ch, 'sync');
  });
  chrome.storage.onChanged.addListener(ydn.crm.shared.handleStorageChange);

  var log_filter = function(data) {
    if (!data) {
      return null;
    }
    if (data['HttpRequestData'] &&
        data['HttpRequestData']['path'] == 'https://mail.google.com/mail/feed/atom/bazinga') {
      return null;
    }
    /*
    var user = ydn.api.User.getInstance();
    if (user && user.isLogin()) {
      data['id'] = user.getEmail();
    }
     data['uptime'] = uptime;

    data['install-id'] = ydn.crm.shared.install_id;
     */
    return data;
  };
  ydn.debug.ILogger.instance = new ydn.testing.ErrorLogger(ydn.crm.shared.app_db, log_filter);
  ydn.client.error_logger = ydn.debug.ILogger.instance;
  // goog.asserts.assert(!window.onerror, 'window.onerror already defined.');
  window['onerror'] = function winOnError(msg, url, lineNumber, error) {
    // about forth parameter: https://code.google.com/p/chromium/issues/detail?id=147127
    var tr = '';
    if (!!error && error instanceof Error) {
      tr = error.stack + '';
    }
    var obj = {
      'message': msg,
      'url': url,
      'lineNumber': lineNumber,
      'stack': tr
    };
    // console.log(msg, url, error);
    ydn.debug.ILogger.log(obj);
  };
};


/**
 * @private
 * @type {ydn.client.SimpleClient}
 */
ydn.crm.shared.client_;


/**
 * @return {ydn.client.SimpleClient} Get default client.
 */
ydn.crm.shared.getClient = function() {
  if (!ydn.crm.shared.client_) {
    ydn.crm.shared.client_ = new ydn.client.SimpleClient(
        ydn.crm.shared.getXhrManager());
    ydn.client.setClient(ydn.crm.shared.client_, ydn.http.Scopes.DEFAULT); // set default client.
  }
  return ydn.crm.shared.client_;
};


/**
 * Setup clients after login.
 * @param {ydn.client.OAuthProvider} token_provider
 */
ydn.crm.shared.setupClients = function(token_provider) {
  ydn.crm.shared.getLoginClient();
  ydn.crm.shared.getProxyClient();
  ydn.crm.shared.getAppClient();
  var gdata_client = new ydn.client.OAuthClient(token_provider, ydn.crm.shared.xhr_manager_, false);
  ydn.client.setClient(gdata_client, ydn.http.Scopes.GOOGLE_CLIENT);
  var proxy_url = ydn.crm.base.LOGIN_ORIGIN + '/proxy/';
  var gdata_proxy = new ydn.client.Proxy(gdata_client, proxy_url, true);
  var gse = new ydn.client.FilteredClient(function(req) {
    return req.method == 'GET';
  }, gdata_client, gdata_proxy);
  ydn.client.setClient(gse, ydn.http.Scopes.GSE);
};


/**
 * @return {ydn.client.Client}
 */
ydn.crm.shared.getLoginClient = function() {
  var client = ydn.client.getClient(ydn.http.Scopes.LOGIN);
  if (!client) {
    ydn.crm.shared.getClient();
    client = new ydn.client.RichClient(
        ydn.crm.shared.getXhrManager(), undefined, ydn.crm.base.LOGIN_ORIGIN, 0, true);
    ydn.client.setClient(client, ydn.http.Scopes.LOGIN);
  }
  return client;
};


/**
 * @return {ydn.client.Client}
 */
ydn.crm.shared.getProxyClient = function() {
  var client = ydn.client.getClient(ydn.http.Scopes.PROXY);
  if (!client) {
    client = new ydn.client.Proxy(ydn.crm.shared.getLoginClient(), '/proxy/');
    ydn.client.setClient(client, ydn.http.Scopes.PROXY);
  }
  return client;
};


/**
 * @return {ydn.client.Client}
 */
ydn.crm.shared.getAppClient = function() {
  var client = ydn.client.getClient(ydn.http.Scopes.AUTH);
  if (!client) {
    client = new ydn.client.RichClient(
        ydn.crm.shared.getXhrManager(), undefined, ydn.crm.base.LOGIN_ORIGIN +
        '/a/' + ydn.crm.base.APP_ID, 0, true);
    ydn.client.setClient(client, ydn.http.Scopes.AUTH);
  }
  return client;
};


/**
 *
 * @param {Object} data
 * @return {!goog.async.Deferred.<CrmApp.MetaContact>}
 */
ydn.crm.shared.getSocialInfo = function(data) {
  if (!goog.isObject(data)) {
    goog.async.Deferred.fail('Invalid request data');
  }
  var email = data['email'];
  if (!goog.isString(email) || !/\S+@\S+\.\S+/.test(email)) {
    goog.async.Deferred.fail('Invalid request data for email ' + email);
  }
  return ydn.crm.shared.getFullContact(email).addCallback(function(fc) {
    return {
      'fc': fc
    };
  });
};


/**
 * @param {string} email
 */
ydn.crm.shared.getSocialInfoDump = function(email) {
  ydn.crm.shared.getSocialInfo({'email': email}).addBoth(function(x) {
    window.console.log(x);
  });
};


/**
 *
 * @param {string} email
 * @return {!goog.async.Deferred}
 */
ydn.crm.shared.getFullContact = function(email) {
  var df = new goog.async.Deferred();
  email = email.trim().toLowerCase();
  var req = new ydn.client.HttpRequestData('/so/info', 'POST', {'email': email});
  ydn.crm.shared.getLoginClient().request(req).execute(function(json, raw) {
    // window.console.log(json);
    if (json) {
      df.callback(json);
    } else {
      df.errback(raw);
    }
  });
  return df;
};
