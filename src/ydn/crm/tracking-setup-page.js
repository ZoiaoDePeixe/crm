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
 * @fileoverview Tracking domain setup page.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.TrackingSetupPage');
goog.require('goog.events.EventHandler');
goog.require('ydn.crm.IPage');
goog.require('ydn.crm.tracking.SettingWidget');



/**
 * Tracking setup page.
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.TrackingSetupPage = function() {
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
  /**
   * @protected
   * @type {ydn.crm.tracking.SettingWidget}
   */
  this.setting_widget = new ydn.crm.tracking.SettingWidget();
  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.render = function(el) {
  el.appendChild(this.root_);
  this.setting_widget.render(this.root_);
};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.onPageShow = function() {
  this.setting_widget.refresh();
};


/**
 * @override
 */
ydn.crm.TrackingSetupPage.prototype.toString = function() {
  return 'Setup';
};
