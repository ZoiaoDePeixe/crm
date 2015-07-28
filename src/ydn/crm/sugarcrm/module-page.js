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
goog.require('ydn.crm.su.ui.RecordList');
goog.require('ydn.crm.su.ui.RecordListProvider');



/**
 * SugarCRM module page listing its records.
 * @param {ydn.crm.su.ui.RecordListProvider} model
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @implements {ydn.crm.ui.IDesktopPage}
 */
ydn.crm.su.ui.ModulePage = function(model, opt_dom) {
  goog.base(this, opt_dom);

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

  this.record_list_ = new ydn.crm.su.ui.RecordList(model, opt_dom);

};
goog.inherits(ydn.crm.su.ui.ModulePage, goog.ui.Component);


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
  RECENT: 'order-date_modified',
  NAME: 'order-name'
};


/**
 * Change target module.
 * @param {ydn.crm.su.ModuleName} mn target module.
 */
ydn.crm.su.ui.ModulePage.prototype.setModule = function(mn) {
  this.record_list_.setModule(mn);
};


/**
 * Get target module.
 * @return {ydn.crm.su.ModuleName} target module.
 */
ydn.crm.su.ui.ModulePage.prototype.getModule = function() {
  return this.record_list_.getModel().getModuleName();
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
 * Select active filter.
 * @param {ydn.crm.su.ui.ModulePage.Filter} filter
 * @return {boolean} return true if active filter has changed.
 */
ydn.crm.su.ui.ModulePage.prototype.selectFilter = function(filter) {
  var updated = false;
  for (var i = 0, n = this.menu_filter_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_filter_.getChildAt(i));
    if (!(child instanceof goog.ui.Control)) {
      continue;
    }
    var name = /** @type {string} */(child.getModel()) || '';
    if (name == filter) {
      updated = !child.isChecked();
    }
    if (goog.string.startsWith(name, 'filter-')) {
      child.setChecked(filter == name);
    }
  }
  return updated;
};


/**
 * Set sort order.
 * @param {ydn.crm.su.ui.ModulePage.Order} order
 * @return {string} return a new order, empty string if not changed.
 */
ydn.crm.su.ui.ModulePage.prototype.selectOrder = function(order) {
  var updated = false;
  for (var i = 0, n = this.menu_order_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_order_.getChildAt(i));
    if (!(child instanceof goog.ui.Control)) {
      continue;
    }
    var name = /** @type {string} */(child.getModel()) || '';
    if (name == order) {
      updated = child.isChecked();
    }
    if (goog.string.startsWith(name, 'order-')) {
      child.setChecked(order == name);
    }
  }
  if (updated) {
    return order.substr('order-'.length);
  }
  return '';
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

  var mn = this.getModule();
  root.classList.add('module-page');
  root.classList.add(mn);
  var head = dom.createDom('div', ydn.crm.ui.CSS_CLASS_HEAD);
  var content = dom.createDom('div', ydn.crm.ui.CSS_CLASS_CONTENT);
  var footer = dom.createDom('div', ydn.crm.ui.CSS_CLASS_FOOTER);
  root.appendChild(head);
  root.appendChild(content);
  root.appendChild(footer);

  var ul = dom.createDom('ul', ydn.crm.su.ui.ModulePage.CSS_CLASS_LIST);
  content.appendChild(ul);

  var symbol = ydn.crm.su.toModuleSymbol(mn);

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

  this.addChild(this.record_list_, true);

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
 * Update search input placeholder text.
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.updateSearchLabelOld_ = function() {
  var label = 'Search';
  var filter = this.getFilter();
  if (filter == ydn.crm.su.ui.ModulePage.Filter.ALL) {
    label += ' All';
  } else if (filter == ydn.crm.su.ui.ModulePage.Filter.MY) {
    label += ' My';
  } else if (filter == ydn.crm.su.ui.ModulePage.Filter.FAVORITE) {
    label += ' Favorite';
  }
  label += ' ' + this.getModule();
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
      this.selectFilter(/** @type {ydn.crm.su.ui.ModulePage.Filter} */(name));
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
    var name = /** @type {ydn.crm.su.ui.ModulePage.Order} */(item.getModel() ||
        '');
    if (name) {
      var index = this.selectOrder(name);
      if (index) {
        var rev = index == 'date_modified';
        this.record_list_.setOrder(index, rev);
      }
    }
  }
};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.ModulePage.prototype.toString = function() {
  return ydn.crm.ui.PageName.MODULE_HOME;
};


/**
 * @override
 */
ydn.crm.su.ui.ModulePage.prototype.onPageShow = function(obj) {
  console.log(obj);

  this.setModule(obj['module']);
};
