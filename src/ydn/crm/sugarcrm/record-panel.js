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
 * @fileoverview Panel for list of records to visualize synchronization.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.su.RecordPanel');
goog.require('ydn.crm.su.SyncPanel');
goog.require('ydn.crm.su.model.Sugar');
goog.require('ydn.gdata.Kind');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.ui');



/**
 * Sugarcrm record sync panel.
 * @param {ydn.crm.su.model.Sugar} m
 * @constructor
 * @struct
 * @extends {ydn.crm.su.SyncPanel}
 */
ydn.crm.su.RecordPanel = function(m) {
  goog.base(this, m);

  /**
   * @type {ydn.crm.su.ModuleName}
   * @private
   */
  this.module_ = ydn.crm.su.ModuleName.CONTACTS;
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
goog.inherits(ydn.crm.su.RecordPanel, ydn.crm.su.SyncPanel);


/**
 * @define {boolean} debug flag
 */
ydn.crm.su.RecordPanel.DEBUG = true;


/**
 * @param {ydn.crm.su.ModuleName} m
 */
ydn.crm.su.RecordPanel.prototype.setModule = function(m) {
  this.module_ = m;
};


/**
 * @override
 */
ydn.crm.su.RecordPanel.prototype.renderToolbar = function() {
  var temp_tb = ydn.ui.getTemplateById('sync-record-toolbar-template').content;
  this.toolbar.appendChild(temp_tb.cloneNode(true));

  var order_by = this.toolbar.querySelector('select[name=order-by]');
  var direction = this.toolbar.querySelector('select[name=direction]');
  order_by.onchange = this.onOrderChanged_.bind(this);
  direction.onchange = this.onDirChanged_.bind(this);
};


/**
 * @override
 */
ydn.crm.su.RecordPanel.prototype.showMoreItemsOnScroll = function(prepend,
    should_remove) {
  var ul = this.root.querySelector('UL.infinite-scroll');
  /**
   * @type {ydn.db.KeyRange|undefined}
   */
  var key_range = undefined;
  var id;
  var rev = this.reverse;
  if (prepend) {
    rev = !rev;
    if (!!ul.firstElementChild) {
      id = ul.firstElementChild.getAttribute('data-key');
      key_range = ydn.db.KeyRange.where('<', id);
    }
  } else {
    if (!!ul.lastElementChild) {
      id = ul.lastElementChild.getAttribute('data-key');
      key_range = ydn.db.KeyRange.where('>', id);
    }
  }
  var index = this.order_by;
  var query = {
    'store': this.module_,
    'index': index,
    'limit': 1,
    'reverse': rev,
    'keyRange': key_range ? key_range.toJSON() : undefined
  };
  var ch = this.model.getChannel();
  return ch.send(ydn.crm.ch.SReq.QUERY, [query]).addCallbacks(function(arr) {
    var result = /** @type {CrmApp.QueryResult} */ (arr[0]);
    var item = result.result[0];
    if (ydn.crm.su.RecordPanel.DEBUG) {
      window.console.log(id, (item ? item['id'] : null), item);
    }
    if (item) {
      var li = this.sync_pair_templ.cloneNode(true).querySelector('li');
      if (prepend && ul.firstElementChild) {
        if (should_remove) {
          ul.removeChild(ul.lastElementChild);
        }
        ul.insertBefore(li, ul.firstElementChild);
      } else {
        if (should_remove) {
          ul.removeChild(ul.firstElementChild);
        }
        ul.appendChild(li);
      }

      var entry = new ydn.crm.su.Record(this.model.getDomain(),
          this.module_, item);
      var key = this.order_by ? entry.value(this.order_by) : entry.getId();

      li.setAttribute('data-id', entry.getId());
      li.setAttribute('data-index', this.order_by);
      li.setAttribute('data-key', key);

      return this.renderEntry_(li, entry);
    }
  }, function(e) {
    window.console.error(String(e));
  }, this);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.su.RecordPanel.prototype.onOrderChanged_ = function(e) {
  this.order_by = e.currentTarget.value;
  this.refreshContent();
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.su.RecordPanel.prototype.onDirChanged_ = function(e) {
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
ydn.crm.su.RecordPanel.prototype.refreshFooter = function() {
  var query = {
    'module': this.module_
  };
  var ch = this.model.getChannel();
  ch.send(ydn.crm.ch.SReq.COUNT, query)
      .addCallback(function(cnt) {
        var el = this.toolbar.querySelector('span[name=record-count]');
        el.textContent = String(cnt);
      }, this);
};


/**
 * @override
 */
ydn.crm.su.RecordPanel.prototype.refreshContent = function() {
  var ul = this.root.querySelector('.content UL');
  ul.innerHTML = '';
  var ch = this.model.getChannel();
  var query = {
    'store': this.module_,
    'index': this.order_by || '',
    'reverse': this.reverse,
    'limit': 20
  };
  return ch.send(ydn.crm.ch.SReq.QUERY, [query]).addCallbacks(function(arr) {
    var query = arr[0];
    if (ydn.crm.su.RecordPanel.DEBUG) {
      window.console.log(query);
    }
    return this.renderEntries_(query['result']);
  }, function(e) {
    window.console.error(String(e));
  }, this);
};


/**
 * @param {Element} el
 * @param {ydn.crm.su.Record} entry
 * @return {!goog.async.Deferred<number>} return 1.
 * @private
 */
ydn.crm.su.RecordPanel.prototype.renderEntry_ = function(el, entry) {
  var primary = el.querySelector('.primary');
  var secondary = el.querySelector('.secondary');

  primary.appendChild(this.primary_templ_.cloneNode(true));
  var name = primary.querySelector('span[name=name]');
  name.textContent = entry.getLabel();

  return goog.async.Deferred.succeed(1);
};


/**
 * Render entries.
 * @param {!Array<!SugarCrm.Record>} entries list of entries to render.
 * @param {number=} opt_idx current entry to render, default to 0.
 * @private
 */
ydn.crm.su.RecordPanel.prototype.renderEntries_ = function(entries, opt_idx) {
  var idx = opt_idx || 0;
  if (idx >= entries.length) {
    return;
  }
  var ul = this.root.querySelector('.content UL');
  var li = this.sync_pair_templ.cloneNode(true).querySelector('li');
  ul.appendChild(li);
  var entry = new ydn.crm.su.Record(this.model.getDomain(), this.module_,
      entries[idx]);
  var key = this.order_by ? entry.value(this.order_by) : entry.getId();

  li.setAttribute('data-id', entry.getId());
  li.setAttribute('data-index', this.order_by);
  li.setAttribute('data-key', key);
  this.renderEntry_(li, entry).addBoth(function() {
    idx++;
    this.renderEntries_(entries, idx);
  }, this);
};
