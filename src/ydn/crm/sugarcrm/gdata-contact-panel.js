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
goog.require('goog.style');
goog.require('ydn.crm.sugarcrm.model.Sugar');
goog.require('ydn.dom');
goog.require('ydn.gdata.Kind');
goog.require('ydn.gdata.m8.ContactEntry');
goog.require('ydn.ui');



/**
 * Synchronization panel.
 * @param {ydn.crm.sugarcrm.model.Sugar} m
 * @constructor
 * @struct
 */
ydn.crm.sugarcrm.GDataContactPanel = function(m) {
  /**
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
  goog.style.setElementShown(this.root_, false);

  /**
   * @type {ydn.crm.sugarcrm.model.Sugar}
   * @private
   */
  this.model_ = m;
  this.offset_ = 0;
  this.limit_ = 50;
  this.order_by_ = 'updated.$t';
  this.reverse_ = true;

  this.sync_pair_templ = ydn.ui.getTemplateById('sync-pair-template').content;
  this.gdata_templ = ydn.ui.getTemplateById('sync-gdata-entry-template').content;
};


/**
 * @define {boolean} debug flag
 */
ydn.crm.sugarcrm.GDataContactPanel.DEBUG = true;


/**
 * Render UI.
 * @param {Element} el
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.render = function(el) {
  this.root_.classList.add('gdata-sync-panel');
  var temp = ydn.ui.getTemplateById('gdata-sync-panel-template').content;
  this.root_.appendChild(temp.cloneNode(true));
  el.appendChild(this.root_);
};


/**
 * @param {boolean} val
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.setVisible = function(val) {
  goog.style.setElementShown(this.root_, val);
  if (val) {
    this.refresh_();
  }
};


/**
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.refreshFooter_ = function() {
  var query = {
    'kind': ydn.gdata.Kind.M8_CONTACT
  };
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_COUNT, query)
      .addCallback(function(cnt) {
        var el = this.root_.querySelector('.footer span[name=gdata-contact-count]');
        el.textContent = String(cnt);
      }, this);
};


/**
 * Score range fro 0 to 1. 1 being surely match.
 * @typedef {{
 *   score: number,
 *   record: SugarCrm.Record
 * }}
 */
ydn.crm.sugarcrm.GDataContactPanel.SimilarityResult;


/**
 * @param {Array<ydn.crm.sugarcrm.GDataContactPanel.SimilarityResult>} arr sorted
 * array by score.
 * @param {SugarCrm.ContactSimilarityResult} res result to put into arr.
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.enrichFor_ = function(arr, res) {
  for (var i = 0; i < res.result.length; i++) {
    var record = res.result[i];
    var ex_idx = -1;
    for (var k = 0; k < arr.length; k++) {
      if (arr[k].record.id == record.id) {
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
      var obj = {
        score: score,
        record: record
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
 * @param {Array<SugarCrm.ContactSimilarityResult>} results
 * @return {Object<Array<ydn.crm.sugarcrm.GDataContactPanel.SimilarityResult>>}
 * Results for for each module. Results are order by score with higher score
 * comes first.
 */
ydn.crm.sugarcrm.GDataContactPanel.enrich = function(results) {
  var out = {};
  out[ydn.crm.sugarcrm.ModuleName.ACCOUNTS] = [];
  out[ydn.crm.sugarcrm.ModuleName.CONTACTS] = [];
  out[ydn.crm.sugarcrm.ModuleName.LEADS] = [];
  for (var i = 0; i < results.length; i++) {
    var res = results[i];
    var arr = out[res.module];
    if (!arr) {
      window.console.warn('Invalid result of module: ' + res.module);
      continue;
    }
    ydn.crm.sugarcrm.GDataContactPanel.enrichFor_(arr, res);
  }
  return out;
};


/**
 * @param {Element} el
 * @param {ydn.gdata.m8.ContactEntry} entry
 * @return {!goog.async.Deferred}
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.renderEntry_ = function(el, entry) {
  var primary = el.querySelector('.primary');
  var secondary = el.querySelector('.secondary');

  primary.appendChild(this.gdata_templ.cloneNode(true));
  var name = primary.querySelector('span[name=name]');
  name.textContent = entry.getFullName();
  var email = primary.querySelector('span[name=emails]');
  email.textContent = entry.getEmails().join(', ');

  var ch = this.model_.getChannel();
  var ce = entry.getData();
  return ch.send(ydn.crm.Ch.SReq.QUERY_SIMILAR, ce).addCallback(function(results) {
    if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
      window.console.log(JSON.stringify(results, null, 2));
    }
    var ip_btn = primary.querySelector('button[name=import]');
    if (results.length > 0) {
      for (var i = 0; i < results.length; i++) {
        var res = results[i];
        if (res['index'] == 'ydn$emails') {
          // consider exact match, and not allow to create a new record,
          // but instead must sync with it.
          ip_btn.setAttribute('disabled', 'disabled');
        }
      }
    }
  }, this);
};


/**
 * Maximun number of li.
 * @type {number}
 */
ydn.crm.sugarcrm.GDataContactPanel.MAX_LI = 50;


/**
 * Render entry if last entry is showing and continue rendering recursively.
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.renderNextEntryRecursive_ = function() {
  var ul = this.root_.querySelector('.content UL');
  var id = undefined;
  if (ul.lastElementChild) {
    if (!ydn.dom.isElementVisible(ul.lastElementChild)) {
      return;
    }
    id = ul.lastElementChild.getAttribute('data-key');
  }
  if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
    window.console.log('rendering next entry');
  }
  if (ul.childElementCount > ydn.crm.sugarcrm.GDataContactPanel.MAX_LI) {
    window.console.warn('To many entries');
    return;
  }
  var index = 'updated.$t';
  var query = {
    'index': index,
    'limit': 1,
    'reverse': true,
    'after': id
  };
  ydn.msg.getChannel().send(ydn.crm.Ch.Req.GDATA_LIST_CONTACT, query)
      .addCallback(function(arr) {
        if (ydn.crm.sugarcrm.GDataContactPanel.DEBUG) {
          window.console.log(arr[0]);
        }
        if (arr[0]) {
          var li = this.sync_pair_templ.cloneNode(true).querySelector('li');
          ul.appendChild(li);
          var entry = new ydn.gdata.m8.ContactEntry(arr[0]);
          li.setAttribute('data-id', entry.getSingleId());
          li.setAttribute('data-index', index);
          li.setAttribute('data-key', ydn.db.utils.getValueByKeys(arr[0], index));
          this.renderEntry_(li, entry).addCallback(function() {
            this.renderNextEntryRecursive_();
          }, this);
        }
      }, this);
};


/**
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.refreshContent_ = function() {
  this.renderNextEntryRecursive_();
};


/**
 * @private
 */
ydn.crm.sugarcrm.GDataContactPanel.prototype.refresh_ = function() {
  this.refreshFooter_();
  this.refreshContent_();
};
