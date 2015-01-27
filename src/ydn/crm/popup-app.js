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
 * @fileoverview Option page app for CRMinInbox suite.
 *
 * All extensions in CRMinInbox suite use this generic app page, and hence
 * same functionality. However each extension use different default
 * configuration for the target application.
 */



goog.provide('ydn.crm.PopupPageApp');
goog.require('goog.events.EventHandler');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.msg.StatusBar');
goog.require('ydn.msg.Pipe');



/**
 * Option page app for CRMinInbox suite.
 * @constructor
 * @struct
 */
ydn.crm.PopupPageApp = function() {

  ydn.msg.initPipe(ydn.msg.ChannelName.POPUP);
  ydn.ui.setTemplateDocument(chrome.extension.getURL(ydn.crm.base.INJ_TEMPLATE));

  /**
   * @protected
   * @type {Object}
   */
  this.user_info = null;

  var status_el = document.getElementById('sidebar-status');
  var status = new ydn.crm.msg.StatusBar(false);
  status.render(status_el);
  ydn.crm.msg.Manager.addConsumer(status);

  this.handler = new goog.events.EventHandler(this);
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.PopupPageApp.DEBUG = false;


/**
 * Convert JSON to Element.
 * @param {ydn.crm.PopupPageApp.FeedItem} json
 * @return {Element}
 */
ydn.crm.PopupPageApp.json2element = function(json) {
  if (!json || ['DIV', 'SPAN', 'A', 'BUTTON'].indexOf(json.tagName) == -1) {
    console.warn(json);
    return null;
  }
  var ele = document.createElement(json.tagName);
  var attrs = ['className', 'href', 'name', 'textContent', 'target'];
  for (var i = 0; i < attrs.length; i++) {
    if (json[attrs[i]]) {
      ele[attrs[i]] = json[attrs[i]];
    }
  }
  var n = json.children ? json.children.length : 0;
  for (var i = 0; i < n; i++) {
    var child = ydn.crm.PopupPageApp.json2element(json.children[i]);
    if (child) {
      ele.appendChild(child);
    }
  }
  return ele;
};


/**
 * @typedef {{
 *   tagName: string,
 *   name: (string|undefined),
 *   textContent: string,
 *   target: (string|undefined),
 *   href: (string|undefined)
 * }}
 */
ydn.crm.PopupPageApp.FeedItem;


/**
 * Render feed info.
 * @param {Array.<ydn.crm.PopupPageApp.FeedItem>} feeds
 * @param {boolean=} opt_append
 */
ydn.crm.PopupPageApp.prototype.renderFeed = function(feeds, opt_append) {
  if (!feeds) {
    return;
  }
  var fg = document.querySelector('ul.feeds');
  if (!opt_append) {
    fg.innerHTML = '';
  }
  for (var i = 0; i < feeds.length; i++) {
    var ele = ydn.crm.PopupPageApp.json2element(feeds[i]);
    if (ele) {
      var li = document.createElement('li');
      li.appendChild(ele);
      fg.appendChild(li);
    }
  }

};


/**
 * Process after login.
 * @protected
 */
ydn.crm.PopupPageApp.prototype.processUserPageSetup = function() {


};


/**
 * Initialize for GData access token.
 * @private
 */
ydn.crm.PopupPageApp.prototype.initGDataToken_ = function() {
  var option_page = window.location.href.replace(/#.*/, '')
      .replace('popup.html', 'option-page.html');
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.TOKEN_GDATA, location.href).addCallback(function(data) {
    var token = /** @type {YdnApiToken} */ (data);
    if (!token || !token.has_token) {
      this.renderFeed([
        {
          tagName: 'A',
          textContent: 'Setup Google account',
          target: 'option-page',
          href: option_page + '#credentials'
        }
      ], true);
    }
  }, this);
};


/**
 * Initialize UI for SugarCRM.
 * @private
 */
ydn.crm.PopupPageApp.prototype.initSugarCrm_ = function() {

  this.initGDataToken_(); // SugarCRM require GData token.

  ydn.crm.su.model.Sugar.list().addCallback(function(models) {
    for (var i = 0; i < models.length; i++) {
      var model = /** @type {ydn.crm.su.model.Sugar} */ (models[i]);
      if (model.isLogin() && !model.hasHostPermission()) {
        var ul = document.querySelector('ul.host-permission');
        var li = document.createElement('li');
        var a = document.createElement('button');
        a.textContent = 'Grant host permission';
        a.setAttribute('title', model.getDomain());
        li.appendChild(a);
        a.setAttribute('data-domain', model.getDomain());
        ul.appendChild(li);
      }
    }
    if (models.length == 0) {
      this.renderFeed([
        {
          tagName: 'A',
          textContent: 'Setup SugarCRM',
          target: 'setup-page',
          href: chrome.extension.getURL(ydn.crm.base.SETUP_PAGE)
        }
      ], true);
    }
  }, this);

};


/**
 * Update request permission request link.
 * @param {string} domain origin domain name to check.
 * @param {string} label button label.
 * @param {Array.<string>} origins list of permitted origin.
 * @private
 */
ydn.crm.PopupPageApp.prototype.updateOriginRequestLink_ = function(domain, label, origins) {
  var ok = false;
  for (var i = 0; i < origins.length; i++) {
    var origin = origins[i];
    if (origin.indexOf('/' + domain + '/') >= 0) {
      ok = true;
      break;
    }
  }
  var ul = document.querySelector('ul.host-permission');
  var a = ul.querySelector('a[data-domain="' + domain + '"]');
  var li = a ? a.parentElement : null;
  if (ok) {
    if (li) {
      goog.style.setElementShown(li, false);
    }
  } else {
    if (li) {
      goog.style.setElementShown(li, true);
    } else {
      li = document.createElement('li');
      a = document.createElement('button');
      a.textContent = label;
      li.appendChild(a);
      a.setAttribute('data-domain', domain);
      ul.appendChild(li);
    }
  }
};


/**
 * Initialize for Email Tracking UI.
 * @private
 */
ydn.crm.PopupPageApp.prototype.initEmailTracking_ = function() {
  var me = this;
  chrome.permissions.getAll(function(permissions) {
    var origins = /** @type {Array.<string>} */ (permissions['origins']) || [];
    me.updateOriginRequestLink_('mail.google.com', 'Enable tracking in Gmail', origins);
    me.updateOriginRequestLink_('*.mail.live.com', 'Enable tracking in Outlook.com', origins);
  });
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.PopupPageApp.prototype.handleHostPermissionRequest_ = function(e) {
  var a = e.target;
  if (a.tagName == 'BUTTON') {
    e.preventDefault();
    var domain = a.getAttribute('data-domain');
    var permissions = {
      origins: ['http://' + domain + '/*', 'https://' + domain + '/*']
    };
    chrome.permissions.request(permissions, function(grant) {
      if (grant) {
        a.style.display = 'none';
      }
    });
  }
};


/**
 * Run the app.
 */
ydn.crm.PopupPageApp.prototype.run = function() {

  var ul = document.querySelector('ul.host-permission');
  this.handler.listen(ul, 'click', this.handleHostPermissionRequest_);

  var mid = ydn.crm.msg.Manager.addStatus('checking login...');
  // here we can use extension.getURL, but need more robust on dev.
  var option_page = window.location.href.replace(/#.*/, '')
      .replace('popup.html', 'option-page.html');
  var setup_page = window.location.href.replace(/#.*/, '')
      .replace('popup.html', 'setup.html');

  ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOGIN_INFO).addCallbacks(function(x) {
    var info = /** @type {YdnApiUser} */ (x);
    if (info.is_login) {
      ydn.crm.msg.Manager.setStatus(mid, info.email + ' logged in.');
      var asn = ydn.crm.AppSetting.getAppShortName();
      var is_tracker_app = asn == ydn.crm.base.AppShortName.EMAIL_TRACKER ||
          asn == ydn.crm.base.AppShortName.EMAIL_TRACKER_GMAIL;
      if (is_tracker_app) {
        this.initEmailTracking_();
      } else {
        this.initSugarCrm_();
      }
    } else {
      ydn.crm.msg.Manager.addStatus('Not logged in.');
      var arr = [
        {
          tagName: 'A',
          textContent: 'Setup',
          target: 'option-page',
          href: option_page
        }
      ];
      this.renderFeed(arr, true);
    }
  }, function(e) {
    ydn.crm.msg.Manager.addStatus(e.message || e + '');
  }, this);

};


/**
 * Run option page app.
 * @return {ydn.crm.PopupPageApp}
 */
ydn.crm.PopupPageApp.runPopupApp = function() {
  var app = new ydn.crm.PopupPageApp();
  app.run();
  return app;
};


goog.exportSymbol('runPopupApp', ydn.crm.PopupPageApp.runPopupApp);
