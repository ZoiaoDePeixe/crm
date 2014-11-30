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
 * @fileoverview Email tracking app run in content script.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.inj.TrackingApp');
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
goog.require('ydn.crm.inj.GmailContextContainer');
goog.require('ydn.crm.inj.Hud');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.sugarcrm.model.Archiver');
goog.require('ydn.crm.tracking.GmailComposeTracker');
goog.require('ydn.crm.tracking.GmailReplyTracker');
goog.require('ydn.crm.tracking.result.Sidebar');
goog.require('ydn.debug');
goog.require('ydn.gmail.Utils.GmailViewState');
goog.require('ydn.msg.Pipe');



/**
 * Email tracking app.
 * @param {ydn.crm.gmail.MessageHeaderInjector} heading_injector
 * @param {ydn.crm.gmail.GmailObserver} gmail_observer
 * @param {ydn.crm.gmail.ComposeObserver} compose_observer
 * @param {ydn.crm.inj.ContextContainer} renderer
 * @param {ydn.cs.ReplyPanelManager} reply_panel_manager
 * @param {ydn.crm.inj.Hud} hud
 * @constructor
 * @struct
 */
ydn.crm.inj.TrackingApp = function(heading_injector, gmail_observer, compose_observer, renderer, reply_panel_manager, hud) {

  /**
   * @final
   * @type {ydn.crm.gmail.MessageHeaderInjector}
   * @private
   */
  this.heading_injector_ = heading_injector;

  /**
   * @final
   * @type {ydn.crm.inj.ContextContainer}
   * @private
   */
  this.context_container_ = renderer;

  /**
   * @final
   * @type {ydn.cs.ReplyPanelManager}
   * @private
   */
  this.reply_panel_manager_ = reply_panel_manager;

  /**
   * @type {ydn.crm.tracking.result.Controller}
   * @private
   */
  this.track_result_ = null;

  /**
   * @type {ydn.crm.tracking.GmailComposeTracker}
   * @private
   */
  this.tracker_ = new ydn.crm.tracking.GmailComposeTracker(compose_observer);

  this.reply_tracker_ = new ydn.crm.tracking.GmailReplyTracker();

  var us = ydn.crm.ui.UserSetting.getInstance();
  /**
   * @type {ydn.crm.tracking.result.Sidebar}
   * @private
   */
  this.sidebar_ = new ydn.crm.tracking.result.Sidebar(us);
  hud.addPanel(this.sidebar_);
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.TrackingApp.DEBUG = false;


/**
 * Initialize UI.
 */
ydn.crm.inj.TrackingApp.prototype.init = function() {
  var us = ydn.crm.ui.UserSetting.getInstance();
  goog.events.listen(us,
      [ydn.crm.ui.UserSetting.EventType.LOGIN,
        ydn.crm.ui.UserSetting.EventType.LOGOUT],
      this.onUserStatusChange, false, this);
};


/**
 * Reset user setting
 * @param {goog.events.Event} e
 * @protected
 */
ydn.crm.inj.TrackingApp.prototype.onUserStatusChange = function(e) {
  var us = /** @type {ydn.crm.ui.UserSetting} */ (ydn.crm.ui.UserSetting.getInstance());
  if (us.hasValidLogin()) {
    if (!this.track_result_) {
      this.track_result_ = new ydn.crm.tracking.result.Controller(this.context_container_);
      this.heading_injector_.setTrackResult(this.track_result_);
      this.reply_panel_manager_.subscribeReplyPanelService(this.reply_tracker_);
    }
  }
};


