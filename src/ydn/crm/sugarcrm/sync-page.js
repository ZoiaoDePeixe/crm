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
 * @fileoverview Home page for SugarCRM in CRMinInbox suite.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.sugarcrm.SyncPage');
goog.require('goog.style');
goog.require('ydn.crm.sugarcrm.model.Sugar');
goog.require('ydn.ui');



/**
 * Home page for SugarCRM in CRMinInbox suite.
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.sugarcrm.SyncPage = function() {
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');

  /**
   * @type {ydn.crm.sugarcrm.model.Sugar}
   * @private
   */
  this.model_ = null;
};


/**
 * @override
 */
ydn.crm.sugarcrm.SyncPage.prototype.render = function(el) {
  var temp = ydn.ui.getTemplateById('sugarcrm-sync-template').content;
  this.root_.appendChild(temp.cloneNode(true));
  el.appendChild(this.root_);
  goog.style.setElementShown(this.root_, false);
  var content = this.root_.querySelector('.content');
  goog.style.setElementShown(content, false);
};


/**
 * Set SugarCRM model.
 * This should set only when gdata credential exists.
 * @param {ydn.crm.sugarcrm.model.Sugar} sugar
 */
ydn.crm.sugarcrm.SyncPage.prototype.setModel = function(sugar) {
  this.model_ = sugar;
  goog.style.setElementShown(this.root_, true);
  var domain = this.root_.querySelector('.header .domain');
  domain.textContent = sugar.getDomain();
  domain.href = sugar.getHomeUrl();
  this.decorate_();
};


/**
 * @override
 */
ydn.crm.sugarcrm.SyncPage.prototype.onPageShow = function() {
  this.decorate_();
};


/**
 * @const
 * @type {string}
 */
ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTENT = 'sync-contact';


/**
 * Refresh DOM whee model is set and element is not rendered.
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.decorate_ = function() {
  if (!this.model_) {
    return;
  }
  var content = this.root_.querySelector('.' +
      ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTENT);
  if (content) {
    return;
  }
  content = ydn.ui.getTemplateById('sync-content-template').content.cloneNode(true);
  this.root_.appendChild(content);
  this.refresh_();
};


/**
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.refreshCount_ = function() {
  var sync_div = this.root_.querySelector('.' +
      ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTENT + ' .header .count');
  ydn.msg.getChannel(ydn.crm.Ch.Req.GDATA_LIST_CONTACT)
};


/**
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.refresh_ = function() {
  this.refreshCount_();
};


/**
 * @override
 */
ydn.crm.sugarcrm.SyncPage.prototype.toString = function() {
  return 'Sync';
};
