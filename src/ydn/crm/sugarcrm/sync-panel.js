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


goog.provide('ydn.crm.sugarcrm.SyncPanel');
goog.require('goog.asserts');
goog.require('goog.style');
goog.require('ydn.dom');
goog.require('ydn.ui');
goog.require('ydn.ui.InfiniteScrollDecorator');



/**
 * Synchronization panel.
 * @param {ydn.crm.sugarcrm.model.Sugar} m
 * @constructor
 * @struct
 * @implements {ydn.ui.InfiniteScrollItemProvider}
 */
ydn.crm.sugarcrm.SyncPanel = function(m) {

  /**
   * @type {ydn.crm.sugarcrm.model.Sugar}
   * @protected
   */
  this.model = m;
  /**
   * @type {Element}
   * @protected
   */
  this.root = document.createElement('div');
  /**
   * @type {Element}
   * @protected
   */
  this.toolbar = document.createElement('span');
  goog.style.setElementShown(this.root, false);
  goog.style.setElementShown(this.toolbar, false);

  /**
   * @protected
   * @type {string}
   */
  this.order_by = '';
  /**
   * @protected
   * @type {boolean}
   */
  this.reverse = false;

  /**
   * @protected
   */
  this.sync_pair_templ = ydn.ui.getTemplateById('sync-pair-template').content;

};


/**
 * @define {boolean} debug flag
 */
ydn.crm.sugarcrm.SyncPanel.DEBUG = false;


/**
 * Render UI.
 * @param {Element} el
 * @param {Element} toolbar
 */
ydn.crm.sugarcrm.SyncPanel.prototype.render = function(el, toolbar) {
  this.root.classList.add('gdata-sync-panel');
  var temp = ydn.ui.getTemplateById('sync-panel-template').content;
  this.root.appendChild(temp.cloneNode(true));
  el.appendChild(this.root);
  toolbar.appendChild(this.toolbar);

  var ul = this.root.querySelector('UL.infinite-scroll');
  var scroll = new ydn.ui.InfiniteScrollDecorator(ul, this);
  ul.style.top = '70px';
  ul.style.bottom = '20px';

  this.renderContent();
  this.renderToolbar();
};


/**
 * @protected
 */
ydn.crm.sugarcrm.SyncPanel.prototype.renderContent = function() {

};


/**
 * @protected
 */
ydn.crm.sugarcrm.SyncPanel.prototype.renderToolbar = function() {

};


/**
 * @override
 */
ydn.crm.sugarcrm.SyncPanel.prototype.appendItem = goog.abstractMethod;


/**
 * @protected
 */
ydn.crm.sugarcrm.SyncPanel.prototype.refreshFooter = goog.abstractMethod;


/**
 * Re-render content.
 * @protected
 */
ydn.crm.sugarcrm.SyncPanel.prototype.refreshContent = goog.abstractMethod;


/**
 * @param {boolean} val
 * @final
 */
ydn.crm.sugarcrm.SyncPanel.prototype.setVisible = function(val) {
  goog.style.setElementShown(this.root, val);
  goog.style.setElementShown(this.toolbar, val);
  if (val) {
    this.refresh();
  }
};


/**
 * Refresh will be called only when model is set and caller will show the UI.
 * @protected
 * @final
 */
ydn.crm.sugarcrm.SyncPanel.prototype.refresh = function() {
  goog.asserts.assert(this.model);
  this.refreshFooter();
  this.refreshContent();
};
