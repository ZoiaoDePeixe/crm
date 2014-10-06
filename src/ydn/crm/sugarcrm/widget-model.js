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

goog.provide('ydn.crm.sugarcrm.WidgetModel');



/**
 * SugarCRM model for widget.
 * @param {SugarCrm.About=} opt_about SugarCRM instance about info.
 * @constructor
 * @struct
 */
ydn.crm.sugarcrm.WidgetModel = function(opt_about) {
  /**
   * @type {SugarCrm.About}
   */
  this.data = opt_about || null;
  /**
   * @type {SugarCrm.ServerInfo}
   */
  this.info = null;

};


/**
 * Return detail.
 * @return {SugarCrm.About}
 */
ydn.crm.sugarcrm.WidgetModel.prototype.getDetails = function() {
  return this.data;
};


/**
 * Get domain name of the instance.
 * @return {?string}
 */
ydn.crm.sugarcrm.WidgetModel.prototype.getDomain = function() {
  return this.data ? this.data.domain : null;
};


/**
 * Check login status.
 * @return {boolean}
 */
ydn.crm.sugarcrm.WidgetModel.prototype.isLogin = function() {
  return this.data ? !!this.data.isLogin : false;
};


/**
 * Query host permission.
 * @param {function(this: T, boolean)=} opt_cb
 * @param {T=} opt_scope
 * @template T
 * @return {boolean}
 */
ydn.crm.sugarcrm.WidgetModel.prototype.hasHostPermission = function(opt_cb, opt_scope) {
  var permissions = {
    origins: ['http://' + this.data.domain + '/*', 'https://' + this.data.domain + '/*']
  };
  chrome.permissions.contains(permissions, function(grant) {
    // console.log(scope, grant);
    if (opt_cb) {
      opt_cb.call(opt_scope, grant);
    }
  });
  return !!this.data && !!this.data.hostPermission;
};


/**
 * Request host permission.
 * @param {function(this: T, boolean)} cb
 * @param {T} scope
 * @template T
 */
ydn.crm.sugarcrm.WidgetModel.prototype.requestHostPermission = function(cb, scope) {
  var domain = this.getDomain();
  console.assert(!!domain);
  var permissions = {
    origins: ['http://' + domain + '/*', 'https://' + domain + '/*']
  };
  chrome.permissions.request(permissions, function(grant) {
    // console.log(permission, grant);
    cb.call(scope, grant);
  });
};


/**
 * Set domain.
 * @param {string} url sugarcrm instance url
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.WidgetModel.prototype.setInstanceUrl = function(url) {
  url = url.trim();
  var domain = url.replace(/^https?:\/\//, '');
  domain = domain.replace(/\/.*/, ''); // remove after /
  if (url.length < 3 || !/\./.test(url)) {
    return goog.async.Deferred.fail(new Error('Invalid instance ' + url));
  }
  if (this.data && this.data.domain == domain) {
    return goog.async.Deferred.succeed(this.info);
  }
  if (!this.data) {
    this.data = /** @type {SugarCrm.About} */ ({
      domain: domain,
      isLogin: false
    });
  }
  return ydn.msg.getChannel().send('sugar-server-info', url).addCallback(function(info) {
    var base_url = /^http/.test(url) ? url : null;
    if (info['baseUrl']) {
      base_url = info['baseUrl'];
    }
    this.data = /** @type {SugarCrm.About} */ ({
      baseUrl: base_url,
      domain: domain,
      isLogin: false
    });
    // console.log(info);
    this.info = info;
    return info;
  }, this);
};


/**
 * Get Sugarcrm basic info.
 * @return {!goog.async.Deferred} `null` if no info is available.
 */
ydn.crm.sugarcrm.WidgetModel.prototype.getInfo = function() {
  if (!this.data || !this.data.domain) {
    return goog.async.Deferred.succeed(null);
  }
  if (this.info) {
    return goog.async.Deferred.succeed(this.info);
  }
  return ydn.msg.getChannel().send('sugar-server-info', this.data.domain).addCallback(function(x) {
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
ydn.crm.sugarcrm.WidgetModel.prototype.login = function(url, username, password) {
  this.setInstanceUrl(url);
  window.console.assert(!!this.data, 'Not initialized');
  if (username) {
    this.data.userName = username;
  }
  if (password) {
    // keep hashed password only.
    this.data.password = CryptoJS.MD5(password).toString();
    this.data.hashed = true;
  }

  // whether user give permission or not, we still continue login.
  // console.log(permission, me.data);
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.NEW_SUGAR, this.data).addCallback(function(info) {
    // console.log(info);
    this.data = info;
  }, this);

};


/**
 * Chrome host permission request object.
 * @return {Object}
 */
ydn.crm.sugarcrm.WidgetModel.prototype.getPermissionObject = function() {
  return {'origins': ['http://' + this.data.domain + '/*',
    'https://' + this.data.domain + '/*']};
};


/**
 * List SugarCrm available.
 * @return {!goog.async.Deferred.<Array.<ydn.crm.sugarcrm.WidgetModel>>} cb
 */
ydn.crm.sugarcrm.WidgetModel.list = function() {
  return ydn.msg.getChannel().send('list-sugarcrm').addCallback(function(abouts) {
    var models = [];
    for (var i = 0; i < abouts.length; i++) {
      var about = /** @type {SugarCrm.About} */ (abouts[i]);
      models[i] = new ydn.crm.sugarcrm.WidgetModel(about);
    }
    return models;
  });
};


