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
 * @fileoverview Email tracking app.
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
goog.require('ydn.crm.inj');
goog.require('ydn.crm.inj.Hud');
goog.require('ydn.crm.inj.InlineRenderer');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.shared');
goog.require('ydn.crm.sugarcrm.model.Archiver');
goog.require('ydn.crm.tracking.Tracker');
goog.require('ydn.debug');
goog.require('ydn.gmail.Utils.GmailViewState');
goog.require('ydn.msg.Pipe');



/**
 * Email tracking app.
 * @param {ydn.crm.gmail.MessageHeaderInjector} heading_injector
 * @param {ydn.crm.gmail.GmailObserver} gmail_observer
 * @param {ydn.crm.gmail.ComposeObserver} compose_observer
 * @constructor
 * @struct
 */
ydn.crm.inj.TrackingApp = function(heading_injector, gmail_observer, compose_observer) {

  /**
   * @final
   * @type {ydn.crm.gmail.MessageHeaderInjector}
   * @private
   */
  this.heading_injector_ = heading_injector;

  /**
   * @type {ydn.crm.tracking.Tracker}
   * @private
   */
  this.tracker_ = new ydn.crm.tracking.Tracker();
  this.tracker_.setObserver(compose_observer);

};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.TrackingApp.DEBUG = false;


/**
 * Initialize UI.
 */
ydn.crm.inj.TrackingApp.prototype.init = function() {

};


/**
 * Reset user setting
 * @param {ydn.crm.ui.UserSetting} us
 */
ydn.crm.inj.TrackingApp.prototype.onUserStatusChange = function(us) {
  if (us.hasValidLogin()) {
    this.heading_injector_.setTrackResult(new ydn.crm.tracking.TrackResult());
  } else {
    this.heading_injector_.setTrackResult(null);
  }
};

