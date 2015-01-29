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
 * @fileoverview SugarCRM model for widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.su.WidgetModel');
goog.require('goog.crypt');
goog.require('goog.crypt.Md5');



/**
 * SugarCRM model for widget.
 * @param {SugarCrm.About=} opt_about SugarCRM instance about info.
 * @constructor
 * @extends {goog.events.EventTarget}
 * @struct
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.su.WidgetModel = function(opt_about) {
  goog.base(this);
  /**
   * @type {SugarCrm.About}
   */
  this.about = opt_about || null;
  /**
   * @type {SugarCrm.ServerInfo}
   */
  this.info = null;

  /**
   * New or existing instance.
   * @type {boolean}
   * @private
   */
  this.is_new_ = !opt_about;

  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);

  if (this.about && this.about.domain) {
    var pipe = ydn.msg.getMain();
    this.handler.listen(pipe, [ydn.crm.Ch.BReq.SUGARCRM, ydn.crm.Ch.BReq.HOST_PERMISSION],
        this.handleMessage);
  }

};
goog.inherits(ydn.crm.su.WidgetModel, goog.events.EventTarget);


/**
 * @override
 * @protected
 */
ydn.crm.su.WidgetModel.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');
  this.info = null;
  this.handler.dispose();
  this.handler = null;
};


/**
 * Return detail.
 * @return {SugarCrm.About}
 */
ydn.crm.su.WidgetModel.prototype.getDetails = function() {
  return this.about;
};


/**
 * Handle message from channel.
 * @param {ydn.msg.Event} e
 */
ydn.crm.su.WidgetModel.prototype.handleMessage = function(e) {

  if (e.type == ydn.crm.Ch.BReq.SUGARCRM) {
    var data = e.getData();
    var about = /** @type {SugarCrm.About} */ (data['about']);
    if (data['login']) {
      var ev;
      if (e.type) {
        ev = new goog.events.Event(ydn.crm.su.SugarEvent.LOGIN, this);
      }
      this.about = about;
      if (ev) {
        this.dispatchEvent(ev);
      }
    }
  } else if (e.type == ydn.crm.Ch.BReq.HOST_PERMISSION && this.about) {
    var msg = e.getData();
    if (msg['grant'] && msg['grant'] == this.getDomain()) {
      this.about.hostPermission = true;
      this.dispatchEvent(new goog.events.Event(ydn.crm.su.SugarEvent.HOST_ACCESS_GRANT));
    }
  }
};


/**
 * Get domain name of the instance.
 * @return {?string}
 */
ydn.crm.su.WidgetModel.prototype.getDomain = function() {
  return this.about ? this.about.domain : null;
};


/**
 * Check login status.
 * @return {boolean}
 */
ydn.crm.su.WidgetModel.prototype.isLogin = function() {
  return this.about ? !!this.about.isLogin : false;
};


/**
 * @return {!ydn.msg.Channel}
 */
ydn.crm.su.WidgetModel.prototype.getChannel = function() {
  var domain = this.getDomain();
  goog.asserts.assert(domain, 'not ready');
  return ydn.msg.getMain().getChannel(ydn.msg.Group.SUGAR, domain);
};


/**
 * Query host permission.
 * @param {function(this: T, boolean)=} opt_cb
 * @param {T=} opt_scope
 * @template T
 * @return {boolean}
 */
ydn.crm.su.WidgetModel.prototype.hasHostPermission = function(opt_cb, opt_scope) {
  var permissions = {
    origins: ['http://' + this.about.domain + '/*', 'https://' + this.about.domain + '/*']
  };
  chrome.permissions.contains(permissions, function(grant) {
    // console.log(scope, grant);
    if (opt_cb) {
      opt_cb.call(opt_scope, grant);
    }
  });
  return !!this.about && !!this.about.hostPermission;
};


/**
 * Request host permission.
 * @param {function(this: T, boolean)} cb
 * @param {T} scope
 * @template T
 */
ydn.crm.su.WidgetModel.prototype.requestHostPermission = function(cb, scope) {
  var domain = this.getDomain();
  // console.assert(!!domain);
  var permissions = {
    origins: ['http://' + domain + '/*', 'https://' + domain + '/*']
  };
  chrome.permissions.request(permissions, function(grant) {
    // console.log(permission, grant);
    cb.call(scope, grant);
  });
};


/**
 *
 * @param {string} url
 * @return {!goog.async.Deferred<SugarCrm.ServerInfo>}
 */
ydn.crm.su.WidgetModel.prototype.getServerInfo = function(url) {
  this.setInstanceUrl(url);
  return ydn.msg.getChannel().send('sugar-server-info', url).addCallback(function(info) {
    // console.log(info);
    this.info = info;
    return info;
  }, this);
};


/**
 * Set domain.
 * @param {string} url sugarcrm instance url
 */
ydn.crm.su.WidgetModel.prototype.setInstanceUrl = function(url) {
  url = url.trim();
  if (url.length < 3 || !/\./.test(url)) {
    return goog.async.Deferred.fail(new Error('Invalid instance ' + url));
  }
  var domain = url.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/.*/, ''); // remove after
  if (!this.about) {
    this.about = /** @type {SugarCrm.About} */ ({
      domain: domain,
      baseUrl: url,
      isLogin: false
    });
  }
  this.about.domain = domain;
  this.about.baseUrl = url;

};


/**
 * Get Sugarcrm basic info.
 * @return {!goog.async.Deferred} `null` if no info is available.
 */
ydn.crm.su.WidgetModel.prototype.getInfo = function() {
  if (!this.isLogin()) {
    throw new Error('NotLogin');
  }
  if (this.info) {
    return goog.async.Deferred.succeed(this.info);
  }
  return this.getChannel().send(ydn.crm.Ch.SReq.SERVER_INFO)
      .addCallback(function(x) {
        this.info = x;
      }, this);
};


/**
 * Login to sugarcrm.
 * @param {string} url
 * @param {string} username
 * @param {string} password
 * @return {!goog.async.Deferred.<SugarCrm.About>} cb
 */
ydn.crm.su.WidgetModel.prototype.login = function(url, username, password) {
  this.setInstanceUrl(url);
  window.console.assert(!!this.about, 'Not initialized');
  if (username) {
    this.about.userName = username;
  }
  if (password) {
    // keep hashed password only.
    // this.about.password = CryptoJS.MD5(password).toString();
    var md5 = new goog.crypt.Md5();
    md5.update(password);
    this.about.password = goog.crypt.byteArrayToHex(md5.digest());
    this.about.hashed = true;
  }

  // whether user give permission or not, we still continue login.
  // console.log(permission, me.data);
  if (this.is_new_) {
    return ydn.msg.getChannel().send(ydn.crm.Ch.Req.NEW_SUGAR, this.about)
        .addCallback(function(info) {
          // console.log(info);
          this.about = info;
        }, this);
  } else {
    return this.getChannel().send(ydn.crm.Ch.SReq.LOGIN, this.about)
        .addCallback(function(info) {
          // console.log(info);
          this.about = info;
        }, this);
  }

};


/**
 * Chrome host permission request object.
 * @return {{origins: (Array.<string>|undefined), permissions: (Array.<string>|undefined)}}
 */
ydn.crm.su.WidgetModel.prototype.getPermissionObject = function() {
  return {'origins': ['http://' + this.about.domain + '/*',
    'https://' + this.about.domain + '/*']};
};


/**
 * List SugarCrm available.
 * @return {!goog.async.Deferred.<Array.<ydn.crm.su.WidgetModel>>} cb
 */
ydn.crm.su.WidgetModel.list = function() {
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.LIST_SUGAR).addCallback(function(abouts) {
    var models = [];
    for (var i = 0; i < abouts.length; i++) {
      var about = /** @type {SugarCrm.About} */ (abouts[i]);
      models[i] = new ydn.crm.su.WidgetModel(about);
    }
    return models;
  });
};


