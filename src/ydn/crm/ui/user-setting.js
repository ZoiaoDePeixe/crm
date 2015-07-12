// Copyright 2014 YDN Authors. All Rights Reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//    This program is distributed in the hope that it will be useful,
//    but WITHOUT ANY WARRANTY; without even the implied warranty of
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//    GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


/**
 * @fileoverview Use setting used in front end.
 *
 *  * @author kyawtun@yathit.com (Kyaw Tun)
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
goog.require('ydn.crm.IUser');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.su');
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
 * @implements {ydn.crm.IUser}
 */
ydn.crm.ui.UserSetting = function() {
  goog.base(this);
  /**
   * @type {?YdnApiUser}
   */
  this.login_info = null;
  /**
   * @protected
   * @type {Object}
   */
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

  /**
   * @type {YdnCrm.UserLicense}
   * @private
   */
  this.user_license_ = null;

  goog.events.listen(ydn.msg.getMain(),
      [ydn.crm.ch.BReq.LOGGED_OUT, ydn.crm.ch.BReq.LOGGED_IN],
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
  var type = e.type == ydn.crm.ch.BReq.LOGGED_IN ?
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
  return this.isLogin() && (!this.gmail_ ||
      ydn.string.normalizeEmail(this.gmail_) ==
      ydn.string.normalizeEmail(this.login_info.email));
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
 * @private
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.loadUserLicense_ = function() {
  return ydn.msg.getChannel().send(ydn.crm.ch.Req.USER_LICENSE).addCallback(function(x) {
    this.user_license_ = x || null;
  }, this);
};


/**
 * @return {boolean}
 */
ydn.crm.ui.UserSetting.prototype.isReady = function() {
  return !!this.df_ && this.df_.hasFired();
};


/**
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.onReady = function() {
  if (!this.df_) {
    // init data.

    var me = this;

    chrome.storage.sync.get(ydn.crm.base.ChromeSyncKey.USER_SETTING, function(val) {
      var x = val[ydn.crm.base.ChromeSyncKey.USER_SETTING];
      me.user_setting = x || ydn.crm.ui.UserSetting.USER_SETTING_DEFAULT;
    });

    var df_su = this.loadSugarCrmSetting();

    var df = ydn.gmail.Utils.sniffUserEmail().addBoth(function(email) {
      var msg = '';
      if (goog.isString(email)) {
        msg = 'Loading user setting for ' + email;
      } else {
        msg = 'Error on figuring out Gmail username: ' + String(email);
        email = '';
        ydn.crm.shared.logAnalyticValue('app', 'gmail-fail-sniffing', 'fail-sniffing', {
          'error': String(email)
        });
      }
      this.gmail_ = email;
      ydn.crm.msg.Manager.addStatus(msg);
      goog.log.fine(this.logger, msg);
      return ydn.msg.getChannel().send(ydn.crm.ch.Req.LOGIN_INFO, {
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
            this.dispatchEvent(new goog.events.Event(ydn.crm.ui.UserSetting.EventType.LOGIN,
                this));
            return this.loadUserLicense_();
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
        ydn.crm.msg.Manager.addStatus('login error ' + e);
        goog.log.warning(this.logger, 'login fail: ' + e);
        this.dispatchEvent(new goog.events.Event(ydn.crm.ui.UserSetting.EventType.LOGOUT, this));
      }, this);

    }, this);

    this.df_ = goog.async.DeferredList.gatherResults([df, df_su]);
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
  this.user_license_ = null;
  this.df_ = null;
  // this.gmail_ = null; // does not changed, as long as same url.
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
 * @deprecated no longer using.
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
    return channel.send(ydn.crm.ch.SReq.INFO_MODULE).addCallback(function(x) {
      if (goog.isArray(x)) {
        for (var i = 0; i < x.length; i++) {
          ydn.crm.su.fixSugarCrmModuleMeta(x[i]);
        }
      } else {
        ydn.crm.su.fixSugarCrmModuleMeta(x);
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
 * @see ydn.crm.ui.UserSetting#getUserSetting for background page.
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
  store[ydn.crm.base.ChromeSyncKey.USER_SETTING] = this.user_setting;
  chrome.storage.sync.set(store);
};


/**
 * Get user setting store in server.
 * The record itself is cached locally in
 * chrome.storage.local.
 * @param {ydn.crm.base.KeyCLRecordOnServer} key
 * @return {!goog.async.Deferred<Object>}
 */
ydn.crm.ui.UserSetting.prototype.getSettingOnServer = function(key) {
  var data = {
    'key': key
  };
  return ydn.msg.getChannel().send(
      ydn.crm.ch.Req.USER_SETTING_SERVER_GET, data);
};


/**
 * Set user setting store in server.
 * @param {ydn.crm.base.KeyCLRecordOnServer} key
 * @param {Object} value
 * @return {!goog.async.Deferred}
 * @see #patchSettingOnServer for updating only one field.
 * @see ydn.crm.AppSetting#setUserSettingOnServer on server side.
 */
ydn.crm.ui.UserSetting.prototype.setSettingOnServer = function(key, value) {
  var data = {
    'key': key,
    'value': value
  };
  return ydn.msg.getChannel().send(
      ydn.crm.ch.Req.USER_SETTING_SERVER_SET, data);
};


/**
 * Update specific field value.
 * @param {ydn.crm.base.KeyCLRecordOnServer} key
 * @param {YdnCrm.UserSettingRecord} patch corresponding patch object. If field value is
 * undefined or null the field value will be deleted.
 * @return {!goog.async.Deferred}
 */
ydn.crm.ui.UserSetting.prototype.patchSettingOnServer = function(key, patch) {
  return this.getSettingOnServer(key).addCallback(function(val) {
    if (!goog.isObject(val) || goog.isArray(val)) {
      // in very strange situation, val is an array
      val = {};
    }
    for (var field in patch) {
      var value = patch[field];
      if (goog.isDefAndNotNull(value)) {
        val[field] = value;
      } else {
        delete val[field];
      }
    }
    if (ydn.crm.ui.UserSetting.DEBUG) {
      window.console.log(key, val);
    }
    return this.setSettingOnServer(key, val);
  }, this);
};


/**
 * @return {!CrmApp.SugarCrmSetting}
 * @private
 */
ydn.crm.ui.UserSetting.getDefaultSugarCrmSetting_ = function() {
  var obj = /** @type {!CrmApp.SugarCrmSetting} */ ({'Module': {}});
  for (var i = 0; i < ydn.crm.su.CacheModules.length; i++) {
    var name = ydn.crm.su.CacheModules[i];
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
    var key = ydn.crm.base.ChromeSyncKey.SUGAR_SETTING;
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
  var key = ydn.crm.base.ChromeSyncKey.SUGAR_SETTING;
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
    this.sugar_settings_ = ydn.crm.ui.UserSetting.getDefaultSugarCrmSetting_();
  }
  return /** @type {!CrmApp.SugarCrmSetting} */(this.sugar_settings_);
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
 * @const
 * @type {!Array<ydn.crm.base.Feature>}
 */
ydn.crm.ui.UserSetting.features_not_in_express = [
  ydn.crm.base.Feature.SOCIAL,
  ydn.crm.base.Feature.TRACKING
];


/**
 * Check user has granted to use the feature.
 * @param {ydn.crm.base.Feature} feature
 * @param {boolean=} opt_show_msg show not support function to user.
 * @return {boolean}
 */
ydn.crm.ui.UserSetting.prototype.hasFeature = function(feature, opt_show_msg) {
  if (this.user_license_) {
    var ok = false;
    var edition = this.user_license_.edition;
    if (edition == ydn.crm.base.LicenseEdition.STANDARD) {
      ok = true;
    } else if (edition == ydn.crm.base.LicenseEdition.EXPRESS) {
      var not = goog.array.contains(ydn.crm.ui.UserSetting.features_not_in_express, feature);
      ok = !not;
    } else if (edition == ydn.crm.base.LicenseEdition.TRIAL) {
      ok = true;
    } else {
      // basic
      ok = false;
    }
    if (!ok && opt_show_msg) {
      var lbl = chrome.i18n.getMessage('your_license_not_have_feature',
          [this.getLicense(), feature]);
      ydn.ui.MessageDialog.showModal(YathitCrm.name, lbl);
    }
    return ok;
  }
  goog.log.warning(this.logger, 'user license not found');
  return true;
};


/**
 * @return {string} user license edition.
 */
ydn.crm.ui.UserSetting.prototype.getLicense = function() {
  return this.user_license_ ? this.user_license_.edition : '';
};
