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
 * @fileoverview Email archive setting panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.ui.EmailArchiveSettingPanel');
goog.require('goog.events.EventHandler');
goog.require('goog.style');
goog.require('ydn.ui');



/**
 * Email archive setting panel.
 * @param {ydn.crm.ui.UserSetting} us
 * @constructor
 * @struct
 */
ydn.crm.ui.EmailArchiveSettingPanel = function(us) {
  /**
   * @private
   * @type {Element}
   */
  this.root_ = document.createElement('div');
  /**
   * @protected
   * @type {ydn.crm.ui.UserSetting}
   */
  this.us = us;
  /**
   * @protected
   * @type {goog.events.EventHandler}
   */
  this.handler = new goog.events.EventHandler(this);
};


/**
 * @param {Element} ele
 */
ydn.crm.ui.EmailArchiveSettingPanel.prototype.render = function(ele) {

  var temp = ydn.ui.getTemplateById('email-archive-setting-template').content;
  this.root_.appendChild(temp.cloneNode(true));
  ele.appendChild(this.root_);

  var detail = this.root_.querySelector('details');
  this.handler.listen(detail, 'click', this.onDetailsClick_);

  var sel = this.root_.querySelector('.email-archive-setting');
  this.handler.listen(sel, 'click', this.onSelectionClick_);
};


/**
 * @param {Event} ev
 * @private
 */
ydn.crm.ui.EmailArchiveSettingPanel.prototype.onDetailsClick_ = function(ev) {
  var is_open = !ev.currentTarget.hasAttribute('open');
  if (is_open) {
    this.refresh();
  }
};


ydn.crm.ui.EmailArchiveSettingPanel.prototype.refresh = function() {
  var status = this.us.getSetting(ydn.crm.ui.UserSetting.Key.EMAIL_ARCHIVE,
      ydn.crm.ui.EmailArchiveSettingKey.USER_DEFAULT);

  var item;
  if (status == ydn.crm.ui.DefaultArchiving.ALWAYS) {
    item = this.root_.querySelector('input[value="' +
        ydn.crm.ui.DefaultArchiving.ALWAYS + '"]');
  } else if (status == ydn.crm.ui.DefaultArchiving.DISABLE) {
    item = this.root_.querySelector('input[value="' +
        ydn.crm.ui.DefaultArchiving.DISABLE + '"]');
  } else if (status == ydn.crm.ui.DefaultArchiving.NORMALLY_ARCHIVE) {
    item = this.root_.querySelector('input[value="' +
        ydn.crm.ui.DefaultArchiving.NORMALLY_ARCHIVE + '"]');
  } else if (status == ydn.crm.ui.DefaultArchiving.NORMALLY_DO_NOT_ARCHIVE) {
    item = this.root_.querySelector('input[value="' +
        ydn.crm.ui.DefaultArchiving.NORMALLY_DO_NOT_ARCHIVE + '"]');
  } else {
    item = this.root_.querySelector('input[value="' +
        ydn.crm.ui.DefaultArchiving.DEFAULT + '"]');
  }
  var selected_item = this.root_.querySelector('input[checked]');
  if (selected_item == item) {
    return;
  }
  if (selected_item) {
    selected_item.removeAttribute('checked');
  }
  if (item) {
    item.setAttribute('checked', '');
  } else if (goog.DEBUG) {
    window.console.warn('invalid status');
  }
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.EmailArchiveSettingPanel.prototype.onSelectionClick_ = function(e) {
  if (e.target.tagName == 'INPUT') {
    var s = /** @type {ydn.crm.ui.DefaultArchiving} */ (e.target.value);
    this.setPref(s);
  }
};


/**
 * Set archivnig pref.
 * @param {ydn.crm.ui.DefaultArchiving} val
 */
ydn.crm.ui.EmailArchiveSettingPanel.prototype.setPref = function(val) {
  if ([ydn.crm.ui.DefaultArchiving.ALWAYS,
        ydn.crm.ui.DefaultArchiving.DISABLE,
        ydn.crm.ui.DefaultArchiving.NORMALLY_ARCHIVE,
        ydn.crm.ui.DefaultArchiving.NORMALLY_DO_NOT_ARCHIVE,
        ydn.crm.ui.DefaultArchiving.DEFAULT].indexOf(val) == -1) {
    if (goog.DEBUG) {
      window.console.warn('Invalid user default tracking value: ' + val);
    }
    val = ydn.crm.ui.DefaultArchiving.DEFAULT;
  }
  this.us.setSetting(val, ydn.crm.ui.UserSetting.Key.EMAIL_ARCHIVE,
      ydn.crm.ui.EmailArchiveSettingKey.USER_DEFAULT);
};
