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
goog.require('goog.events');
goog.require('goog.history.Html5History');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');
goog.require('templ.ydn.crm.inj');
goog.require('ydn.crm.base');
goog.require('ydn.crm.gmail.ContextSidebar');
goog.require('ydn.crm.gmail.GmailObserver');
goog.require('ydn.crm.gmail.Tracker');
goog.require('ydn.crm.inj');
goog.require('ydn.crm.inj.Hud');
goog.require('ydn.crm.inj.InlineRenderer');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.shared');
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
   * @type {ydn.crm.gmail.ComposeObserver}
   * @private
   */
  this.compose_observer_ = new ydn.crm.gmail.ComposeObserver();

  /**
   * @final
   * @type {ydn.crm.gmail.GmailObserver}
   */
  this.gmail_observer = new ydn.crm.gmail.GmailObserver();

  /**
   * @type {ydn.crm.gmail.Tracker}
   * @private
   */
  this.tracker_ = new ydn.crm.gmail.Tracker();
  this.tracker_.setObserver(this.compose_observer_);



  /**
   * @protected
   * @type {ydn.crm.gmail.ContextSidebar}
   */
  this.sidebar = new ydn.crm.gmail.ContextSidebar(this.compose_observer_);
  var renderer = new ydn.crm.inj.InlineRenderer(this.gmail_observer);
  this.sidebar.render(renderer.getContentElement());


  /**
   * @type {ydn.crm.ui.UserSetting}
   * @final
   */
  this.user_setting = ydn.crm.ui.UserSetting.getInstance();

  /**
   * @final
   * @type {ydn.crm.inj.Hud}
   */
  this.hud = new ydn.crm.inj.Hud();

  this.handler = new goog.events.EventHandler(this);
  this.handler.listen(this.gmail_observer, ydn.crm.gmail.GmailObserver.EventType.CONTEXT_CHANGE,
      this.onGmailContextEvent_);
  this.handler.listen(this.compose_observer_, ydn.crm.gmail.GmailObserver.EventType.PAGE_CHANGE,
      this.onGmailPageChanged);
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
 * Sniff contact and set to model.
 * @param {ydn.crm.gmail.GmailObserver.ContextRightBarEvent} e
 * @private
 */
ydn.crm.inj.App.prototype.onGmailContextEvent_ = function(e) {

  if (e.context) {
    this.sidebar.updateForNewContact(e.context);
  }

};


/**
 * @const
 * @type {number}
 */
ydn.crm.inj.App.MAX_SNIFF_COUNT = 40;


/**
 * @const
 * @type {boolean}
 */
ydn.crm.inj.App.SHOW_TABPANE = true;


/**
 * @param {ydn.crm.gmail.GmailObserver.PageChangeEvent} e
 */
ydn.crm.inj.App.prototype.onGmailPageChanged = function(e) {
  if (e.page_type == ydn.gmail.Utils.GmailViewState.COMPOSE) {
    var val = this.sidebar.injectTemplateMenu();
    goog.log.finer(this.logger, 'inject compose ' + (val ? 'ok' : 'fail'));
  } else if (e.page_type == ydn.gmail.Utils.GmailViewState.EMAIL) {
    goog.log.finest(this.logger, 'updating sidebar');
    this.sidebar.updateForNewContact(null); // let know, new context is coming.
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
    this.updateSugarPanels_();
  } else if (e.type == ydn.crm.Ch.BReq.LOGGED_IN) {
    if (!us.hasValidLogin()) {
      us.invalidate();
      this.resetUser_();
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
  this.user_setting.onReady().addCallbacks(function() {
    goog.log.finest(this.logger, 'initiating UI');
    if (this.user_setting.hasValidLogin()) {
      this.sidebar.updateHeader();
      this.hud.updateHeader();
      this.updateSugarPanels_();
      this.gmail_observer.setEnabled(true);
    } else {
      // we are not showing any UI if user is not login.
      // user should use browser bandage to login and refresh the page.
      this.sidebar.updateHeader();
      this.hud.updateHeader();
      this.sidebar.updateSugarPanels([]);
      this.hud.updateSugarPanels([]);
      goog.log.warning(this.logger, 'user not login');
      this.gmail_observer.setEnabled(false);
    }
  }, function(e) {
    window.console.error(e);
  }, this);
};


/**
 * Update sugar panels.
 * @private
 */
ydn.crm.inj.App.prototype.updateSugarPanels_ = function() {
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.LIST_SUGAR_DOMAIN).addCallback(
      function(sugars) {
        if (ydn.crm.ui.SugarListPanel.DEBUG) {
          window.console.log(sugars);
        }
        this.sidebar.updateSugarPanels(sugars);
        this.hud.updateSugarPanels(sugars);
      }, this);
};


/**
 * Init UI.
 */
ydn.crm.inj.App.prototype.init = function() {
  goog.log.finer(this.logger, 'init ' + this);

  this.hud.render();

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

