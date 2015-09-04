/**
 * @fileoverview Google cloud messaging services.
 */

goog.provide('ydn.crm.chrome.gcm3');


/**
 * @define {boolean} debug flag
 */
ydn.crm.chrome.gcm3.DEBUG = false;


/**
 * @const
 * @type {string}
 * @private
 */
ydn.crm.chrome.gcm3.sender_id_ = '164649788853';


/**
 * @type {string}
 * @private
 */
ydn.crm.chrome.gcm3.KEY_REG_ = 'gcm3-reg-id';


/**
 * @type {string}
 * @private
 */
ydn.crm.chrome.gcm3.user_id_ = '';


/**
 * Register when user login.
 * @param {string} user_id
 */
ydn.crm.chrome.gcm3.registerForUser = function(user_id) {
  if (!user_id) {
    if (ydn.crm.chrome.gcm3.DEBUG) {
      window.console.error('user_id required');
    }
    return;
  }
  ydn.crm.chrome.gcm3.user_id_ = user_id;
  ydn.crm.chrome.gcm3.sendToServerIfNecessary_();
};


ydn.crm.chrome.gcm3.sendToServer_ = function(params) {
  var http = ydn.crm.app.shared.getLoginClient();
  var headers = {'Content-Type': 'application/json'};
  var hd = new ydn.client.HttpRequestData('/gcm/$register', 'POST', null,
      headers, JSON.stringify(params));
  http.request(hd).execute(function(json, raw) {
    if (raw.isSuccess()) {
      // OK.
    } else {
      window.console.error(raw.getBody());
    }
  });
};


ydn.crm.chrome.gcm3.sendToServerIfNecessary_ = function() {
  if (!ydn.crm.shared.install_id) {
    if (ydn.crm.chrome.gcm3.DEBUG) {
      window.console.info('no install_id');
    }
    return;
  }
  if (!ydn.crm.chrome.gcm3.user_id_) {
    if (ydn.crm.chrome.gcm3.DEBUG) {
      window.console.info('no user_id_');
    }
    return;
  }
  var keys = [ydn.crm.chrome.gcm3.KEY_REG_];
  chrome.storage.local.get(keys, function(result) {
    // If already registered, bail out.
    var reg_id = result[ydn.crm.chrome.gcm3.KEY_REG_];
    if (!reg_id) {
      if (ydn.crm.chrome.gcm3.DEBUG) {
        window.console.info('no reg_id');
      }
      return;
    }
    var obj = {};
    obj['uid'] = ydn.crm.chrome.gcm3.user_id_;
    obj['rid'] = reg_id;
    obj['iid'] = ydn.crm.shared.install_id;
    ydn.crm.chrome.gcm3.sendToServer_(obj);
  });
};


/**
 * @param {string} reg_id
 * @private
 */
ydn.crm.chrome.gcm3.registerCallback_ = function(reg_id) {
  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.
    window.console.error(chrome.runtime.lastError);
    return;
  }
  if (ydn.crm.chrome.gcm3.DEBUG) {
    window.console.info('gcm id: ' + reg_id);
  }
  var obj = {};
  obj[ydn.crm.chrome.gcm3.KEY_REG_] = reg_id;
  chrome.storage.local.set(obj, function() {
    ydn.crm.chrome.gcm3.sendToServerIfNecessary_();
  });
};


chrome.runtime.onInstalled.addListener(function() {  // todo: change to onStartup
  chrome.storage.local.get(ydn.crm.chrome.gcm3.KEY_REG_, function(result) {
    // If already registered, bail out.
    if (result[ydn.crm.chrome.gcm3.KEY_REG_]) {
      return;
    }
    if (ydn.crm.chrome.gcm3.DEBUG) {
      window.console.info('Registering gcm');
    }
    var senderIds = [ydn.crm.chrome.gcm3.sender_id_];
    chrome.gcm.register(senderIds, ydn.crm.chrome.gcm3.registerCallback_);
  });
});


