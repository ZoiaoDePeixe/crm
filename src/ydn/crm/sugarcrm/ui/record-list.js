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

  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this.df_load_forward_ = null;

  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this.df_load_back_ = null;
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
  var ul = this.getUlElement();
  hd.listen(ul, goog.events.EventType.WHEEL, this.onMouseWheel_);

  this.reset_();
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.onMouseWheel_ = function(ev) {
  // console.log(ev);
  var we = /** @type {WheelEvent} */(ev.getBrowserEvent());
  var ul = /** @type {Element} */(ev.currentTarget);
  if (we.deltaY > 0) {
    ul.scrollTop += we.deltaY;
    var remaining = ul.scrollHeight - (ul.offsetHeight + ul.scrollTop);
    if (remaining <= 0) {
      this.loadForward_();
    } else {
      ev.stopPropagation();
      ev.preventDefault();
      var rem_items = remaining / ydn.crm.su.ui.RecordList.CSS_ITEM_HEIGHT;
      if (rem_items < 5) {
        this.loadForward_(ul);
      }
    }
  } else if (we.deltaY < 0) {
    ul.scrollTop += we.deltaY;
    var rem_items = ul.scrollTop / ydn.crm.su.ui.RecordList.CSS_ITEM_HEIGHT;
    if (ul.scrollTop > 0) {
      ev.stopPropagation();
      ev.preventDefault();
    }
    if (rem_items <= 5) {
      this.loadBack_(ul);
    }
  }

};


/**
 * Fix item size as specified in CSS
 * .module-record-list > UL > LI
 * @type {number} LI height in pixel.
 */
ydn.crm.su.ui.RecordList.CSS_ITEM_HEIGHT = 34;


/**
 * Prepare list items are available while scrolling.
 * @param {Element=} ul the scroll element.
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.loadForward_ = function(ul) {

  if (this.df_load_forward_) {
    return;
  }
  var offset = 0;
  ul = ul || this.getUlElement();
  if (ul.lastElementChild) {
    offset = parseInt(ul.lastElementChild.getAttribute('data-offset'), 10);
  }
  if (ydn.crm.su.ui.RecordList.DEBUG) {
    console.log('loadForward from ' + offset);
  }
  this.df_load_forward_ = this.getProvider().list(15, offset);
  this.df_load_forward_.addCallbacks(function(arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i]['ydn$offset'] = 1 + i + offset;
    }
    if (ydn.crm.su.ui.RecordList.DEBUG) {
      console.log(arr.length + ' loaded');
    }
    this.addResults_(arr, true);
    this.df_load_forward_ = null;
  }, function(e) {
    window.console.error(e);
    this.df_load_forward_ = null;
  }, this);
};


/**
 * Prepare list items are available while scrolling.
 * @param {Element=} ul the scroll element.
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.loadBack_ = function(ul) {
  console.log('loadBack_');
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
 * @return {Element}
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.renderItem_ = function(rec) {
  var li = document.createElement('LI');
  var symbol = ydn.crm.su.toModuleSymbol(
      /** @type {ydn.crm.su.ModuleName} */(rec._module));
  li.innerHTML = ydn.crm.templ.renderRecordListItem(rec._module, symbol);
  li.querySelector('.title').textContent = ydn.crm.su.Record.getLabel(rec);
  li.querySelector('.summary').textContent = ydn.crm.su.Record.getSummary(rec);
  li.setAttribute('data-id', rec.id);
  li.setAttribute('data-offset', rec['ydn$offset']);
  return li;
};


/**
 * @param {Element} ul
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.fixHeight_ = function(ul) {
  ul = ul || this.getUlElement();
  if (!ul.style.height) {
    var h = ydn.crm.ui.getPopupContentHeight(2);
    if (h) {
      ul.style.height = h;
    }
  }
};


/**
 * Add result to UL.
 * @param {Array<SugarCrm.Record>} arr results.
 * @param {boolean} forward true.
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.addResults_ = function(arr, forward) {
  if (arr.length == 0) {
    return;
  }
  var ul = this.getUlElement();
  this.fixHeight_(ul);
  if (forward && ul.lastElementChild) {
    var prev_offset = ul.lastElementChild.getAttribute('data-offset');
    var offset = arr[0]['ydn$offset'];
    if (prev_offset != (offset - 1)) {
      ul.innerHTML = '';
    }
  }
  for (var i = 0; i < arr.length; i++) {
    var obj = arr[i];
    var li = this.renderItem_(obj);
    if (forward || ul.childElementCount == 0) {
      ul.appendChild(li);
    } else {
      ul.insertBefore(li, ul.firstElementChild);
    }
  }
};


/**
 * Ensure that full items are renderred in the current position.
 * @private
 */
ydn.crm.su.ui.RecordList.prototype.refreshList_ = function() {
  this.loadForward_();
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


/**
 * @param {ydn.crm.su.ModuleName} mn
 */
ydn.crm.su.ui.RecordList.prototype.setModule = function(mn) {
  this.getProvider().setModule(mn);
  this.reset_();
};


/**
 * @return {ydn.crm.su.ui.RecordListProvider}
 */
ydn.crm.su.ui.RecordList.prototype.getProvider = function() {
  return this.getModel();
};


/**
 * @param {string} index set name of index for order.
 * @param {boolean} rev in reverse direction.
 */
ydn.crm.su.ui.RecordList.prototype.setOrder = function(index, rev) {
  var changed = this.getProvider().setOrder(index, rev);
  if (changed) {
    this.position_ = 0;
    this.refreshList_();
  }
};


/**
 * @param {ydn.crm.su.RecordFilter} filter set name of filter.
 */
ydn.crm.su.ui.RecordList.prototype.setFilter = function(filter) {
  var changed = this.getProvider().setFilter(filter);
  if (changed) {
    this.position_ = 0;
    this.refreshList_();
  }
};
