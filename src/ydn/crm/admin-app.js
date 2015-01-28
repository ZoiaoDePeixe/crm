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



goog.provide('ydn.crm.AdminPageApp');
goog.require('goog.array');
goog.require('goog.style');
goog.require('ydn.crm.AboutPage');
goog.require('ydn.crm.Ch');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.msg.StatusBar');
goog.require('ydn.crm.su.HomePage');
goog.require('ydn.crm.su.model.Sugar');
goog.require('ydn.crm.ui.AdminPage');
goog.require('ydn.crm.ui.LogPage');
goog.require('ydn.crm.ui.SugarListPanel');
goog.require('ydn.crm.ui.UserSetting');
goog.require('ydn.msg.Pipe');



/**
 * Option page app for CRMinInbox suite.
 * @constructor
 * @struct
 */
ydn.crm.AdminPageApp = function() {

  ydn.msg.initPipe(ydn.msg.ChannelName.OPTIONS);
  ydn.ui.setTemplateDocument(chrome.extension.getURL(ydn.crm.base.INJ_TEMPLATE));

  /**
   * @protected
   * @type {Object}
   */
  this.user_info = null;

  /**
   * @type {Object.<ydn.crm.IPage>}
   * @private
   */
  this.pages_ = {};

  var status_el = document.getElementById(ydn.crm.ui.SugarListPanel.CSS_CLASS_STATUS);
  var status = new ydn.crm.msg.StatusBar(true);
  status.render(status_el);
  ydn.crm.msg.Manager.addConsumer(status);

  /**
   * Process user page setup.
   * @type {boolean}
   * @private
   */
  this.process_user_page_setup_ = false;

};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.AdminPageApp.DEBUG = false;


/**
 * Add page.
 * @param {string} name
 * @param {string} label
 * @param {ydn.crm.IPage} page
 * @return {Element} menu element.
 * @protected
 */
ydn.crm.AdminPageApp.prototype.addPage = function(name, label, page) {
  this.pages_[name] = page;
  var main_menu = document.getElementById('main-menu');
  var content = document.getElementById('app-content');
  var li = document.createElement('li');
  if (main_menu.childElementCount == 0) {
    li.setAttribute('selected', '');
  }
  var a = document.createElement('a');
  a.href = '#' + name;
  a.textContent = label;
  li.appendChild(a);
  li.setAttribute('name', name);
  main_menu.appendChild(li);

  var div = document.createElement('div');
  div.setAttribute('name', name);
  div.style.display = 'none';
  content.appendChild(div);
  page.render(div);
  return li;
};


/**
 * Update user info.
 * @param {YdnApiUser} user_info
 * @private
 */
ydn.crm.AdminPageApp.prototype.updateUserInfo_ = function(user_info) {
  if (user_info) {
    var btn_login = document.getElementById('user-login');
    var ele_name = document.getElementById('user-name');
    var main_menu = document.getElementById('main-menu');
    var content = document.getElementById('app-content');
    if (user_info.is_login) {
      btn_login.href = user_info.logout_url;
      btn_login.textContent = 'logout';
      ele_name.textContent = user_info.email;
      main_menu.style.display = '';
      content.style.display = '';
    } else {
      var url = user_info.login_url;
      if (ydn.crm.AdminPageApp.DEBUG && url.charAt(0) == '/') {
        // Local dev server need convert relative to full url.
        url = 'http://127.0.0.1:8080' + url;
      }
      btn_login.href = url;
      btn_login.textContent = 'login';
      btn_login.style.display = '';
      ele_name.textContent = '';
      main_menu.style.display = 'none';
      content.style.display = 'none';
    }
  }
};


/**
 * Process after login.
 * @protected
 */
ydn.crm.AdminPageApp.prototype.processUserPageSetup = function() {

  var us = ydn.crm.ui.UserSetting.getInstance();


  var asn = ydn.crm.base.getAppShortName();
  var pages = ['log', 'admin', 'about'];

  for (var i = 0; i < pages.length; i++) {
    var name = pages[i];
    if (name == 'about') {
      var about = new ydn.crm.AboutPage('Yathit CRMinInbox');
      this.addPage(name, about.toString(), about);
    } else if (name == 'admin') {
      var admin = new ydn.crm.ui.AdminPage(us);
      this.addPage(name, admin.toString(), admin);
    } else if (name == 'log') {
      var log = new ydn.crm.ui.LogPage(us);
      this.addPage(name, log.toString(), log);
    } else {
      window.console.error('Invalid page name: ' + name);
    }
  }

};


/**
 * Do silence login.
 * @protected
 * @param {Object?} context login context
 * @return {!goog.async.Deferred}
 */
ydn.crm.AdminPageApp.prototype.login = function(context) {

  return ydn.msg.getChannel().send('echo').addCallbacks(function(ok) {
    this.setStatus('logging in...');
    var user = ydn.crm.ui.UserSetting.getInstance();
    return user.onReady().addCallbacks(function() {
      var user_info = user.getUserInfo();
      goog.Timer.callOnce(function() {
        if (ydn.crm.AdminPageApp.DEBUG) {
          window.console.log('user ready', user_info);
        }
        this.updateUserInfo_(user_info);

        var content = document.getElementById('app-content');
        if (user_info.is_login) {
          content.style.display = '';
        } else {
          content.style.display = 'none';
          this.setStatus('Not login');
        }
      }, 10, this);
      return user_info;
    }, function(e) {
      var msg = e.message ? e.message : e;
      this.setStatus('Error: ' + msg);
    }, this);
  }, function(e) {
    // btn_login.href = '?' + Math.random(); // refresh the page
    // btn_login.textContent = 'refresh';
    var msg = e instanceof Error ? e.name + ' ' + e.message : e;
    this.setStatus('Failed to connect to background page: ' + msg);
  }, this);
};


/**
 * Refresh the panel according to hash.
 */
ydn.crm.AdminPageApp.prototype.refreshPanelByHash = function() {
  var hash = location.hash.replace('#', '') || 'home';
  var idx = hash.indexOf('?');
  if (idx > 0) {
    this.showPanel_(hash.substr(0, idx), hash.substr(idx + 1));
  } else {
    this.showPanel_(hash);
  }
};


/**
 * Show a particular section.
 * @param {string} name
 * @param {string=} opt_query
 * @private
 */
ydn.crm.AdminPageApp.prototype.showPanel_ = function(name, opt_query) {
  var menu = document.getElementById('main-menu');
  var content = document.getElementById('app-content');
  var has_selected = false;
  var selected_index = -1;
  name = name.toLowerCase();
  if (name == 'home') {
    selected_index = 0;
    name = content.children[0].getAttribute('name');
  } else {
    for (var i = content.childElementCount - 1; i >= 0; i--) {
      var page_name = content.children[i].getAttribute('name').toLowerCase();
      if (page_name == name) {
        selected_index = i;
        break;
      }
    }
  }
  if (selected_index == -1) {
    ydn.crm.msg.Manager.addStatus('Invalid tab name: ' + name);
    return;
  }
  for (var i = content.childElementCount - 1; i >= 0; i--) {
    var page = content.children[i];
    var selected = selected_index == i;
    if (selected) {
      page.style.display = '';
      menu.children[i].classList.add('selected');
      this.pages_[name].onPageShow(opt_query);
    } else {
      page.style.display = 'none';
      menu.children[i].classList.remove('selected');
    }

  }
};


/**
 * @param {string} msg
 */
ydn.crm.AdminPageApp.prototype.setStatus = function(msg) {
  ydn.crm.msg.Manager.addStatus(msg);
};


/**
 * Run the app.
 */
ydn.crm.AdminPageApp.prototype.run = function() {
  var me = this;
  var menu = document.getElementById('main-menu');
  window.addEventListener('popstate', function(e) {
    if (ydn.crm.AdminPageApp.DEBUG) {
      window.console.log('popstate ' + location.hash);
    }
    me.refreshPanelByHash();
  }, false);

  chrome.runtime.onMessageExternal.addListener(
      function(request, sender, sendResponse) {
        // the redirect page, pm.html will send this message.
        if (request == 'closing') {
          sendResponse('close');
          var link = document.getElementById('user-login');
          if (link.textContent == 'logout') {
            ydn.msg.getChannel().send(ydn.crm.Ch.Req.LOGGED_OUT).addCallback(function() {
              location.reload();
            });
          } else {
            location.reload();
          }
        }
      });

  var link = document.getElementById('user-login');
  link.addEventListener('click', function(e) {
    e.preventDefault();

    ydn.ui.openPageAsDialog(e);
  }, true);

  this.login(null).addCallback(function() {
    if (this.process_user_page_setup_) {
      goog.Timer.callOnce(function() {
        this.processUserPageSetup();
        this.refreshPanelByHash();
      }, 10, this);
    } else {
      goog.Timer.callOnce(function() {
        this.refreshPanelByHash();
      }, 10, this);
    }
  }, this);
};


/**
 * Run option page app.
 * @return {ydn.crm.AdminPageApp}
 */
ydn.crm.AdminPageApp.runAdminApp = function() {

  var app = new ydn.crm.AdminPageApp();
  app.process_user_page_setup_ = true;
  app.run();
  return app;
};


goog.exportSymbol('runAdminApp', ydn.crm.AdminPageApp.runAdminApp);
