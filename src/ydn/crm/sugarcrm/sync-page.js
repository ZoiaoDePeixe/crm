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
 * @fileoverview Synchronization page.
 *
 * Show list of sync pairs and potential sync pair.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.su.SyncPage');
goog.require('goog.style');
goog.require('ydn.crm.su.GDataContactPanel');
goog.require('ydn.crm.su.RecordPanel');
goog.require('ydn.crm.su.model.Sugar');
goog.require('ydn.gdata.Kind');
goog.require('ydn.ui');



/**
 * Synchronization page.
 * @constructor
 * @implements {ydn.crm.IPage}
 * @struct
 */
ydn.crm.su.SyncPage = function() {
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');

  /**
   * @type {ydn.crm.su.model.Sugar}
   * @private
   */
  this.model_ = null;

  /**
   * @type {ydn.crm.su.GDataContactPanel}
   * @private
   */
  this.gdata_contact_panel_ = null;

  /**
   * @type {ydn.crm.su.RecordPanel}
   * @private
   */
  this.record_panel_ = null;

  /**
   * @type {boolean}
   * @private
   */
  this.need_refresh_ = false;
};


/**
 * @override
 */
ydn.crm.su.SyncPage.prototype.render = function(el) {
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
ydn.crm.su.SyncPage.prototype.onPanelChange_ = function(e) {
  this.refreshContent_();
};


/**
 * Set SugarCRM model.
 * This should set only when gdata credential exists.
 * @param {ydn.crm.su.model.Sugar} sugar
 */
ydn.crm.su.SyncPage.prototype.setModel = function(sugar) {
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
ydn.crm.su.SyncPage.prototype.onPageShow = function() {
  this.need_refresh_ = true;
  this.decorate_();
};


/**
 * @const
 * @type {string}
 */
ydn.crm.su.SyncPage.CSS_CLASS_SYNC_CONTACT = 'sync-contact';


/**
 * Refresh DOM whee model is set and element is not rendered.
 * @private
 */
ydn.crm.su.SyncPage.prototype.decorate_ = function() {
  if (!this.model_) {
    return;
  }
  var content = this.root_.querySelector('.' +
      ydn.crm.su.SyncPage.CSS_CLASS_SYNC_CONTACT);
  if (content) {
    if (this.need_refresh_) {
      this.refresh_();
    }
    return;
  }
  var templ = ydn.ui.getTemplateById('sync-content-template').content;
  this.root_.appendChild(templ.cloneNode(true));

  content = this.root_.querySelector('.' +
      ydn.crm.su.SyncPage.CSS_CLASS_SYNC_CONTACT + ' .content');
  var toolbar = this.root_.querySelector('.' +
      ydn.crm.su.SyncPage.CSS_CLASS_SYNC_CONTACT + ' .header .toolbar');

  this.gdata_contact_panel_ = new ydn.crm.su.GDataContactPanel(this.model_);
  this.gdata_contact_panel_.render(content, toolbar);

  this.record_panel_ = new ydn.crm.su.RecordPanel(this.model_);
  this.record_panel_.render(content, toolbar);

  var select = this.root_.querySelector('select[name=select-panel]');
  select.onchange = this.onPanelChange_.bind(this);

  if (this.need_refresh_) {
    this.refresh_();
  }
};


/**
 * @private
 */
ydn.crm.su.SyncPage.prototype.refreshContent_ = function() {
  var select = this.root_.querySelector('select[name=select-panel]');
  var idx = select.selectedIndex;
  if (idx == 0) {
    this.record_panel_.setVisible(false);
    this.gdata_contact_panel_.setVisible(true);
  } else {
    this.gdata_contact_panel_.setVisible(false);
    if (idx == 2) {
      this.record_panel_.setModule(ydn.crm.su.ModuleName.CONTACTS);
    } else if (idx == 3) {
      this.record_panel_.setModule(ydn.crm.su.ModuleName.LEADS);
    } else {
      this.record_panel_.setModule(ydn.crm.su.ModuleName.ACCOUNTS);
    }
    this.record_panel_.setVisible(true);
  }
};


/**
 * @private
 */
ydn.crm.su.SyncPage.prototype.refresh_ = function() {
  this.refreshContent_();
};


/**
 * @override
 */
ydn.crm.su.SyncPage.prototype.toString = function() {
  return 'SugarCRM';
};
