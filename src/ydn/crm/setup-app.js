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
 * @fileoverview Setup widzard for CRMinInbox suite.
 *
 * All extensions in CRMinInbox suite use this generic app page, and hence
 * same functionality. However each extension use different default
 * configuration for the target application.
 */



goog.provide('ydn.crm.SetupApp');
goog.require('goog.events.EventHandler');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.msg.StatusBar');
goog.require('ydn.msg.Pipe');



/**
 * Option page app for CRMinInbox suite.
 * @constructor
 * @struct
 */
ydn.crm.SetupApp = function() {

  ydn.msg.initPipe(ydn.msg.ChannelName.POPUP);
  ydn.ui.setTemplateDocument(chrome.extension.getURL(ydn.crm.base.INJ_TEMPLATE));

  /**
   * @protected
   * @type {Object}
   */
  this.user_info = null;

  var status_el = document.getElementById('sidebar-status');
  var status = new ydn.crm.msg.StatusBar(true);
  status.render(status_el);
  ydn.crm.msg.Manager.addConsumer(status);

  this.handler = new goog.events.EventHandler(this);
};


/**
 * @define {boolean} debug flag.
 */
ydn.crm.SetupApp.DEBUG = false;


/**
 * Close window.
 */
ydn.crm.SetupApp.close = function() {
  window.open('', '_self').close();
};


/**
 * Run option page app.
 * @return {ydn.crm.SetupApp}
 */
ydn.crm.SetupApp.runSetupApp = function() {
  var app = new ydn.crm.SetupApp();
  app.run();
  return app;
};


goog.exportSymbol('runSetupApp', ydn.crm.SetupApp.runSetupApp);
