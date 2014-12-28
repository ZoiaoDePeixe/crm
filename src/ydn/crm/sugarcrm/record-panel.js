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
 * @fileoverview Sugarcrm record sync panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.sugarcrm.RecordPanel');
goog.require('ydn.crm.sugarcrm.SyncPanel');
goog.require('ydn.crm.sugarcrm.model.Sugar');
goog.require('ydn.gdata.Kind');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.ui');



/**
 * Sugarcrm record sync panel.
 * @param {ydn.crm.sugarcrm.model.Sugar} m
 * @constructor
 * @struct
 * @extends {ydn.crm.sugarcrm.SyncPanel}
 */
ydn.crm.sugarcrm.RecordPanel = function(m) {
  goog.base(this, m);

  /**
   * @type {ydn.crm.sugarcrm.ModuleName}
   * @private
   */
  this.module_ = ydn.crm.sugarcrm.ModuleName.CONTACTS;
  /**
   * @private
   */
  this.primary_templ_ = ydn.ui.getTemplateById(
      'sync-record-primary-template').content;
  /**
   * @private
   */
  this.secondary_templ_ = ydn.ui.getTemplateById(
      'sync-record-secondary-template').content;

};
goog.inherits(ydn.crm.sugarcrm.RecordPanel, ydn.crm.sugarcrm.SyncPanel);


/**
 * @define {boolean} debug flag
 */
ydn.crm.sugarcrm.RecordPanel.DEBUG = true;


/**
 * @param {ydn.crm.sugarcrm.ModuleName} m
 */
ydn.crm.sugarcrm.RecordPanel.prototype.setModule = function(m) {
  this.module_ = m;
};


/**
 * @override
 */
ydn.crm.sugarcrm.RecordPanel.prototype.renderToolbar = function(toolbar) {
  var temp_tb = ydn.ui.getTemplateById('sync-record-toolbar-template').content;
  this.toolbar.appendChild(temp_tb.cloneNode(true));
  toolbar.appendChild(this.toolbar);

  var order_by = this.toolbar.querySelector('select[name=order-by]');
  var direction = this.toolbar.querySelector('select[name=direction]');
  order_by.onchange = this.onOrderChanged_.bind(this);
  direction.onchange = this.onDirChanged_.bind(this);
};


/**
 * @override
 */
ydn.crm.sugarcrm.RecordPanel.prototype.appendItem = function(prepend,
                                                             should_remove) {

};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.RecordPanel.prototype.onOrderChanged_ = function(e) {
  this.order_by = e.currentTarget.value;
  this.refreshContent();
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.RecordPanel.prototype.onDirChanged_ = function(e) {
  console.log(e);
  if (e.currentTarget.value == 'asc') {
    this.reverse = false;
  } else if (e.currentTarget.value == 'des') {
    this.reverse = true;
  } else {
    throw new Error('direction ' + e.target.value);
  }
  this.refreshContent();
};


/**
 * @protected
 */
ydn.crm.sugarcrm.RecordPanel.prototype.refreshFooter = function() {
  var query = {
    'kind': ydn.gdata.Kind.M8_CONTACT
  };
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_COUNT, query)
      .addCallback(function(cnt) {
        var el = this.toolbar.querySelector('span[name=record-count]');
        el.textContent = String(cnt);
      }, this);
};


/**
 * @override
 */
ydn.crm.sugarcrm.RecordPanel.prototype.refreshContent = function() {
  var ul = this.root.querySelector('.content UL');
  ul.innerHTML = '';
  var ch = this.model.getChannel();
  var query = {
    'store': this.module_,
    'index': this.order_by || '',
    'limit': 20
  };
  return ch.send(ydn.crm.Ch.SReq.QUERY, [query]).addCallbacks(function(arr) {
    var query = arr[0];
    if (ydn.crm.sugarcrm.RecordPanel.DEBUG) {
      window.console.log(query);
    }
    return this.renderNextEntry_(query['result'], 0);
  }, function(e) {
    window.console.error(String(e));
  }, this);
};


/**
 * @param {Element} el
 * @param {ydn.crm.sugarcrm.Record} entry
 * @return {!goog.async.Deferred<number>} return 1.
 * @private
 */
ydn.crm.sugarcrm.RecordPanel.prototype.renderEntry_ = function(el, entry) {
  var primary = el.querySelector('.primary');
  var secondary = el.querySelector('.secondary');

  primary.appendChild(this.primary_templ_.cloneNode(true));
  var name = primary.querySelector('span[name=name]');
  name.textContent = entry.getLabel();

  return goog.async.Deferred.succeed(1);
};


/**
 * @param {!Array<!SugarCrm.Record>} entries
 * @param {number} idx
 * @private
 */
ydn.crm.sugarcrm.RecordPanel.prototype.renderNextEntry_ = function(entries, idx) {
  if (idx >= entries.length) {
    return;
  }
  var ul = this.root.querySelector('.content UL');
  var li = this.sync_pair_templ.cloneNode(true).querySelector('li');
  ul.appendChild(li);
  var entry = new ydn.crm.sugarcrm.Record(this.model.getDomain(), this.module_,
      entries[idx]);
  var key = entry.value(this.order_by);

  li.setAttribute('data-id', entry.getId());
  li.setAttribute('data-index', this.order_by);
  li.setAttribute('data-key', key);
  this.renderEntry_(li, entry).addBoth(function() {
    idx++;
    this.renderNextEntry_(entries, idx);
  }, this);
};
