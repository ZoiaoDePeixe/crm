/**
 * @fileoverview Use setting used in front end.
 */


goog.provide('ydn.crm.ui.UserSetting');
goog.require('goog.asserts');
goog.require('goog.async.DeferredList');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');
goog.require('goog.dom.forms');
goog.require('goog.log');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.shared');
goog.require('ydn.gmail.Utils');
goog.require('ydn.msg');
goog.require('ydn.object');
goog.require('ydn.ui.MessageBox');



/**
 * Front end user setting.
 * @constructor
 * @extends {goog.events.EventTarget}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 * @struct
 */
ydn.crm.ui.UserSetting = function() {
  goog.base(this);
  /**
   * @type {?YdnApiUser}
   */
  this.login_info = null;
  this.user_setting = null;

  /**
   * User setting for sugarcrm.
   * @type {?CrmApp.SugarCrmSetting}
   * @private
   */
  this.sugar_settings_ = null;

  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this.df_ = null;

  ydn.crm.shared.init(); // make sure initialized.

  /**
   * Gmail.
   * @type {?string}
   * @private
   */
  this.gmail_ = null;
  /**
   * @type {string}
   * @private
   */
  this.login_id_md5_ = '';

  goog.events.listen(ydn.msg.getMain(),
      [ydn.crm.Ch.BReq.LOGGED_OUT, ydn.crm.Ch.BReq.LOGGED_IN],
      this.handleLoginProcess_, false, this);
};
goog.inherits(ydn.crm.ui.UserSetting, goog.events.EventTarget);
goog.addSingletonGetter(ydn.crm.ui.UserSetting);


/**
 * @enum {string} login/logout event.
 */
ydn.crm.ui.UserSetting.EventType = {
  LOGIN: 'login',
  LOGOUT: 'logout'
};


/**
 * @param {ydn.msg.Event} e
 * @private
 */
ydn.crm.ui.UserSetting.prototype.handleLoginProcess_ = function(e) {
  var type = e.type == ydn.crm.Ch.BReq.LOGGED_IN ?
      ydn.crm.ui.UserSetting.EventType.LOGIN : ydn.crm.ui.UserSetting.EventType.LOGOUT;
  goog.log.finer(this.logger, 'receiving ' + e.type + ' event');
  this.invalidate().addBoth(function() {
    goog.log.fine(this.logger, 'dispatching ' + type + ' event');
    this.dispatchEvent(new goog.events.Event(type, this));
  }, this);
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.ui.UserSetting.DEBUG = false;


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.crm.ui.UserSetting.prototype.logger = goog.log.getLogger('ydn.crm.ui.UserSetting');


/**
 * True if login to YDN server.
 * @return {boolean}
 */
ydn.crm.ui.UserSetting.prototype.isLogin = function() {
  return !!this.login_info && this.login_info.is_login;
};


/**
 * True if login to YDN server and, if in content script, email account and
 * login account are same.
 * @return {boolean}
 */
ydn.crm.ui.UserSetting.prototype.hasValidLogin = function() {
  return this.isLogin() && (!this.gmail_ || this.gmail_ == this.login_info.email);
};


/**
 * @return {?YdnApiUser}
 */
ydn.crm.ui.UserSetting.prototype.getUserInfo = function() {
  return this.login_info; // should return cloned object.
};


/**
 * Return user set value or default. UI component need this to be readable
 * synchronously.
 * @return {ydn.crm.base.ContextPanelPosition}
 */
ydn.crm.ui.UserSetting.prototype.getContextPanelPosition = function() {

  var val = ydn.crm.shared.getValueBySyncKey(ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION) ||
      ydn.crm.base.ContextPanelPosition.INLINE;
  return /** @type {ydn.crm.base.ContextPanelPosition} */ (val);
};


/**
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.onReady = function() {
  if (!this.df_) {
    // init data.
    var me = this;

    chrome.storage.sync.get(ydn.crm.base.SyncKey.USER_SETTING, function(val) {
      var x = val[ydn.crm.base.SyncKey.USER_SETTING];
      me.user_setting = x || ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT;
    });

    this.loadSugarCrmSetting();

    var df = ydn.gmail.Utils.getUserEmail().addBoth(function(email) {
      this.gmail_ = email;
      var msg = email ? 'Loading user setting for ' + email : 'User setting not available.';
      ydn.crm.msg.Manager.addStatus(msg);
      goog.log.fine(this.logger, msg);
      return ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOGIN_INFO, {
        'gmail': email
      }).addCallbacks(function(x) {
        var info = /** @type {YdnApiUser} */ (x);
        this.login_info = info;
        msg = 'Login attempt to Yathit server failed.';
        if (info) {
          if (info.is_login) {
            msg = info.email + ' login.';
            goog.log.fine(this.logger, msg);
            ydn.crm.msg.Manager.addStatus(msg);
            this.dispatchEvent(new goog.events.Event(ydn.crm.ui.UserSetting.EventType.LOGIN, this));
          } else {
            goog.log.fine(this.logger, 'Login required.');
            var mid = ydn.crm.msg.Manager.addStatus('Login required.');
            this.dispatchEvent(new goog.events.Event(ydn.crm.ui.UserSetting.EventType.LOGOUT, this));
          }
        } else {
          goog.log.fine(this.logger, msg);
          ydn.crm.msg.Manager.addStatus(msg);
          this.dispatchEvent(new goog.events.Event(ydn.crm.ui.UserSetting.EventType.LOGOUT, this));
        }

      }, function(e) {
        this.login_info = null;
        ydn.crm.msg.Manager.addStatus('login error.');
        goog.log.warning(this.logger, 'login fail');
        this.dispatchEvent(new goog.events.Event(ydn.crm.ui.UserSetting.EventType.LOGOUT, this));
      }, this);

    }, this);

    this.df_ = new goog.async.Deferred();
    df.chainDeferred(this.df_);
  }
  return this.df_.branch();
};


/**
 * Invalidate login and user setting data.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.invalidate = function() {
  this.login_info = null;
  this.user_setting = null;
  this.df_ = null;
  // this.gmail_ = null; // cannot be changed.
  return this.onReady();
};


/**
 * Get login email address to Yathit server. Call this method only after login.
 * @return {string} gdata_account Google account id, i.e., email address. If call
 * before ready, return empty string.
 */
ydn.crm.ui.UserSetting.prototype.getLoginEmail = function() {
  return this.login_info ? this.login_info.email : '';
};


/**
 * Get login id to Yathit server. Call this method only after login.
 * @return {string} login id.
 */
ydn.crm.ui.UserSetting.prototype.getLoginId = function() {
  goog.asserts.assert(this.login_info, 'UserSetting not ready');
  return this.login_info.Id.$t;
};


/**
 * Get MD5 hash of login id.
 * @return {string} MD5 hash of login id.
 */
ydn.crm.ui.UserSetting.prototype.getLoginIdMd5 = function() {
  if (!this.login_id_md5_) {
    var md5 = new goog.crypt.Md5();
    md5.update(this.getLoginId());
    this.login_id_md5_ = goog.crypt.byteArrayToHex(md5.digest());
  }
  return this.login_id_md5_;
};


/**
 * In gmail content script, this return gmail address.
 * @return {?string} gmail address.
 */
ydn.crm.ui.UserSetting.prototype.getGmail = function() {
  return this.gmail_;
};


/**
 * Initialize.
 * @param {string} name domain name.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.getModuleInfo = function(name) {
  var channel = ydn.msg.getChannel(ydn.msg.Group.SUGAR, name);
  return this.onReady().branch().addCallback(function() {
    return channel.send(ydn.crm.Ch.SReq.INFO_MODULE).addCallback(function(x) {
      if (goog.isArray(x)) {
        for (var i = 0; i < x.length; i++) {
          ydn.crm.sugarcrm.fixSugarCrmModuleMeta(x[i]);
        }
      } else {
        ydn.crm.sugarcrm.fixSugarCrmModuleMeta(x);
      }
      return x;
    }, this);
  }, this);

};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.UserSetting.KEY_USER_SETTING = 'sugar-setting';


/**
 * Keys.
 * @enum {string}
 */
ydn.crm.ui.UserSetting.Key = {
  CRM_IN_INBOX: 'crmininbox',
  TRACKING: 'tracking' // tracking setting
};


/**
 * @const
 * @type {!Object}
 */
ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT = {};


/**
 * Get user setting from memory. User setting is loaded to memory when
 * this object is ready.
 * This will return default setting, if user is not login or not ready.
 * @param {ydn.crm.ui.UserSetting.Key} key
 * @param {...string} var_args
 * @return {*}
 * @see #getSugarCrmSetting
 */
ydn.crm.ui.UserSetting.prototype.getSetting = function(key, var_args) {
  var obj = this.user_setting || ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT;
  return goog.object.getValueByKeys(obj, goog.array.clone(arguments));
};


/**
 * Get user setting to memory and persist to persistent storage.
 * @param {*} val value to store
 * @param {ydn.crm.ui.UserSetting.Key} key
 * @param {...string} var_args keys
 */
ydn.crm.ui.UserSetting.prototype.setSetting = function(val, key, var_args) {
  this.user_setting = this.user_setting || ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT;
  var key_path = key;
  for (var i = 2; i < arguments.length; i++) {
    if (arguments[i]) {
      key_path += '.' + arguments[i];
    }
  }
  ydn.db.utils.setValueByKeys(this.user_setting, key_path, val);

  var store = {};
  store[ydn.crm.base.SyncKey.USER_SETTING] = this.user_setting;
  chrome.storage.sync.set(store);
};


/**
 * @return {!CrmApp.SugarCrmSetting}
 * @private
 */
ydn.crm.ui.UserSetting.getDefaultSugarCrmSetting_ = function() {
  var obj = /** @type {!CrmApp.SugarCrmSetting} */ ({'Module': {}});
  for (var i = 0; i < ydn.crm.sugarcrm.CacheModules.length; i++) {
    var name = ydn.crm.sugarcrm.CacheModules[i];
    obj.Module[name] = /** @type {!CrmApp.SugarCrmModuleSetting} */ (
        {'Group': {}, 'Field': {}});
  }
  return obj;
};


/**
 * Get SugarCrm setting.
 * @return {!goog.async.Deferred<CrmApp.SugarCrmSetting>}
 */
ydn.crm.ui.UserSetting.prototype.loadSugarCrmSetting = function() {
  // keep setting in memory so that, setting is shared among sugarcrm instance.
  if (!this.sugar_settings_) {
    var me = this;
    var df = new goog.async.Deferred();
    var key = ydn.crm.base.SyncKey.SUGAR_SETTING;
    chrome.storage.sync.get(key, function(val) {
      me.sugar_settings_ = val[key] || ydn.crm.ui.UserSetting.getDefaultSugarCrmSetting_();
      df.callback(me.sugar_settings_);
    });
    return df;
  } else {
    return goog.async.Deferred.succeed(this.sugar_settings_);
  }
};


/**
 * Persist sugarcrm setting.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.saveSugarCrmSetting = function() {
  var key = ydn.crm.base.SyncKey.SUGAR_SETTING;
  var obj = {};
  obj[key] = this.sugar_settings_;
  var df = new goog.async.Deferred();
  chrome.storage.sync.set(obj, function() {
    df.callback(obj);
  });
  return df;
};


/**
 * Key of CrmApp.SugarCrmSettingUnit
 * @enum {string}
 */
ydn.crm.ui.UserSetting.SugarCrmSettingUnitKey = {
  NORMALLY_HIDE: 'normallyHide'
};


/**
 * @return {!CrmApp.SugarCrmSetting}
 * @see #getSetting
 */
ydn.crm.ui.UserSetting.prototype.getSugarCrmSetting = function() {
  if (!this.sugar_settings_) {
    this.loadSugarCrmSetting();
  }
  return this.sugar_settings_ || ydn.crm.ui.UserSetting.getDefaultSugarCrmSetting_();
};



/**
 * Show a setting dialog box.
 * @param {goog.async.Deferred} df
 * @constructor
 * @extends {goog.ui.Dialog}
 * @protected
 */
ydn.crm.ui.UserSetting.Dialog = function(df) {
  goog.base(this);
  this.df_ = df;
  var title = 'Yathit CRM Setting';
  this.setButtonSet(goog.ui.Dialog.ButtonSet.createOkCancel());
  this.setTitle(title);
  this.setEscapeToCancel(true);
  this.setHasTitleCloseButton(false);
  this.setModal(true);
  this.setDisposeOnHide(true);

  var content = this.getContentElement();
  content.classList.add('ydn-crm');
  goog.soy.renderElement(content, templ.ydn.crm.inj.setting);

  var hd = this.getHandler();
  hd.listen(this, goog.ui.Dialog.EventType.SELECT, this.handleSelect);
  hd.listen(this, goog.ui.Dialog.EventType.SELECT, this.handleCancel);
};
goog.inherits(ydn.crm.ui.UserSetting.Dialog, goog.ui.Dialog);


/**
 * Get basic form element
 * @return {HTMLFormElement}
 */
ydn.crm.ui.UserSetting.Dialog.prototype.getBasicSettingFrom = function() {
  var form = this.getContentElement().querySelector('form.basic-setting');
  return /** @type {HTMLFormElement} */ (form);
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.ui.UserSetting.Dialog.prototype.handleSelect = function(e) {
  if (this.df_) {
    var form = this.getBasicSettingFrom();
    var setting = {};
    setting[ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION] =
        goog.dom.forms.getValueByName(form, 'context-panel-position');
    setting[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE] =
        !!goog.dom.forms.getValueByName(form, 'log-on-console');
    this.df_.callback(setting);
    this.df_ = null;
  }
};


/**
 * @protected
 * @param {Event} e
 */
ydn.crm.ui.UserSetting.Dialog.prototype.handleCancel = function(e) {
  if (this.df_) {
    this.df_.callback(null);
    this.df_ = null;
  }
};


/**
 * Show a setting dialog box.
 * @return {!goog.async.Deferred.<boolean>} return true if setting has changed.
 */
ydn.crm.ui.UserSetting.prototype.show = function() {
  var title = 'Yathit CRM Setting';
  if (!this.hasValidLogin()) {
    return ydn.ui.MessageBox.show(title, 'User setting cannot change because ' +
        'you are not login Yathit server.');
  }
  var df = new goog.async.Deferred();
  var dialog = new ydn.crm.ui.UserSetting.Dialog(df);
  var old_setting;
  var keys = [ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE,
    ydn.crm.base.ChromeSyncKey.CONTEXT_PANEL_POSITION];
  chrome.storage.sync.get(keys, (function(setting) {
    old_setting = setting;
    var form = dialog.getBasicSettingFrom();
    var input_con = form.querySelector('input[name=log-on-console]');
    goog.dom.forms.setValue(input_con,
        !!setting[ydn.crm.base.ChromeSyncKey.LOGGING_CAPTURE_ON_CONSOLE]);
    var positions = form.querySelectorAll('input[name=context-panel-position]');
    var pos = this.getContextPanelPosition();
    for (var i = 0; i < positions.length; i++) {
      if (pos == positions[i].value) {
        positions[i].setAttribute('checked', '1');
        break;
      }
    }
    dialog.setVisible(true);
  }).bind(this));
  return df.addCallback(function(new_setting) {
    if (!new_setting) {
      return;
    }
    var obj = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (new_setting[key] != old_setting[key]) {
        obj[key] = new_setting[key];
      }
    }

    var has_changed = Object.keys(obj).length > 0;
    if (has_changed) {
      chrome.storage.sync.set(obj);
    }
    if (ydn.crm.ui.UserSetting.DEBUG) {
      window.console.log(old_setting, new_setting, has_changed);
    }
    return has_changed;
  });
};


/**
 * @param {ydn.crm.base.Feature} feature
 * @return {boolean}
 */
ydn.crm.ui.UserSetting.hasFeature = function(feature) {
  return ydn.crm.AppSetting.hasFeature(feature);
};

