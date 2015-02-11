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
 * @fileoverview Logging preference panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */

goog.provide('ydn.crm.ui.LoggingPrefPanel');



/**
 * Logging preference panel.
 * @constructor
 * @struct
 */
ydn.crm.ui.LoggingPrefPanel = function() {
  /**
   * @type {boolean}
   * @private
   */
  this.is_crm_admin_ = false;
  /**
   * @final
   * @type {Element}
   * @private
   */
  this.root_ = document.createElement('div');
};


/**
 * Render UI.
 * @param {Element} el
 */
ydn.crm.ui.LoggingPrefPanel.prototype.render = function(el) {
  var temp = ydn.ui.getTemplateById('logging-pref-template').content;
  this.root_.appendChild(temp.cloneNode(true));
  el.appendChild(this.root_);
  var qa_el = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.ANALYTIC);
  var db_el = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.DEBUG);
  qa_el.onclick = this.onQaClick_.bind(this);
  db_el.onclick = this.onDebugClick_.bind(this);

  var detail = this.root_.querySelector('details');
  detail.addEventListener('click', this.onDetailsClick_.bind(this), false);
};


/**
 * @param {Event} ev
 * @private
 */
ydn.crm.ui.LoggingPrefPanel.prototype.onDetailsClick_ = function(ev) {
  var is_open = !ev.currentTarget.hasAttribute('open');
  if (is_open) {
    this.refresh();
  }
};


/**
 * @enum {string} match with HTML element name in template file.
 */
ydn.crm.ui.LoggingPrefPanel.LName = {
  ANALYTIC: 'analytic',
  DEBUG: 'debug'
};


/**
 * @param {ydn.crm.ui.LoggingPrefPanel.LName} name
 * @return {HTMLInputElement}
 * @private
 */
ydn.crm.ui.LoggingPrefPanel.prototype.getInputElement_ = function(name) {
  var input = this.root_.querySelector('input[name=' + name + ']');
  return /** @type {HTMLInputElement} */(input);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.ui.LoggingPrefPanel.prototype.onQaClick_ = function(e) {
  var input = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.ANALYTIC);
  var val = input.checked;
  ydn.msg.getChannel().send(ydn.crm.ch.Req.LOGGING_PREF_ANALYTIC, val);
};


/**
 * @param {Event} e
 * @private
 */
ydn.crm.ui.LoggingPrefPanel.prototype.onDebugClick_ = function(e) {
  var input = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.DEBUG);
  var val = input.checked;
  ydn.msg.getChannel().send(ydn.crm.ch.Req.LOGGING_PREF_DEBUG, val);
};


/**
 * Render UI with data.
 * @param {boolean} qa enable analytic log.
 * @param {boolean} db enable debug log.
 * @private
 */
ydn.crm.ui.LoggingPrefPanel.prototype.renderPref_ = function(qa, db) {
  var qa_el = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.ANALYTIC);
  qa_el.checked = !!qa;
  var db_el = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.DEBUG);
  db_el.checked = !!db;
};


/**
 * Render license.
 * @param {YdnCrm.UserLicense} lic
 * @return {boolean} `true` if setting can be changed.
 * @private
 */
ydn.crm.ui.LoggingPrefPanel.prototype.renderLicense_ = function(lic) {
  var can = ydn.crm.shared.isPaidLicense(lic);
  var qa_el = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.ANALYTIC);
  var db_el = this.getInputElement_(ydn.crm.ui.LoggingPrefPanel.LName.DEBUG);
  var msg_el = this.root_.querySelector('.license.message');
  if (can) {
    qa_el.removeAttribute('disabled');
    db_el.removeAttribute('disabled');
    goog.style.setElementShown(msg_el, false);
  } else {
    qa_el.setAttribute('disabled', 'disabled');
    db_el.setAttribute('disabled', 'disabled');
    goog.style.setElementShown(msg_el, true);
  }
  return can;
};


/**
 * @protected
 */
ydn.crm.ui.LoggingPrefPanel.prototype.refresh = function() {
  ydn.msg.getChannel().send(ydn.crm.ch.Req.USER_LICENSE).addCallback(function(lic) {
    var can = this.renderLicense_(lic);
    if (can) {
      chrome.storage.sync.get([ydn.crm.base.ChromeSyncKey.LOGGING_ANALYTICS,
        ydn.crm.base.ChromeSyncKey.LOGGING_DEBUG], function(obj) {
        var qa = obj[ydn.crm.base.ChromeSyncKey.LOGGING_ANALYTICS];
        var db = obj[ydn.crm.base.ChromeSyncKey.LOGGING_DEBUG];
        // normally true.
        qa = goog.isBoolean(qa) ? qa : true;
        db = goog.isBoolean(db) ? db : true;
        me.renderPref_(qa, db);
      });
    } else {
      this.renderPref_(true, true);
    }
  }, this);
  var me = this;

};
