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



goog.provide('ydn.crm.OptionPageApp');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.msg.StatusBar');
goog.require('ydn.msg.Pipe');



/**
 * Option page app for CRMinInbox suite.
 * @constructor
 * @struct
 */
ydn.crm.OptionPageApp = function() {
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

  var status = new ydn.crm.msg.StatusBar();
  status.render(document.getElementById('status'));
  ydn.crm.msg.Manager.addConsumer(status);

  chrome.runtime.onMessageExternal.addListener(
      function(request, sender, sendResponse) {
        if (request == 'closing') {
          sendResponse('close');
          location.reload();
        }
      });
};


/**
 * Add page.
 * @param {string} name
 * @param {string} label
 * @param {ydn.crm.IPage} page
 */
ydn.crm.OptionPageApp.prototype.addPage = function(name, label, page) {
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
  main_menu.appendChild(li);

  var div = document.createElement('div');
  content.appendChild(div);
  page.render(div);
};


/**
 * Update user info.
 * @param {YdnApiUser} user_info
 * @private
 */
ydn.crm.OptionPageApp.prototype.updateUserInfo_ = function(user_info) {
  if (user_info) {
    var btn_login = document.getElementById('user-login');
    var ele_name = document.getElementById('user-name');
    var main_menu = document.getElementById('main-menu');
    var content = document.getElementById('content');
    if (user_info.is_login) {
      btn_login.href = user_info.logout_url;
      btn_login.textContent = 'logout';
      ele_name.textContent = user_info.email;
      main_menu.style.display = '';
      content.style.display = '';
    } else {
      var url = user_info.login_url;
      if (OptionPage.DEBUG && url.charAt(0) == '/') {
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
 * Do silence login.
 * @protected
 * @param {Object?} context login context
 * @return {!goog.async.Deferred}
 */
ydn.crm.OptionPageApp.prototype.login = function(context) {

  var btn_login = document.getElementById('user-login');
  return ydn.msg.getChannel().send('echo').addCallbacks(function(ok) {
    this.setStatus('logging in...');
    var user = ydn.crm.ui.UserSetting.getInstance();
    return user.onReady().addCallbacks(function() {
      var user_info = user.getUserInfo();
      this.updateUserInfo_(user_info);
      for (var p in this.pages_) {
        this.pages_[i].setUserInfo(user_info);
      }
      if (user.isLogin()) {

        if (opt_cb) {
          opt_cb.call(opt_scope, user_info);
        }
      } else {
        this.setStatus('Not login');
      }
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
 * Show a particular section.
 * @param {string} name
 * @private
 */
ydn.crm.OptionPageApp.prototype.showPanel_ = function(name) {
  name = name.trim().toLowerCase();
  var menu = document.getElementById('main-menu');
  var content = document.getElementById('app-content');
  var has_selected = false;
  for (var i = content.childElementCount - 1; i >= 0; i--) {
    var selected = content.children[i].id == name;
    has_selected |= selected;
    this.pages_[name].showPage(selected);
    menu.children[i].className = selected ? 'selected' : '';
    content.children[i].style.display = selected ? '' : 'none';
  }
  if (!has_selected) {
    // show home
    menu.children[0].className = 'selected';
    content.children[0].style.display = '';
  }
};


/**
 * @param {string} msg
 */
ydn.crm.OptionPageApp.prototype.setStatus = function(msg) {
  ydn.crm.msg.Manager.addStatus(msg);
};


/**
 * Run the app.
 */
ydn.crm.OptionPageApp.prototype.run = function() {
  var me = this;
  var menu = document.getElementById('main-menu');
  window.addEventListener('popstate', function(e) {
    me.showPanel_(location.hash.replace('#', ''));
  }, false);

  var link = document.getElementById('user-login');
  link.addEventListener('click', function(e) {
    e.preventDefault();
    if (link.textContent == 'logout') {
      ydn.msg.getChannel().send('logged-out');
    }

    ydn.ui.openPageAsDialog(e);
  }, true);

  chrome.runtime.onMessageExternal.addListener(
      function(request, sender, sendResponse) {
        if (request == 'closing') {
          sendResponse('close');
          location.reload();
        }
      });

  this.login(null).addCallback(function() {
    if (location.hash) {
      goog.Timer.callOnce(function() {
        this.showPanel_(location.hash.replace('#', ''));
      }, 10, this);
    }
  }, this);
};


