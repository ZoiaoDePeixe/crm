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
 * @fileoverview SugarCRM module page listing its records.
 *
 * Listing can be search, filter and sorted.
 *
 * @author kyawtun@yathit.com (Kyaw Tun)
 */


goog.provide('ydn.crm.su.ui.ModulePage');
goog.require('goog.ui.Button');
goog.require('goog.ui.CheckBoxMenuItem');
goog.require('goog.ui.Component');
goog.require('goog.ui.Css3ButtonRenderer');
goog.require('goog.ui.Css3MenuButtonRenderer');
goog.require('goog.ui.CustomButton');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.Toolbar');
goog.require('wgui.TextInput');
goog.require('ydn.crm.ui.events');



/**
 * SugarCRM module page listing its records.
 * @param {!ydn.crm.su.model.Sugar} sugar
 * @param {ydn.crm.su.ModuleName} name module name.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 */
ydn.crm.su.ui.ModulePage = function(sugar, name, opt_dom) {
  goog.base(this, opt_dom);
  /**
   * @final
   * @type {ydn.crm.su.ModuleName}
   * @protected
   */
  this.name = name;

  /**
   * @type {number}
   * @protected
   */
  this.offset = 0;

  /**
   * @type {goog.ui.Toolbar}
   * @private
   */
  this.toolbar_ = new goog.ui.Toolbar(null,
      goog.ui.Container.Orientation.HORIZONTAL, opt_dom);

  /**
   * @type {goog.ui.Menu}
   * @private
   */
  this.menu_filter_ = new goog.ui.Menu(opt_dom);
  
  /**
   * @type {goog.ui.Menu}
   * @private
   */
  this.menu_order_ = new goog.ui.Menu(opt_dom);

  this.setModel(sugar);
};
goog.inherits(ydn.crm.su.ui.ModulePage, goog.ui.Component);


/**
 * @return {ydn.crm.su.model.Sugar}
 * @override
 */
ydn.crm.su.ui.ModulePage.prototype.getModel;


/**
 * @const
 * @type {string}
 */
ydn.crm.su.ui.ModulePage.CSS_CLASS_LIST = 'module-page-list';


/**
 * @inheritDoc
 */
ydn.crm.su.ui.ModulePage.prototype.getContentElement = function() {
  return this.getElement().querySelector('.' + ydn.crm.ui.CSS_CLASS_CONTENT);
};


/**
 * Set of filter
 * @enum {string}
 */
ydn.crm.su.ui.ModulePage.Filter = {
  ALL: 'filter-all',
  MY: 'filter-my',
  FAVORITE: 'filter-fav'
};


/**
 * Set of sort order
 * @enum {string}
 */
ydn.crm.su.ui.ModulePage.Order = {
  ID: 'order-id',
  RECENT: 'order-rc',
  NAME: 'order-na'
};


/**
 * Get active filter.
 * @return {ydn.crm.su.ui.ModulePage.Filter} active filter.
 */
ydn.crm.su.ui.ModulePage.prototype.getFilter = function() {
  for (var i = 0, n = this.menu_filter_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_filter_.getChildAt(i));
    if (!(child instanceof goog.ui.Control) || !child.isChecked()) {
      continue;
    }
    var name = child.getModel() || '';
    if (name == ydn.crm.su.ui.ModulePage.Filter.ALL) {
      return ydn.crm.su.ui.ModulePage.Filter.ALL;
    } else if (name == ydn.crm.su.ui.ModulePage.Filter.MY) {
      return ydn.crm.su.ui.ModulePage.Filter.MY;
    } else if (name == ydn.crm.su.ui.ModulePage.Filter.FAVORITE) {
      return ydn.crm.su.ui.ModulePage.Filter.FAVORITE;
    }
  }
  return ydn.crm.su.ui.ModulePage.Filter.ALL;
};


/**
 * Set active filter.
 * @param {ydn.crm.su.ui.ModulePage.Filter} filter
 */
ydn.crm.su.ui.ModulePage.prototype.setFilter = function(filter) {
  for (var i = 0, n = this.menu_filter_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_filter_.getChildAt(i));
    if (!(child instanceof goog.ui.Control)) {
      continue;
    }
    var name = /** @type {string} */(child.getModel()) || '';
    if (goog.string.startsWith(name, 'filter-')) {
      child.setChecked(filter == name);
    }
  }
  this.updateSearchLabel_();
};


/**
 * Set sort order.
 * @param {ydn.crm.su.ui.ModulePage.Order} order
 */
ydn.crm.su.ui.ModulePage.prototype.setOrder = function(order) {
  for (var i = 0, n = this.menu_order_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_order_.getChildAt(i));
    if (!(child instanceof goog.ui.Control)) {
      continue;
    }
    var name = /** @type {string} */(child.getModel()) || '';
    if (goog.string.startsWith(name, 'order-')) {
      child.setChecked(order == name);
    }
  }
};


/**
 * Get active sort order.
 * @return {ydn.crm.su.ui.ModulePage.Order} active sort order.
 */
ydn.crm.su.ui.ModulePage.prototype.getSortOrder = function() {
  for (var i = 0, n = this.menu_order_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_order_.getChildAt(i));
    if (!(child instanceof goog.ui.Control) || !child.isChecked()) {
      continue;
    }
    var name = child.getModel() || '';
    if (name == ydn.crm.su.ui.ModulePage.Order.ID) {
      return ydn.crm.su.ui.ModulePage.Order.ID;
    } else if (name == ydn.crm.su.ui.ModulePage.Order.NAME) {
      return ydn.crm.su.ui.ModulePage.Order.NAME;
    } else if (name == ydn.crm.su.ui.ModulePage.Order.RECENT) {
      return ydn.crm.su.ui.ModulePage.Order.RECENT;
    }
  }
  return ydn.crm.su.ui.ModulePage.Order.ID;
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.ModulePage.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var root = this.getElement();
  var dom = this.getDomHelper();
  /**
   * @type {ydn.crm.su.model.Sugar}
   */
  var model = this.getModel();
  root.classList.add('module-page');
  root.classList.add(this.name);
  var head = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  var footer = dom.createDom('div', ydn.crm.ui.CSS_CLASS_FOOTER);
  root.appendChild(head);
  root.appendChild(content);
  root.appendChild(footer);

  var ul = dom.createDom('ul', ydn.crm.su.ui.ModulePage.CSS_CLASS_LIST);
  content.appendChild(ul);

  var symbol = ydn.crm.su.toModuleSymbol(this.name);

  var css_rdr = goog.ui.Css3ButtonRenderer.getInstance();
  var css_mbr = goog.ui.Css3MenuButtonRenderer.getInstance();
  var m_btn = new goog.ui.Button('New', css_rdr, dom);
  m_btn.setTooltip('Create a new record');
  this.toolbar_.addChild(m_btn, true);

  this.menu_filter_.addChild(new goog.ui.CheckBoxMenuItem('All records',
      ydn.crm.su.ui.ModulePage.Filter.ALL, dom), true);
  var my_item = new goog.ui.CheckBoxMenuItem('My records',
      ydn.crm.su.ui.ModulePage.Filter.MY, dom);
  my_item.setChecked(true);
  this.menu_filter_.addChild(my_item, true);
  this.menu_filter_.addChild(new goog.ui.CheckBoxMenuItem('Favorites',
      ydn.crm.su.ui.ModulePage.Filter.FAVORITE, dom), true);
  var filter = new goog.ui.MenuButton('Filter', this.menu_filter_, css_mbr, dom);
  this.toolbar_.addChild(filter, true);

  var r_item = new goog.ui.CheckBoxMenuItem('Recent',
      ydn.crm.su.ui.ModulePage.Order.RECENT, dom);
  r_item.setChecked(true);
  this.menu_order_.addChild(r_item, true);
  this.menu_order_.addChild(new goog.ui.CheckBoxMenuItem('Name',
      ydn.crm.su.ui.ModulePage.Order.NAME, dom), true);
  var sort = new goog.ui.MenuButton('Order', this.menu_order_, css_mbr, dom);
  this.toolbar_.addChild(sort, true);

  // var search = new wgui.TextInput('', null, dom);
  // this.toolbar_.addChild(search, true);

  this.toolbar_.render(head);

  // this.updateSearchLabel_();
};


/**
 * @return {wgui.TextInput}
 */
ydn.crm.su.ui.ModulePage.prototype.getSearchCtrl = function() {
  for (var i = 0, n = this.toolbar_.getChildCount(); i < n; i++) {
    var child = this.toolbar_.getChildAt(i);
    if (child instanceof wgui.TextInput) {
      return child;
    }
  }
  throw new Error('TextInput');
};


/**
 * @param {Array<SugarCrm.Record>} arr
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.addResult_ = function(arr) {

};


/**
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.refresh_ = function() {
  var offset = this.offset;
  var query = {
    'store': this.name,
    'limit': 25,
    'offset': offset
  };
  var req = this.getModel().send(ydn.crm.ch.SReq.QUERY, [query]);
  req.addCallback(function(arr) {
    var qs = /** @type {CrmApp.QueryResult} */(arr[0]);
    for (var i = 0; i < qs.result.length; i++) {
      qs.result[i]['_index'] = offset + i;
    }
    this.addResult_(qs.result);
  }, this);
};


/**
 * Update search input placeholder text.
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.updateSearchLabel_ = function() {
  var label = 'Search';
  var filter = this.getFilter();
  if (filter == ydn.crm.su.ui.ModulePage.Filter.ALL) {
    label += ' All';
  } else if (filter == ydn.crm.su.ui.ModulePage.Filter.MY) {
    label += ' My';
  } else if (filter == ydn.crm.su.ui.ModulePage.Filter.FAVORITE) {
    label += ' Favorite';
  }
  label += ' ' + this.name;
  var input = this.getSearchCtrl().getElement().querySelector('input');
  input.setAttribute('placeholder', label);
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.ModulePage.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var hd = this.getHandler();
  hd.listen(this.menu_filter_, goog.ui.Component.EventType.ACTION, 
      this.onFilterAction_);
  hd.listen(this.menu_order_, goog.ui.Component.EventType.ACTION,
      this.onOrderAction_);
};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onTileClick_ = function(ev) {

};


/**
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onFilterAction_ = function(ev) {
  if (ev.target instanceof goog.ui.CheckBoxMenuItem) {
    var item = /** @type {goog.ui.CheckBoxMenuItem} */(ev.target);
    var name = /** @type {string} */(item.getModel()) || '';
    if (name) {
      this.setFilter(/** @type {ydn.crm.su.ui.ModulePage.Filter} */(name));
    }
  }
};


/**
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onOrderAction_ = function(ev) {
  if (ev.target instanceof goog.ui.CheckBoxMenuItem) {
    var item = /** @type {goog.ui.CheckBoxMenuItem} */(ev.target);
    var name = /** @type {string} */(item.getModel()) || '';
    if (name) {
      this.setOrder(/** @type {ydn.crm.su.ui.ModulePage.Order} */(name));
    }
  }
};


/**
 * @const
 * @type {string}
 */
ydn.crm.su.ui.ModulePage.NAME = 'Module';


/**
 * @inheritDoc
 */
ydn.crm.su.ui.ModulePage.prototype.toString = function() {
  return ydn.crm.su.ui.ModulePage.NAME;
};