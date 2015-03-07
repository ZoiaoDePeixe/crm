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
goog.require('goog.style');
goog.require('ydn.crm.base');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.su.Archiver');
goog.require('ydn.crm.su.AttachButtonProvider');
goog.require('ydn.crm.su.ContextWidget');
goog.require('ydn.crm.ui.SidebarPanel');
goog.require('ydn.gmail.Utils.GmailViewState');
goog.require('ydn.msg.Pipe');



/**
 * SugarCRM app.
 *  @param {ydn.crm.ui.UserSetting} us
 * @param {ydn.crm.gmail.MessageHeaderInjector} heading_injector
 * @param {ydn.crm.gmail.GmailObserver} gmail_observer
 * @param {ydn.crm.gmail.ComposeObserver} compose_observer
 * @param {ydn.crm.inj.ContextContainer} renderer
 * @param {ydn.crm.inj.Hud} hud
 * @constructor
 * @struct
 */
ydn.crm.inj.SugarCrmApp = function(us, heading_injector, gmail_observer,
                                   compose_observer, renderer, hud) {

  /**
   * @private
   * @type {ydn.crm.ui.UserSetting}
   */
  this.us_ = us;
  /**
   * @type {ydn.crm.gmail.GmailObserver}
   * @private
   */
  this.gmail_observer_ = gmail_observer;
  /**
   * @type {?ydn.crm.su.AttachButtonProvider}
   * @private
   */
  this.attacher_ = null;
  /**
   * @final
   * @type {ydn.crm.gmail.MessageHeaderInjector}
   * @private
   */
  this.heading_injector_ = heading_injector;

  /**
   * @protected
   * @type {ydn.crm.su.ContextWidget}
   */
  this.context_panel = new ydn.crm.su.ContextWidget(us, gmail_observer, compose_observer);

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

};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.SugarCrmApp.DEBUG = false;


/**
 * Sniff contact and set to model.
 * @param {ydn.crm.su.events.RecordViewEvent} e
 * @private
 */
ydn.crm.inj.SugarCrmApp.prototype.onViewRecord_ = function(e) {
  if (ydn.crm.inj.SugarCrmApp.DEBUG) {
    window.console.log('view record ' + e.module + ':' + e.id);
  }
  this.sidebar_panel.showRecord(e.module, e.id);

};


/**
 * @param {ydn.msg.Event} e
 * @protected
 */
ydn.crm.inj.SugarCrmApp.prototype.handleSugarDomainChanges = function(e) {
  this.updateSugarPanels_();
};


/**
 * Initialize UI.
 */
ydn.crm.inj.SugarCrmApp.prototype.init = function() {

  this.hud.addPanel(this.sidebar_panel);

  goog.events.listen(this.us_,
      [ydn.crm.ui.UserSetting.EventType.LOGIN,
        ydn.crm.ui.UserSetting.EventType.LOGOUT],
      this.onUserStatusChange, false, this);

  goog.events.listen(ydn.msg.getMain(),
      [ydn.crm.ch.BReq.SUGARCRM],
      this.handleSugarDomainChanges, false, this);

  if (ydn.crm.inj.SugarCrmApp.DEBUG) {
    window.console.info('SugarCrmApp initialized.');
  }

  if (this.us_.isReady()) {
    this.refresh_();
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
  this.refresh_();
};


/**
 * @private
 */
ydn.crm.inj.SugarCrmApp.prototype.refresh_ = function() {
  if (this.us_.hasValidLogin()) {
    this.sidebar_panel.setVisible(true);
    this.updateSugarPanels_();
  } else {
    // we are not showing any UI if user is not login.
    // user should use browser bandage to login and refresh the page.
    this.heading_injector_.setSugar(null);
    this.sidebar_panel.setVisible(false);
    this.updateSugarPanels_();
  }
};


/**
 * @param {SugarCrm.About} about
 * @private
 */
ydn.crm.inj.SugarCrmApp.prototype.updateSugarCrm_ = function(about) {


  this.sidebar_panel.setSugarCrm(about);

  var ch = ydn.msg.getChannel(ydn.msg.Group.SUGAR, about.domain);
  ch.send(ydn.crm.ch.SReq.DETAILS).addCallback(function(x) {
    var details = /** @type {SugarCrm.Details} */ (x);
    for (var i = 0; i < details.modulesInfo.length; i++) {
      ydn.crm.su.fixSugarCrmModuleMeta(details.modulesInfo[i]);
    }
    var ac = this.us_.getLoginEmail();
    var sugar = new ydn.crm.su.model.GDataSugar(details.about,
        details.modulesInfo, ac, details.serverInfo);
    if (this.attacher_) {

      this.handler.unlisten(this.attacher_,
          ydn.crm.su.events.EventType.VIEW_RECORD,
          this.onViewRecord_);
      this.attacher_.dispose();
    }
    this.attacher_ = new ydn.crm.su.AttachButtonProvider(sugar, this.gmail_observer_);
    this.handler.listen(this.attacher_,
        ydn.crm.su.events.EventType.VIEW_RECORD,
        this.onViewRecord_);

    this.context_panel.setSugarCrm(sugar);
    var archiver = new ydn.crm.su.Archiver(sugar, this.attacher_);
    this.heading_injector_.setSugar(archiver);

  }, this);

};


/**
 * Update sugar panels.
 * @private
 */
ydn.crm.inj.SugarCrmApp.prototype.updateSugarPanels_ = function() {
  if (ydn.crm.inj.SugarCrmApp.DEBUG) {
    window.console.info('preparing to update sugar panels');
  }
  ydn.msg.getChannel().send(ydn.crm.ch.Req.LIST_SUGAR).addCallback(
      function(arr) {
        if (ydn.crm.inj.SugarCrmApp.DEBUG) {
          window.console.log(arr);
        }
        var sugars = /** @type {Array<SugarCrm.About>} */ (arr);
        /**
         * @type {SugarCrm.About}
         */
        var about;
        for (var i = 0; i < sugars.length; i++) {
          var obj = sugars[i];
          if (obj.isLogin) {
            this.updateSugarCrm_(obj);
            return;
          }
        }
        if (ydn.crm.inj.SugarCrmApp.DEBUG) {
          window.console.info('no sugarcrm instance');
        }

      }, this);
};




