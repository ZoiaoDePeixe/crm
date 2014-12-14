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
goog.require('ydn.crm.base');
goog.require('ydn.crm.base.ContextPanelPosition');
goog.require('ydn.db.Storage');
goog.require('ydn.debug');
goog.require('ydn.debug.DbLogger');
goog.require('ydn.http');
goog.require('ydn.testing.ErrorLogger');


/**
 * @type {goog.log.Logger}
 */
ydn.crm.shared.logger = goog.log.getLogger('ydn.crm');


/**
 * Log to console.
 * @param {boolean} enabled enable or disable logging on 'ydn.crm' namespace.
 */
ydn.crm.shared.log = function(enabled) {
  ydn.crm.shared.setLogging('ydn.crm', 'finer');
  var obj = {};
  obj[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE] = !!enabled;
  chrome.storage.sync.set(obj);
  ydn.debug.log('ydn.crm', 'finer');
  ydn.debug.captureOnConsole(!!enabled);
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
          obj[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION].newValue || ydn.crm.base.ContextPanelPosition.INLINE;
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
 * Inject Universal google analytics for background page.
 * @param {string} id google analytics id
 */
ydn.crm.shared.setupGoogleAnalytic = function(id) {

  throw new Error('NotImpl');

};


/**
 * @const
 * @type {boolean}
 */
ydn.crm.shared.USE_SERVER_ANALYTICS = true;


/**
 * Ad hoc for analytics query.
 * <pre>
 *   var xp = app.xp();
 *   xp.qa({
 *     'email': 'a@b.c',
 *     'category': 'setup',
 *     'list': 'email'        // list unique email
 *   });
 * </pre>
 * @param {Object=} opt_params
 * @param {Function=} opt_cb
 */
ydn.crm.shared.queryAnalytics = function(opt_params, opt_cb) {
  var params = opt_params || {};
  var client = ydn.crm.shared.getLoginClient();
  var hd = new ydn.client.HttpRequestData('/ga/', 'GET', params);
  client.request(hd).execute(function(data) {
    if (opt_cb) {
      opt_cb(data);
    } else {
      delete data['installId'];
      window.console.table(data);
    }
  });
};


/**
 * @protected
 */
ydn.crm.shared.auditListUser = function() {
  ydn.crm.shared.queryAnalytics({'list': 'email'}, function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      window.console.log(obj['email']);
    }
  });
};


/**
 * @protected
 */
ydn.crm.shared.auditUserActivity = function() {
  ydn.crm.shared.queryAnalytics({'list': 'email'}, function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      window.console.log(obj['email']);
    }
  });
};


/**
 * Send event to Google Analytics.
 *
 * @param {string} category 'login'
 * @param {string} action 'click'
 * @param {string=} opt_label 'user-name'
 * @param {(number|Object|string)=} opt_value 'image2'
 */
ydn.crm.shared.gaSend = function(category, action, opt_label, opt_value) {
  /* if (ydn.crm.shared.cpaTracker_) {
    ydn.crm.shared.cpaTracker_.sendEvent(category, action, opt_label, opt_value);
  } else */
  if (location.host == 'gehcogaddkopajdfhbfgokbongbfijnh') {
    // not send for dev.
    return;
  }
  var value = 0;
  var detail = '';
  if (opt_value) {
    if (goog.isNumber(opt_value)) {
      value = opt_value;
    } else if (goog.isString(opt_value)) {
      detail = opt_value;
    } else {
      detail = JSON.stringify(opt_value);
    }
  }
  if (ydn.crm.shared.USE_SERVER_ANALYTICS) {
    var data = {
      'installId': ydn.crm.shared.install_id,
      'category': category,
      'action': action,
      'label': opt_label || '',
      'value': value,
      'detail': detail
    };
    var headers = {
      'content-type': 'application/json'
    };
    var client = ydn.crm.shared.getLoginClient();
    client.request(new ydn.client.HttpRequestData('/ga/', 'POST',
        null, headers, JSON.stringify(data))).execute(null);
  } else if (goog.global['_gaq']) {
    if (goog.global['_gaq'].length > 100) {
      return;
    }
    var arg = ['_trackEvent'];
    for (var i = 0; i < arguments.length; i++) {
      arg.push(arguments[i]);
    }
    goog.global['_gaq']['push'](arg);
  } else if (goog.global['googleAnalytic']) {
    goog.global['googleAnalytic']('send', category, action, action, opt_value);
  } else {
    var data = {
      'category': category,
      'label': action || '',
      'value': opt_value || '',
      'action': action || ''
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
ydn.crm.shared.getFrontEndScriptName = function() {
  var df = new goog.async.Deferred();
  var key = ydn.crm.base.LocalKey.TRACK;
  var base_path = 'jsc/';
  var fn_prefix = 'crmininbox-';
  var Version = goog.global['CRMinInbox']['sugarcrm']['Version'];
  chrome.storage.local.get(key, function(data) {
    var track = data[key];
    var fn = base_path + fn_prefix + Version['release'] + '.js';
    if (window.navigator.onLine && track == ydn.crm.base.Track.EDGE) {
      fn = 'https://ydn-src-1.storage.googleapis.com/jsc/' + fn_prefix + 'edge.js';
    } else if (track == ydn.crm.base.Track.BETA && Version['beta']) {
      fn = base_path + fn_prefix + Version['beta'] + '.js';
    } else if (track == ydn.crm.base.Track.RC && Version['rc']) {
      fn = base_path + fn_prefix + Version['rc'] + '.js';
    }
    df.callback(fn);
    var obj = {};
    obj[ydn.crm.base.LocalKey.FRONT_END_SRC] = fn; // set for option page
    chrome.storage.local.set(obj);
  });
  return df;
};


/**
 * Get Google Analytics UA string.
 * @return {?string} return null if not running under chrome extension.
 */
ydn.crm.shared.getGaUa = function() {
  if (!chrome || !chrome.runtime || !chrome.runtime.id) {
    return null;
  }
  var ua = 'UA-33861582-';
  var uap = '9'; // for dev
  if (chrome.runtime.id == 'ldikiokclnbceabnlbkabmcacpiednop') {
    // Gmail tracker
    uap = '8';
  } else if (chrome.runtime.id == 'iccdnijlhdogaccaiafdpjmbakdcdakk') {
    // SugarCRM
    uap = '6';
  }
  return ua + uap;
};


/**
 * Initialize chrome platform analytics.
 * Tracking with CPA requires host permission to "https://www.google-analytics.com/"
 * See @link https://github.com/GoogleChrome/chrome-platform-analytics/
 * @private
 * @see ydn.crm.shared.initGa_ not used both
 * @deprecated use ydn.crm.shared.initGa_ instead
 */
ydn.crm.shared.initChromePlatformAnalytics_ = function() {
  throw new Error('Not using');
  /*
  var ua = ydn.crm.shared.getGaUa();
  if (!ua) {
    return;
  }
  var service = analytics.getService(chrome.runtime.id);

  ydn.crm.shared.cpaTracker_ = service.getTracker(ua);
  ydn.crm.shared.cpaTracker_.sendAppView('BackgroundView');
  */
};


/**
 * Initialize (old) Google Analytics.
 * @private
 * @see ydn.crm.shared.initChromePlatformAnalytics_ no use both
 */
ydn.crm.shared.initGa_ = function() {
  if (location.protocol != 'chrome-extension:') {
    // we track only from chrome extension only.
    return;
  }
  var ua = ydn.crm.shared.getGaUa();
  if (!ua) {
    return;
  }
  if (goog.global['_gaq']) {
    return;
  }
  goog.global['_gaq'] = [];
  goog.global['_gaq'].push(['_setAccount', ua]);
  goog.global['_gaq'].push(['_gat._forceSSL']);
  goog.global['_gaq'].push(['_trackPageview']);

  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);

};


/**
 * Load custom logging setting.
 * @private
 */
ydn.crm.shared.loadCustomLogging_ = function() {
  chrome.storage.local.get(ydn.crm.base.ChromeLocalKey.CUSTOM_LOGGING, function(json) {
    json = json[ydn.crm.base.ChromeLocalKey.CUSTOM_LOGGING];
    if (json) {
      for (var scope in json) {
        var level = json[scope];
        window.console.info('logging ' + scope + ' enabled to ' + level);
        ydn.debug.log(scope, level);
      }
    }
  });
};


/**
 * Set custom logging level.
 * @param {string} scope logging scope, eg: 'ydn.crm'.
 * @param {string|number} level logging level, eg: 'finer'
 */
ydn.crm.shared.setLogging = function(scope, level) {
  chrome.storage.local.get(ydn.crm.base.ChromeLocalKey.CUSTOM_LOGGING, function(json) {
    var log = json[ydn.crm.base.ChromeLocalKey.CUSTOM_LOGGING];
    if (!log) {
      log = {};
      json[ydn.crm.base.ChromeLocalKey.CUSTOM_LOGGING] = log;
    }
    log[scope] = level;
    ydn.debug.log(scope, level);
    chrome.storage.local.set(json);
  });
};


/**
 * @protected use for debug.
 */
ydn.crm.shared.getLogging = function() {
  chrome.storage.local.get(ydn.crm.base.ChromeLocalKey.CUSTOM_LOGGING, function(json) {
    var log = json[ydn.crm.base.ChromeLocalKey.CUSTOM_LOGGING];
    window.console.log(log);
  });
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
  // ydn.crm.shared.initChromePlatformAnalytics_();
  // ydn.crm.shared.initGa_();

  var title = 'Yathit CRMinInbox ydn.crm.version ' + ydn.crm.version;
  if (goog.DEBUG) {
    title += ' (dev)';
    ydn.debug.log('ydn.crm', 'warning');
    // ydn.debug.log('ydn.crm.app', 'finer');
    // ydn.debug.log('ydn.ds', 'fine');
    // ydn.debug.log('ydn.crm.app.EventPage', 'finest');
  }
  if (goog.log.ENABLED) {
    ydn.crm.shared.loadCustomLogging_();
  }
  goog.global.console.info(title);
  goog.global.console.info('API documentation: http://crm.yathit.com/\n' +
      'Feedback and suggestion: https://yathit.uservoice.com/\n' +
      'Bug report: https://github.com/yathit/sugarcrm-gmail-chrome-extension');
  ydn.debug.captureOnConsole(false);

  ydn.crm.shared.getFrontEndScriptName(); // initialize front end script.
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
