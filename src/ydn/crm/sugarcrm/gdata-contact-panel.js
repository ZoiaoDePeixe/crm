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


goog.provide('ydn.crm.sugarcrm.GDataContactPanel');
goog.require('ydn.crm.sugarcrm.SyncPanel');
goog.require('ydn.crm.sugarcrm.model.Sugar');
goog.require('ydn.gdata.Kind');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.ui');



/**
 * Synchronization panel.
 * @param {ydn.crm.sugarcrm.model.Sugar} m
 * @constructor
 * @struct
 * @extends {ydn.crm.sugarcrm.SyncPanel}
 */
ydn.crm.sugarcrm.GDataContactPanel = function(m) {
  goog.base(this);

  /**
   * @type {ydn.crm.sugarcrm.model.Sugar}
   * @private
   */
  this.model_ = m;
  /**
   * @private
   */
  this.primary_templ_ = ydn.ui.getTemplateById('sync-gdata-entry-template').content;
  /**
   * @private
   */
  this.secondary_templ_ = ydn.ui.getTemplateById(
      'sync-secondary-sugarcrm-record-template').content;

  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this.render_next_df_ = null;
};
goog.inherits(ydn.crm.sugarcrm.GDataContactPanel, ydn.crm.sugarcrm.SyncPanel);


/**
 * @define {boolean} debug flag
 */
ydn.crm.sugarcrm.GDataContactPanel.DEBUG = false;


/**
 * Render UI.
 * @param {Element} el
 * @param {Element} toolbar
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.render = function(el, toolbar) {
  goog.base(this, 'render', el, toolbar);
  var temp_tb = ydn.ui.getTemplateById('gdata-sync-toolbar-template').content;
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
ydn.crm.sugarcrm.GDataContactPanel.prototype.appendItem = function(prepend,
                                                                   should_remove) {
  var ul = this.root.querySelector('UL.infinite-scroll');
  var id = undefined;
  var rev = this.reverse;
  if (prepend) {
    rev = !rev;
    if (!!ul.firstElementChild) {
      id = ul.firstElementChild.getAttribute('data-key');
    }
  } else {
    if (!!ul.lastElementChild) {
      id = ul.lastElementChild.getAttribute('data-key');
    }
  }
  var index = this.order_by;
  var query = {
    'index': index,
    'limit': 1,
    'reverse': rev,
    'after': id
  };
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT, query)
      .addCallback(function(arr) {
        var item = arr[0];
        if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
          window.console.log(id,
              goog.object.getValueByKeys(item || {}, 'id', '$t'), item);
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
          var entry = new ydn.gdata.m8.ContactEntry(item);
          var key;
          if (index == 'updated.$t') {
            key = ydn.db.utils.getValueByKeys(item, index);
          } else if (index == 'name') {
            key = entry.getFullName();
          } else {
            key = entry.getId();
          }
          li.setAttribute('data-id', entry.getSingleId());
          li.setAttribute('data-index', index);
          li.setAttribute('data-key', key);
          return this.renderEntry_(li, entry);
        }
      }, this);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.onOrderChanged_ = function(e) {
  this.order_by = e.currentTarget.value;
  this.resetContent_();
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.onDirChanged_ = function(e) {
  console.log(e);
  if (e.currentTarget.value == 'asc') {
    this.reverse = false;
  } else if (e.currentTarget.value == 'des') {
    this.reverse = true;
  } else {
    throw new Error('direction ' + e.target.value);
  }
  this.resetContent_();
};


/**
 * @protected
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.refreshFooter = function() {
  var query = {
    'kind': ydn.gdata.Kind.M8_CONTACT
  };
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_COUNT, query)
      .addCallback(function(cnt) {
        var el = this.toolbar.querySelector('span[name=gdata-contact-count]');
        el.textContent = String(cnt);
      }, this);
};


/**
 * Score range from 0 to 1. 1 being surely match.
 * @typedef {{
 *   score: number,
 *   record: ydn.crm.sugarcrm.Record
 * }}
 */
ydn.crm.sugarcrm.GDataContactPanel.SimilarityResult;


/**
 * @param {string} domain
 * @param {Array<ydn.crm.sugarcrm.GDataContactPanel.SimilarityResult>} arr sorted
 * array by score.
 * @param {SugarCrm.ContactSimilarityResult} res result to put into arr.
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.enrichFor_ = function(domain, arr, res) {
  for (var i = 0; i < res.result.length; i++) {
    var record = res.result[i];
    var ex_idx = -1;
    for (var k = 0; k < arr.length; k++) {
      if (arr[k].record.getId() == record.id) {
        ex_idx = k;
        break;
      }
    }
    var score = 0;
    if (res.index == 'ydn$emails') {
      score = 1;
    } else if (res.index == 'ydn$phones') {
      score = 0.5;
    } else {
      score = 0.2; // name
    }
    if (ex_idx == -1) {
      var mn = /** @type {ydn.crm.sugarcrm.ModuleName} */ (res.module);
      var obj = {
        score: score,
        record: new ydn.crm.sugarcrm.Record(domain, mn, record)
      };
      goog.array.binaryInsert(arr, obj, function(a, b) {
        return a.score > b.score ? 1 : -1;
      });
    } else {
      arr[ex_idx].score += score;
    }
  }
};


/**
 * Enrich query result by combining similar records into a bin.
 * @param {string} domain
 * @param {Array<SugarCrm.ContactSimilarityResult>} results
 * @return {Array<ydn.crm.sugarcrm.GDataContactPanel.SimilarityResult>}
 * Results for for each module. Results are order by score with higher score
 * comes first.
 */
ydn.crm.sugarcrm.GDataContactPanel.enrich = function(domain, results) {
  var arr = [];
  for (var i = 0; i < results.length; i++) {
    var res = results[i];
    if (!arr) {
      window.console.warn('Invalid result of module: ' + res.module);
      continue;
    }
    ydn.crm.sugarcrm.GDataContactPanel.enrichFor_(domain, arr, res);
  }
  return arr;
};


/**
 * @param {Element} el
 * @param {ydn.gdata.m8.ContactEntry} entry
 * @return {!goog.async.Deferred<number>} return 1.
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.renderEntry_ = function(el, entry) {
  var primary = el.querySelector('.primary');
  var secondary = el.querySelector('.secondary');

  primary.appendChild(this.primary_templ_.cloneNode(true));
  var name = primary.querySelector('span[name=name]');
  name.textContent = entry.getFullName();
  var email = primary.querySelector('span[name=emails]');
  email.textContent = entry.getEmails().join(', ');

  var ch = this.model_.getChannel();
  var ce = entry.getData();
  return ch.send(ydn.crm.Ch.SReq.QUERY_SIMILAR, ce).addCallback(function(arr) {
    if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
      window.console.log(arr);
    }
    var ip_btn = primary.querySelector('button[name=import]');
    var domain = this.model_.getDomain();
    var results = ydn.crm.sugarcrm.GDataContactPanel.enrich(domain, arr);
    for (var i = 0; i < results.length; i++) {
      var res = results[i];
      if (res.score >= 1.0) {
        // consider exact match, and not allow to create a new record,
        // but instead must sync with it.
        ip_btn.setAttribute('disabled', 'disabled');
      }
      var sec_el = this.secondary_templ_.cloneNode(true).firstElementChild;
      var label = sec_el.querySelector('[name=label]');
      label.textContent = res.record.getLabel();
      var m_name = res.record.getModule();
      var id = res.record.getId();
      sec_el.classList.add(m_name);
      sec_el.setAttribute('data-module', m_name);
      sec_el.setAttribute('data-id', id);
      label.href = this.model_.getRecordViewLink(m_name, id);
      var icon = sec_el.querySelector('.icon');
      icon.textContent = ydn.crm.sugarcrm.toModuleSymbol(m_name);
      secondary.appendChild(sec_el);
    }
    return 1;
  }, this);
};


/**
 * Maximun number of li.
 * @type {number}
 */
ydn.crm.sugarcrm.GDataContactPanel.MAX_LI = 50;


/**
 * Maximun number of li.
 * @type {number}
 */
ydn.crm.sugarcrm.GDataContactPanel.OVERSHOOT = 3;


/**
 * Render entry if last entry is showing and continue rendering recursively.
 * @private
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.renderNextEntryRecursive_ = function() {

  var ul = this.root.querySelector('.content UL');
  var id = undefined;
  if (ul.childElementCount > ydn.crm.sugarcrm.GDataContactPanel.OVERSHOOT) {
    var li = ul.children[ul.childElementCount - ydn.crm.sugarcrm.GDataContactPanel.OVERSHOOT - 1];
    if (!ydn.dom.isElementVisible(li)) {
      if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
        window.console.log(li.getAttribute('data-id'), ' not visible');
      }
      return goog.async.Deferred.fail(0);
    }
    id = ul.lastElementChild.getAttribute('data-key');
  }
  if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
    window.console.log('rendering next entry');
  }
  if (ul.childElementCount > ydn.crm.sugarcrm.GDataContactPanel.MAX_LI) {
    ul.removeChild(ul.firstElementChild);
  }
  var index = this.order_by;
  var query = {
    'index': index,
    'limit': 1,
    'reverse': this.reverse,
    'after': id
  };
  return ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT, query)
      .addCallback(function(arr) {
        if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
          window.console.log(arr[0]);
        }
        if (arr[0]) {
          var li = this.sync_pair_templ.cloneNode(true).querySelector('li');
          ul.appendChild(li);
          var entry = new ydn.gdata.m8.ContactEntry(arr[0]);
          var key;
          if (index == 'updated.$t') {
            key = ydn.db.utils.getValueByKeys(arr[0], index);
          } else if (index == 'name') {
            key = entry.getFullName();
          } else {
            key = entry.getId();
          }
          li.setAttribute('data-id', entry.getSingleId());
          li.setAttribute('data-index', index);
          li.setAttribute('data-key', key);
          return this.renderEntry_(li, entry).addCallback(function() {
            return this.renderNextEntryRecursive_().addBoth(function(cnt) {
              return cnt + 1;
            }, this);
          }, this);
        }
      }, this);
};


/**
 * @override
 * @return {!goog.async.Deferred}
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.refreshContent = function() {
  if (this.render_next_df_) {
    return this.render_next_df_;
  }
  this.render_next_df_ = this.renderNextEntryRecursive_().addBoth(function() {
    var me = this;
    setTimeout(function() {
      me.render_next_df_ = null;
    }, 100);
  }, this);
  return this.render_next_df_;
};


/**
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.resetContent_ = function() {
  var ul = this.root.querySelector('.content UL');
  ul.innerHTML = '';
  this.refreshContent();
};


