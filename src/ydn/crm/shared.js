/**
 * @fileoverview Shared services.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.shared');
goog.require('goog.log');
goog.require('ydn.crm.base');
goog.require('ydn.crm.base.ContextPanelPosition');
goog.require('ydn.crm.inj.BackgroundLogger');
goog.require('ydn.debug');
goog.require('ydn.debug.ILogger');
goog.require('ydn.http');



/**
 * @type {goog.log.Logger}
 */
ydn.crm.shared.logger = goog.log.getLogger('ydn.crm');


/**
 * @type {boolean} flag to indicated init() has been called.
 * @private
 */
ydn.crm.shared.init_ = false;


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
 * @see ydn.crm.shared.setLogOnConsole to enable or disable logging.
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
 * Log to console.
 * @param {boolean} enabled enable or disable logging on 'ydn.crm' namespace.
 * @see ydn.crm.shared.setLogging to log for specific namespace.
 */
ydn.crm.shared.setLogOnConsole = function(enabled) {
  ydn.crm.shared.setLogging('ydn.crm', 'fine');
  var obj = {};
  obj[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE] = !!enabled;
  chrome.storage.sync.set(obj);
  ydn.debug.captureOnConsole(!!enabled);
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

  window['onerror'] = function winOnError(msg, url, lineNumber, error) {
    // about forth parameter: https://code.google.com/p/chromium/issues/detail?id=147127
    var tr = '';
    if (!!error && error instanceof Error) {
      tr = error.stack + '';
    }
    var obj = {
      'category': 'error',
      'action': 'window.onerror',
      'value': lineNumber,
      'detail': {
        'message': msg,
        'url': url,
        'stack': tr
      }
    };
    // console.log(msg, url, error);
    ydn.debug.ILogger.log(obj);
  };
};


/**
 * @type {Object<Function>}
 * @private
 */
ydn.crm.shared.logs_ = {};


/**
 * Begin analytic logging. Logging will be end by calling {@link #logAnalyticEnd}
 * or timeout.
 * @param {string} category 'ui'
 * @param {string} action 'save'
 * @param {string=} opt_label '371f00e7-739a-eb65-3c2b-547fd5a2f235'
 * @return {number} analytic id to continue or finish logging.
 */
ydn.crm.shared.logAnalyticBegin = function(category, action, opt_label) {
  var id;
  var logEnd = function(opt_new_label, opt_value) {
    if (goog.isDefAndNotNull(opt_new_label)) {
      opt_label = opt_new_label;
    }
    ydn.crm.shared.logAnalyticValue(category, action, opt_label, opt_value);
    delete ydn.crm.shared.logs_[id];
  };
  id = setTimeout(logEnd, 1000);
  ydn.crm.shared.logs_[id] = logEnd;
  return id;
};


/**
 * End analytic logging.
 * @param {number} id previously begin analytic id.
 * @param {?string=} opt_label '371f00e7-739a-eb65-3c2b-547fd5a2f235'
 * @param {(number|Object|string)=} opt_value `{'message': 'OK'}`
 */
ydn.crm.shared.logAnalyticEnd = function(id, opt_label, opt_value) {
  if (ydn.crm.shared.logs_[id]) {
    ydn.crm.shared.logs_[id](opt_label, opt_label);
    clearTimeout(id);
  }
};


/**
 * @type {ydn.crm.inj.BackgroundLogger}
 */
ydn.crm.shared.bg_logger = new ydn.crm.inj.BackgroundLogger();


/**
 * Analytic logging in content script.
 *
 * This should send to background page via postMessaging.
 * @param {string} category 'ui'
 * @param {string} action 'save'
 * @param {string} label '371f00e7-739a-eb65-3c2b-547fd5a2f235'
 * @param {(number|Object|string)=} opt_value `{'message': 'OK'}`
 * @see ydn.crm.app.shared.logAnalyticValue for logging in background page.
 */
ydn.crm.shared.logAnalyticValue = function(category, action, label, opt_value) {
  ydn.crm.shared.bg_logger.log({
    'category': category,
    'action': action,
    'label': label,
    'value': opt_value
  });
};


/**
 * @type {string}
 */
ydn.crm.shared.application_name = 'Yathit CRM';

