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
 * @fileoverview Tracking setting widget.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.TrackingSettingWidget');
goog.require('goog.events.EventHandler');
goog.require('ydn.crm.tracking.utils');



/**
 * Tracking setting widget.
 * @constructor
 * @struct
 */
ydn.crm.TrackingSettingWidget = function() {
  /**
   * @type {Element}
   * @private
   */
  this.root_ = null;

  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
};


/**
 * @const
 * @type {string}
 */
ydn.crm.TrackingSettingWidget.TEMPLATE_ID = 'tracking-setting-template';


/**
 * Render UI.
 * @param {Element} el
 */
ydn.crm.TrackingSettingWidget.prototype.render = function(el) {
  var template = ydn.ui.getTemplateById(ydn.crm.TrackingSettingWidget.TEMPLATE_ID);
  el.appendChild(template.content.cloneNode(true));
  this.root_ = el.querySelector('section.tracking-setting');
  var sel = this.root_.querySelector('.default-tracking-selection');
  this.handler.listen(sel, 'click', this.onSelectionClick_);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.TrackingSettingWidget.prototype.onSelectionClick_ = function(e) {
  if (e.target.tagName == 'INPUT') {
    var s = /** @type {ydn.crm.tracking.DefaultTracking} */ (e.target.value);
    ydn.crm.tracking.utils.setUserDefaultTracking(s);
  }
};
