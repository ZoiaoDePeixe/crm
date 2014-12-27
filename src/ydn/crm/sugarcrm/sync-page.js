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
goog.require('ydn.crm.sugarcrm.GDataContactPanel');
goog.require('ydn.crm.sugarcrm.model.Sugar');
goog.require('ydn.gdata.Kind');
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

  /**
   * @type {ydn.crm.sugarcrm.GDataContactPanel}
   * @private
   */
  this.gdata_contact_panel_ = null;
  
  this.need_refresh_ = false;
};


/**
 * @override
 */
ydn.crm.sugarcrm.SyncPage.prototype.render = function(el) {
  this.root_.classList.add('sync-page');
  var temp = ydn.ui.getTemplateById('sugarcrm-sync-template').content;
  this.root_.appendChild(temp.cloneNode(true));
  el.appendChild(this.root_);
  goog.style.setElementShown(this.root_, false);
  var content = this.root_.querySelector('.content');
  goog.style.setElementShown(content, false);

};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.onPanelChange_ = function(e) {
  this.refreshContent_();
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
  this.need_refresh_ = true;
  this.decorate_();
};


/**
 * @const
 * @type {string}
 */
ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTACT = 'sync-contact';


/**
 * Refresh DOM whee model is set and element is not rendered.
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.decorate_ = function() {
  if (!this.model_) {
    return;
  }
  var content = this.root_.querySelector('.' +
      ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTACT);
  if (content) {
    if (this.need_refresh_) {
      this.refresh_();
    }
    return;
  }
  var templ = ydn.ui.getTemplateById('sync-content-template').content;
  this.root_.appendChild(templ.cloneNode(true));
  this.gdata_contact_panel_ = new ydn.crm.sugarcrm.GDataContactPanel(this.model_);
  content = this.root_.querySelector('.' +
      ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTACT + ' .content');
  var toolbar = this.root_.querySelector('.' +
      ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTACT + ' .header .toolbar');
  this.gdata_contact_panel_.render(content, toolbar);

  var select = this.root_.querySelector('select[name=select-panel]');
  select.onchange = this.onPanelChange_.bind(this);

  if (this.need_refresh_) {
    this.refresh_();
  }
};


/**
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.refreshCount_ = function() {
  var sync_div = this.root_.querySelector('.' +
      ydn.crm.sugarcrm.SyncPage.CSS_CLASS_SYNC_CONTACT + ' .header .count');

  var gch = this.model_.getChannel();
  gch.send(ydn.crm.Ch.SReq.COUNT, {'module': ydn.crm.sugarcrm.ModuleName.ACCOUNTS})
      .addCallback(function(cnt) {
        var el = sync_div.querySelector('a[name=sugarcrm-account-count]');
        el.textContent = String(cnt);
      }, this);
  gch.send(ydn.crm.Ch.SReq.COUNT, {'module': ydn.crm.sugarcrm.ModuleName.CONTACTS})
      .addCallback(function(cnt) {
        var el = sync_div.querySelector('a[name=sugarcrm-contact-count]');
        el.textContent = String(cnt);
      }, this);
  gch.send(ydn.crm.Ch.SReq.COUNT, {'module': ydn.crm.sugarcrm.ModuleName.LEADS})
      .addCallback(function(cnt) {
        var el = sync_div.querySelector('a[name=sugarcrm-lead-count]');
        el.textContent = String(cnt);
      }, this);
};


/**
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.refreshContent_ = function() {
  var select = this.root_.querySelector('select[name=select-panel]');
  var idx = select.selectedIndex;
  if (idx == 0) {
    this.gdata_contact_panel_.setVisible(true);
  } else {
    this.gdata_contact_panel_.setVisible(false);
  }
};


/**
 * @private
 */
ydn.crm.sugarcrm.SyncPage.prototype.refresh_ = function() {
  this.refreshCount_();
  this.refreshContent_();
};


/**
 * @override
 */
ydn.crm.sugarcrm.SyncPage.prototype.toString = function() {
  return 'Sync';
};
