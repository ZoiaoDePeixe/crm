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
 * @fileoverview Record snippet shows a brief description of the record.
 *
 * Upon hovering over the pane, an editable record panel appear on the side
 * of snippet panel.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.su.ui.RecordList');
goog.require('goog.ui.Component');
goog.require('ydn.crm.msg.Manager');
goog.require('ydn.crm.su');
goog.require('ydn.crm.su.ui.RecordListProvider');
goog.require('ydn.crm.templ');



/**
 * Record snippet shows a brief description of the record.
 * @param {ydn.crm.su.ui.RecordListProvider} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.su.ui.RecordList = function(model, opt_dom) {
  goog.base(this, opt_dom);
  this.setModel(model);

  /**
   * Current cursor position.
   * @type {number}
   * @private
   */
  this.position_ = 0.0;
};
goog.inherits(ydn.crm.su.ui.RecordList, goog.ui.Component);


/**
 * @protected
 * @type {goog.log.Logger}
 */
ydn.crm.su.ui.RecordList.prototype.logger =
    goog.log.getLogger('ydn.crm.su.ui.RecordList');


/**
 * @define {boolean} debug flag.
 */
ydn.crm.su.ui.RecordList.DEBUG = false;


/**
 * @return {ydn.crm.su.ui.RecordListProvider}
 * @override
 */
ydn.crm.su.ui.RecordList.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.su.ui.RecordList.CSS_CLASS = 'module-record-list';


/**
 * @return {string}
 */
ydn.crm.su.ui.RecordList.prototype.getCssClass = function() {
  return ydn.crm.su.ui.RecordList.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.RecordList.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  root.classList.add(this.getCssClass());
  var dom = this.getDomHelper();
  root.appendChild(dom.createDom('ul'));

  var footer = dom.createDom('div', ydn.crm.ui.CSS_CLASS_FOOTER);
  root.appendChild(footer);
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.RecordList.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  /**
   * @type {ydn.crm.su.ui.RecordListProvider}
   */
  var model = this.getModel();

  hd.listen(model, ydn.crm.su.events.EventType.READY, this.refresh_);
  this.reset_();
};


/**
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.reset_ = function() {
  /**
   * @type {ydn.crm.su.ui.RecordListProvider}
   */
  var model = this.getModel();
  this.getUlElement().innerHTML = '';

  var footer = this.getElement().querySelector(
      '.' + ydn.crm.ui.CSS_CLASS_FOOTER);
  footer.innerHTML = '';
  model.onReady().addCallback(function() {
    this.refresh_();
  }, this);
};


/**
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.refresh_ = function() {
  /**
   * @type {ydn.crm.su.ui.RecordListProvider}
   */
  var model = this.getModel();
  this.getUlElement().innerHTML = '';

  var footer = this.getElement().querySelector(
      '.' + ydn.crm.ui.CSS_CLASS_FOOTER);
  var total = model.getTotal();
  var count = model.countRecords();
  if (count < total) {
    footer.textContent = count + ' of ' + total + ' ' + model.getModuleName() +
        ' cached.';
  } else {
    footer.textContent = total + ' ' + model.getModuleName();
  }
  this.refreshList_();
};


/**
 * Render item.
 * @param {SugarCrm.Record} rec
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.renderItem_ = function(rec) {
  var li = document.createElement('LI');
  /**
   * @type {ydn.crm.su.ui.RecordListProvider}
   */
  var model = this.getModel();
  var symbol = ydn.crm.su.toModuleSymbol(
      /** @type {ydn.crm.su.ModuleName} */(rec._module));
  li.innerHTML = ydn.crm.templ.renderRecordListItem(rec._module, symbol,
      ydn.crm.su.Record.getLabel(rec), ydn.crm.su.Record.getSummary(rec));
  var ul = this.getUlElement();
  ul.appendChild(li);
};


/**
 * Add result to UL.
 * @param {Array<SugarCrm.Record>} arr results.
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.addResults_ = function(arr) {
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    this.renderItem_(obj);
  }
};


/**
 * Ensure that full items are renderred in the current position.
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.refreshList_ = function() {
  /**
   * @type {ydn.crm.su.ui.RecordListProvider}
   */
  var model = this.getModel();
  model.list(10, 0).addCallbacks(function(arr) {
    this.addResults_(arr);
  }, function(e) {
    window.console.error(e);
  }, this);
};


/**
 * @param {ydn.crm.su.model.events.SearchResetEvent} e
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.onReset_ = function(e) {
  this.reset_();
};


/**
 * @return {Element}
 * @protected
 */
ydn.crm.su.ui.RecordList.prototype.getUlElement = function() {
  return this.getContentElement().querySelector('ul');
};



