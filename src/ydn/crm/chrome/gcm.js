/**
 * @fileoverview Google cloud messaging service.
 *
 * @deprecated Use gcm2 instead
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.chrome.gcm');


/**
 * @define {boolean} debug flag
 */
ydn.crm.chrome.gcm.DEBUG = false;


/**
 * Setup for user.
 * @type {ydn.api.User}
 * @private
 */
ydn.crm.chrome.gcm.user_ = null;


/**
 * Registration id for sending to server. This value exists only when the
 * registration id is not yet sent to server.
 * After successful sending back to server, registration id can be found in
 * chrome local storage.
 * @type {string}
 * @private
 */
ydn.crm.chrome.gcm.registration_id_ = '';


/**
 * Next retry interval.
 * @type {number} in second.
 * @private
 */
ydn.crm.chrome.gcm.retry_interval_ = 0;


/**
 * @const
 * @type {string}
 */
ydn.crm.chrome.gcm.BACKEND_URL = ydn.crm.base.TRACKING_ORIGIN + '/gcm/';


/**
 * User different ID for testing and production.
 * @define {string} Project Number as sender ID.
 */
ydn.crm.chrome.gcm.SENDER_ID = '968361937576';


/**
 * Set registration id.
 * @param {string} reg_id
 * @private
 */
ydn.crm.chrome.gcm.setRegistrationId_ = function(reg_id) {
  chrome.storage.local.get(ydn.crm.base.ChromeLocalKey.GCM_REG_ID, function(obj) {
    if (!obj[ydn.crm.base.ChromeLocalKey.GCM_REG_ID]) {
      obj[ydn.crm.base.ChromeLocalKey.GCM_REG_ID] = {};
    }
    obj[ydn.crm.base.ChromeLocalKey.GCM_REG_ID][ydn.crm.chrome.gcm.SENDER_ID] =
        reg_id;
    chrome.storage.local.set(obj);
  });
};


/**
 * @type {boolean}
 * @private
 */
ydn.crm.chrome.gcm.registration_in_progress_ = false;


/**
 * @type {number}
 * @private
 */
ydn.crm.chrome.gcm.req_timeout_ = 0;


/**
 * Reschedule registration.
 * @private
 */
ydn.crm.chrome.gcm.rescheduleRegistration_ = function() {
  if (ydn.crm.chrome.gcm.req_timeout_) {
    // already schedule to send message.
    if (goog.DEBUG) {
      window.console.warn('Rescheduling already in progress.');
    }
    return;
  }

  ydn.crm.chrome.gcm.retry_interval_++;
  ydn.crm.chrome.gcm.retry_interval_ = ydn.crm.chrome.gcm.retry_interval_ *
      ydn.crm.chrome.gcm.retry_interval_;
  if (ydn.crm.chrome.gcm.retry_interval_ > 3600 ||
      ydn.crm.chrome.gcm.retry_interval_ <= 0) {
    ydn.crm.chrome.gcm.retry_interval_ = 15 * 60;
  }

  ydn.crm.chrome.gcm.req_timeout_ = setTimeout(function() {
    ydn.crm.chrome.gcm.processSendRegistrationId();
    ydn.crm.chrome.gcm.req_timeout_ = 0;
  }, (ydn.crm.chrome.gcm.retry_interval_ * 1000));

  if (goog.DEBUG) {
    window.console.warn('Registration will try again in ' +
        ydn.crm.chrome.gcm.retry_interval_ + 's.');
  }
};


/**
 * Send the registration ID to application server. The process will start ony
 * if user is login and registration id exist. If these two condition met,
 * sending process will try until it finished.
 * After this process is finish, registration id will clear in #registration_id_
 * and set in chrome local storage.
 * @protected
 */
ydn.crm.chrome.gcm.processSendRegistrationId = function() {
  if (!ydn.crm.chrome.gcm.user_ || !ydn.crm.chrome.gcm.user_.isLogin()) {
    if (ydn.crm.chrome.gcm.DEBUG) {
      window.console.info('user not ready for registration');
    }
    return;
  }
  if (!ydn.crm.chrome.gcm.registration_id_) {
    if (ydn.crm.chrome.gcm.DEBUG) {
      window.console.info('no registration id');
    }
    return;
  }
  if (!ydn.crm.shared.install_id) {
    if (ydn.crm.chrome.gcm.DEBUG) {
      window.console.info('no install_id id');
    }
    ydn.crm.chrome.gcm.rescheduleRegistration_();
    return;
  }
  if (ydn.crm.chrome.gcm.registration_in_progress_) {
    if (ydn.crm.chrome.gcm.DEBUG) {
      window.console.info('Already in progress');
    }
    return;
  }
  var client = ydn.client.getClient();
  var url = ydn.crm.chrome.gcm.BACKEND_URL + ydn.crm.chrome.gcm.user_.getUserId();
  var params = {
    'mid': ydn.crm.chrome.gcm.registration_id_,
    'sid': ydn.crm.shared.install_id
  };
  var req = client.request(new ydn.client.HttpRequestData(url, 'PUT', params));
  if (ydn.crm.chrome.gcm.DEBUG) {
    window.console.info('sending registration id: ' + ydn.crm.chrome.gcm.registration_id_);
  }
  ydn.crm.chrome.gcm.registration_in_progress_ = true;
  req.execute(function(json, raw) {
    if (ydn.crm.chrome.gcm.DEBUG) {
      window.console.log(raw);
    }
    ydn.crm.chrome.gcm.registration_in_progress_ = false;
    var status = raw.getStatus();
    if (!status) { // network error, we will try again.
      ydn.crm.chrome.gcm.rescheduleRegistration_();
    } else if (status == 200) {
      ydn.crm.chrome.gcm.registration_id_ = '';
      var uid = ydn.crm.chrome.gcm.user_.getUserId();
      window.localStorage.setItem('gcm_user', uid);
    } else {
      if (goog.DEBUG) {
        window.console.warn('Registration fail: ' + raw.getStatus());
      }
      ydn.crm.app.shared.logAnalyticValue('gcm:registration', 'fail',
          String(raw.getBody()), status);
    }
  });
};


/**
 * Echo service for testing. GCM server should send back echo message via GCM
 * channel.
 * @param {string} val
 */
ydn.crm.chrome.gcm.echo = function(val) {
  var client = ydn.client.getClient();
  var url = ydn.crm.chrome.gcm.BACKEND_URL + 'admin/' + ydn.crm.chrome.gcm.user_.getUserId();
  var params = {
    'echo': val
  };
  var req = client.request(new ydn.client.HttpRequestData(url, 'GET', params));
  req.execute(function(json, raw) {
    if (ydn.crm.chrome.gcm.DEBUG) {
      window.console.log(raw);
    }
  });
};


/**
 * Registration
 * @param {string} reg_id
 */
ydn.crm.chrome.gcm.registerCallback = function(reg_id) {
  if (chrome.runtime.lastError) {
    // When the registration fails, handle the error and retry the
    // registration later.
    if (ydn.crm.chrome.gcm.DEBUG) {
      window.console.warn('registered error', chrome.runtime.lastError);
    }
    return;
  }
  if (ydn.crm.chrome.gcm.DEBUG) {
    window.console.info('receiving registration id: ' + reg_id);
  }
  ydn.crm.chrome.gcm.registration_id_ = reg_id;
  ydn.crm.chrome.gcm.setRegistrationId_(reg_id);
  ydn.crm.chrome.gcm.processSendRegistrationId();
};


/**
 * Validate user login.
 */
ydn.crm.chrome.gcm.validateUserLogin = function() {
  // send registration id to server again, to invalidate cache
  chrome.storage.local.get(ydn.crm.base.ChromeLocalKey.GCM_REG_ID, function(result) {
    var json = result[ydn.crm.base.ChromeLocalKey.GCM_REG_ID];
    var rid = json ? json[ydn.crm.chrome.gcm.SENDER_ID] : '';
    if (rid) {
      ydn.crm.chrome.gcm.registration_id_ = rid;
      ydn.crm.chrome.gcm.processSendRegistrationId();
    }
  });
};


/**
 * @private
 */
ydn.crm.chrome.gcm.register_ = function() {
  if (ydn.crm.chrome.gcm.DEBUG) {
    window.console.info('GCM register');
  }
  chrome.storage.local.get(ydn.crm.base.ChromeLocalKey.GCM_REG_ID, function(result) {
    // If already registered, bail out.
    var json = result[ydn.crm.base.ChromeLocalKey.GCM_REG_ID];
    if (json && json[ydn.crm.chrome.gcm.SENDER_ID]) {
      if (ydn.crm.chrome.gcm.DEBUG) {
        window.console.info('registered already.');
      }
      return;
    }
    var senderIds = [ydn.crm.chrome.gcm.SENDER_ID];
    chrome.gcm.register(senderIds, ydn.crm.chrome.gcm.registerCallback);
  });
};


/**
 * Register GCM registration.
 * @param {ydn.api.User} user
 */
ydn.crm.chrome.gcm.register = function(user) {
  ydn.crm.chrome.gcm.user_ = user;
  if (user.isLogin() && window.localStorage.getItem('gcm_user') == user.getUserId()) {
    return;
  }
  goog.events.listen(user, ydn.api.user.EventType.LOGIN,
      ydn.crm.chrome.gcm.validateUserLogin);

  if (ydn.crm.chrome.gcm.DEBUG) {
    window.console.info('GCM register');
  }

  chrome.runtime.onInstalled.addListener(function(details) {
    ydn.crm.chrome.gcm.register_();
  });

  chrome.runtime.onStartup.addListener(function() {
    ydn.crm.chrome.gcm.register_();
  });
};



