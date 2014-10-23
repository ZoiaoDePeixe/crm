// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview Main application for injecting content script to gmail.
 *
 * As soon as the app run, this connect with background script, create stable
 * connection channel and check login status and load of the user
 * setting. Finally this will load Gmail content panel and listen gmail histry
 * changes. These changes are regularily updated back to Gmail content panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.inj.App');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.base');
goog.require('ydn.crm.gmail.ContextSidebar');
goog.require('ydn.crm.gmail.GmailObserver');
goog.require('ydn.crm.gmail.MessageHeaderWidget');
goog.require('ydn.crm.inj');
goog.require('ydn.crm.inj.SugarCrmApp');
goog.require('ydn.crm.inj.TrackingApp');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.tracking.TrackResult');
goog.require('ydn.crm.tracking.Tracker');
goog.require('ydn.debug');
goog.require('ydn.gmail.Utils.GmailViewState');
goog.require('ydn.msg.Pipe');



/**
 * Main Gmail content script app.
 * @constructor
 * @struct
 */
ydn.crm.inj.App = function() {

  ydn.ui.setTemplateDocument(chrome.extension.getURL(ydn.crm.base.INJ_TEMPLATE));

  // connection channel with background page.
  ydn.msg.initPipe(ydn.msg.ChannelName.GMAIL);

  ydn.crm.msg.Manager.addStatus('Starting ' + ydn.crm.version + '...');

  /**
   * @final
   * @type {ydn.crm.gmail.GmailObserver}
   */
  this.gmail_observer = new ydn.crm.gmail.GmailObserver();

  /**
   * @final
   * @type {ydn.crm.gmail.ComposeObserver}
   */
  this.compose_observer = new ydn.crm.gmail.ComposeObserver(this.gmail_observer);

  /**
   * @type {ydn.crm.gmail.MessageHeaderInjector}
   * @private
   */
  this.header_injector_ = new ydn.crm.gmail.MessageHeaderInjector(this.gmail_observer);

  /**
   * @protected
   * @type {ydn.crm.inj.SugarCrmApp}
   */
  this.sugar_app = null;

  /**
   * @protected
   * @type {ydn.crm.inj.TrackingApp}
   */
  this.tracking_app = null;

  goog.events.listen(this.gmail_observer, ydn.crm.gmail.GmailObserver.EventType.MESSAGE_HEADER,
      this.onMessageHeaderAppear_, false, this);
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.App.DEBUG = false;


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.crm.inj.App.prototype.logger = goog.log.getLogger('ydn.crm.inj.App');


/**
 * @param {ydn.crm.gmail.GmailObserver.MessageHeaderAppearEvent} e
 * @private
 */
ydn.crm.inj.App.prototype.onMessageHeaderAppear_ = function(e) {
  if (ydn.crm.inj.App.DEBUG) {
    window.console.log('Message header appear', e.reply_btn);
  }
};


/**
 * @param {ydn.msg.Event} e
 */
ydn.crm.inj.App.prototype.handleChannelMessage = function(e) {
  if (ydn.crm.inj.App.DEBUG) {
    window.console.log(e.type);
  }
  var us = /** @type {ydn.crm.ui.UserSetting} */ (ydn.crm.ui.UserSetting.getInstance());
  if (e.type == ydn.crm.Ch.BReq.LIST_DOMAINS) {
    if (this.sugar_app) {
      this.sugar_app.updateSugarPanels();
    }
  } else if (e.type == ydn.crm.Ch.BReq.LOGGED_IN) {
    if (!us.hasValidLogin()) {
      us.invalidate();
      if (this.sugar_app) {
        this.sugar_app.onUserStatusChange(us);
      }
    }
  } else if (e.type == ydn.crm.Ch.BReq.LOGGED_OUT) {
    if (us.getLoginEmail()) {
      us.invalidate();
      this.resetUser_();
    }
  }
};


/**
 * Reset user setting
 * @private
 */
ydn.crm.inj.App.prototype.resetUser_ = function() {
  var us = /** @type {ydn.crm.ui.UserSetting} */ (ydn.crm.ui.UserSetting.getInstance());
  us.onReady().addCallbacks(function() {
    goog.log.finest(this.logger, 'initiating UI');

    if (us.hasValidLogin()) {
      this.gmail_observer.setEnabled(true);
    } else {
      // we are not showing any UI if user is not login.
      // user should use browser bandage to login and refresh the page.
      goog.log.warning(this.logger, 'user not login');
      this.gmail_observer.setEnabled(false);
    }
    if (this.sugar_app) {
      this.sugar_app.onUserStatusChange(us);
    }
    if (this.tracking_app) {
      this.tracking_app.onUserStatusChange(us);
    }
  }, function(e) {
    window.console.error(e);
  }, this);
};


/**
 * Init UI.
 */
ydn.crm.inj.App.prototype.init = function() {
  goog.log.finer(this.logger, 'init ' + this);

  if (ydn.crm.ui.UserSetting.hasFeature(ydn.crm.base.Feature.SUGARCRM)) {
    this.sugar_app = new ydn.crm.inj.SugarCrmApp(this.header_injector_,
        this.gmail_observer, this.compose_observer);
    this.sugar_app.init();
  }
  if (ydn.crm.ui.UserSetting.hasFeature(ydn.crm.base.Feature.TRACKING)) {
    this.tracking_app = new ydn.crm.inj.TrackingApp(this.header_injector_,
        this.gmail_observer, this.compose_observer);
    this.tracking_app.init();
  }

  goog.events.listen(ydn.msg.getMain(),
      [ydn.crm.Ch.BReq.LIST_DOMAINS,
        ydn.crm.Ch.BReq.LOGGED_OUT, ydn.crm.Ch.BReq.LOGGED_IN],
      this.handleChannelMessage, false, this);

  var delay = (0.5 + Math.random()) * 60 * 1000;
  setTimeout(function() {
    ydn.debug.ILogger.instance.beginUploading();
  }, delay);

  this.resetUser_();

};


/**
 * @inheritDoc
 */
ydn.crm.inj.App.prototype.toString = function() {
  return 'inj.Main:' + ydn.crm.version;
};


/**
 * Main entry script to run the app.
 * @return {ydn.crm.inj.App}
 */
ydn.crm.inj.App.runInjApp = function() {
  ydn.crm.shared.init();

  var app = new ydn.crm.inj.App();

  var tid2 = window.setTimeout(function() {
    // after 15 sec, we will load anyways
    app.init();
  }, 500);

  return app;
};

goog.exportSymbol('runInjApp', ydn.crm.inj.App.runInjApp);

