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
 * @fileoverview SugarCRM app.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.inj.SugarCrmApp');
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
goog.require('ydn.crm.gmail.MessageHeaderInjector');
goog.require('ydn.crm.inj');
goog.require('ydn.crm.inj.GmailContextContainer');
goog.require('ydn.crm.inj.Hud');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.sugarcrm.model.Archiver');
goog.require('ydn.crm.tracking.Tracker');
goog.require('ydn.crm.ui.SidebarPanel');
goog.require('ydn.debug');
goog.require('ydn.gmail.Utils.GmailViewState');
goog.require('ydn.msg.Pipe');



/**
 * SugarCRM app.
 * @param {ydn.crm.gmail.MessageHeaderInjector} heading_injector
 * @param {ydn.crm.gmail.GmailObserver} gmail_observer
 * @param {ydn.crm.gmail.ComposeObserver} compose_observer
 * @param {ydn.crm.inj.ContextContainer} renderer
 * @param {ydn.crm.inj.Hud} hud
 * @constructor
 * @struct
 */
ydn.crm.inj.SugarCrmApp = function(heading_injector, gmail_observer, compose_observer,
                                   renderer, hud) {

  /**
   * @final
   * @type {ydn.crm.gmail.MessageHeaderInjector}
   * @private
   */
  this.heading_injector_ = heading_injector;
  /**
   * @protected
   * @type {ydn.crm.gmail.ContextSidebar}
   */
  this.context_panel = new ydn.crm.gmail.ContextSidebar(gmail_observer, compose_observer);

  this.context_panel.render(renderer.getContentElement());

  /**
   * @final
   * @type {ydn.crm.ui.SidebarPanel}
   */
  this.sidebar_panel = new ydn.crm.ui.SidebarPanel();

  /**
   * @final
   * @type {ydn.crm.inj.Hud}
   */
  this.hud = hud;

  this.handler = new goog.events.EventHandler(this);
  this.handler.listen(gmail_observer, ydn.crm.gmail.GmailObserver.EventType.CONTEXT_CHANGE,
      this.onGmailContextEvent_);

};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.SugarCrmApp.DEBUG = false;


/**
 * Sniff contact and set to model.
 * @param {ydn.crm.gmail.GmailObserver.ContextRightBarEvent} e
 * @private
 */
ydn.crm.inj.SugarCrmApp.prototype.onGmailContextEvent_ = function(e) {

  this.context_panel.updateForNewContact(e.context);

};


/**
 * @param {ydn.msg.Event} e
 * @protected
 */
ydn.crm.inj.SugarCrmApp.prototype.handleSugarDomainChanges = function(e) {

  if (e.type == ydn.crm.Ch.BReq.LIST_DOMAINS) {
    this.updateSugarPanels_();
  }
};


/**
 * Initialize UI.
 */
ydn.crm.inj.SugarCrmApp.prototype.init = function() {

  this.hud.addPanel(this.sidebar_panel);

  var us = ydn.crm.ui.UserSetting.getInstance();

  goog.events.listen(us,
      [ydn.crm.ui.UserSetting.EventType.LOGIN,
        ydn.crm.ui.UserSetting.EventType.LOGOUT],
      this.onUserStatusChange, false, this);

  goog.events.listen(ydn.msg.getMain(),
      [ydn.crm.Ch.BReq.LIST_DOMAINS],
      this.handleSugarDomainChanges, false, this);

  if (ydn.crm.inj.SugarCrmApp.DEBUG) {
    window.console.info('SugarCrmApp initialized.');
  }
};


/**
 * Reset user setting
 * @param {goog.events.Event} e
 * @protected
 */
ydn.crm.inj.SugarCrmApp.prototype.onUserStatusChange = function(e) {
  if (ydn.crm.inj.SugarCrmApp.DEBUG) {
    window.console.log('updating for ' + e.type);
  }
  var us = /** @type {ydn.crm.ui.UserSetting} */ (ydn.crm.ui.UserSetting.getInstance());
  if (us.hasValidLogin()) {
    this.context_panel.updateHeader();
    this.updateSugarPanels_();
  } else {
    // we are not showing any UI if user is not login.
    // user should use browser bandage to login and refresh the page.
    this.heading_injector_.setSugar(null);
    this.context_panel.updateHeader();
    this.sidebar_panel.updateHeader();
    this.updateSugarPanels_();
  }
};


/**
 * Update sugar panels.
 * @private
 */
ydn.crm.inj.SugarCrmApp.prototype.updateSugarPanels_ = function() {
  if (ydn.crm.inj.SugarCrmApp.DEBUG) {
    window.console.info('updating sugar panels');
  }
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.LIST_SUGAR_DOMAIN).addCallback(
      function(sugars) {
        if (ydn.crm.inj.SugarCrmApp.DEBUG) {
          window.console.log(sugars);
        }
        this.sidebar_panel.updateSugarPanels(sugars);
        this.context_panel.updateSugarPanels(sugars).addCallback(function() {
          var sugar = this.context_panel.getSugarModelClone();
          if (ydn.crm.inj.SugarCrmApp.DEBUG) {
            window.console.log(sugars, sugar);
          }
          var archiver = sugar ? new ydn.crm.sugarcrm.model.Archiver(sugar) : null;
          this.heading_injector_.setSugar(archiver);
        }, this);
      }, this);
};




