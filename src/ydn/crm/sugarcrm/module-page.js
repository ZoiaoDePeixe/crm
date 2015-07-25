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
   * @type {goog.ui.Toolbar}
   * @private
   */
  this.toolbar_ = new goog.ui.Toolbar(null,
      goog.ui.Container.Orientation.HORIZONTAL, opt_dom);
  this.menu_ = new goog.ui.Menu(opt_dom);
  this.setModel(sugar);
};
goog.inherits(ydn.crm.su.ui.ModulePage, goog.ui.Component);


/**
 * @return {ydn.crm.su.model.Sugar}
 * @override
 */
ydn.crm.su.ui.ModulePage.prototype.getModel;


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
  FAVORITE: 'filter-fav',
  CACHE: 'filter-cache'
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
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.buildMenu_ = function() {
  var dom = this.getDomHelper();
  var s_menu = this.menu_;
  s_menu.addChild(new goog.ui.CheckBoxMenuItem('All records',
      ydn.crm.su.ui.ModulePage.Filter.ALL, dom), true);
  var my_item = new goog.ui.CheckBoxMenuItem('My records',
      ydn.crm.su.ui.ModulePage.Filter.MY, dom);
  my_item.setChecked(true);
  s_menu.addChild(my_item, true);
  s_menu.addChild(new goog.ui.CheckBoxMenuItem('Favorites',
      ydn.crm.su.ui.ModulePage.Filter.FAVORITE, dom), true);
  s_menu.addChild(new goog.ui.CheckBoxMenuItem('Cache',
      ydn.crm.su.ui.ModulePage.Filter.CACHE, dom), true);
  s_menu.addChild(new goog.ui.MenuSeparator(dom), true);

  s_menu.addChild(new goog.ui.CheckBoxMenuItem('Id',
      ydn.crm.su.ui.ModulePage.Order.ID, dom), true);
  var r_item = new goog.ui.CheckBoxMenuItem('Recent',
      ydn.crm.su.ui.ModulePage.Order.RECENT, dom);
  r_item.setChecked(true);
  s_menu.addChild(r_item, true);
  s_menu.addChild(new goog.ui.CheckBoxMenuItem('Name',
      ydn.crm.su.ui.ModulePage.Order.NAME, dom), true);
};


/**
 * Get active filter.
 * @return {ydn.crm.su.ui.ModulePage.Filter} active filter.
 */
ydn.crm.su.ui.ModulePage.prototype.getFilter = function() {
  for (var i = 0, n = this.menu_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_.getChildAt(i));
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
    } else if (name == ydn.crm.su.ui.ModulePage.Filter.CACHE) {
      return ydn.crm.su.ui.ModulePage.Filter.CACHE;
    }
  }
  return ydn.crm.su.ui.ModulePage.Filter.ALL;
};


/**
 * Set active filter.
 * @param {ydn.crm.su.ui.ModulePage.Filter} filter
 */
ydn.crm.su.ui.ModulePage.prototype.setFilter = function(filter) {
  for (var i = 0, n = this.menu_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_.getChildAt(i));
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
  for (var i = 0, n = this.menu_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_.getChildAt(i));
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
  for (var i = 0, n = this.menu_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_.getChildAt(i));
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

  var symbol = ydn.crm.su.toModuleSymbol(this.name);

  var css_rdr = goog.ui.Css3ButtonRenderer.getInstance();
  var css_mbr = goog.ui.Css3MenuButtonRenderer.getInstance();
  var m_btn = new goog.ui.Button('New', css_rdr, dom);
  m_btn.setTooltip('Create a new record');
  this.toolbar_.addChild(m_btn, true);

  /*
  var f_menu = new goog.ui.Menu(dom);
  f_menu.addChild(new goog.ui.CheckBoxMenuItem('All records', 'all', dom), true);
  var my_item = new goog.ui.CheckBoxMenuItem('My records', 'my', dom);
  my_item.setChecked(true);
  f_menu.addChild(my_item, true);
  f_menu.addChild(new goog.ui.CheckBoxMenuItem('Favorites', 'favorites', dom), true);
  f_menu.addChild(new goog.ui.CheckBoxMenuItem('Cache', 'cache', dom), true);
  var filter = new goog.ui.MenuButton('Filter', f_menu, css_mbr, dom);
  this.toolbar_.addChild(filter, true);
  */

  var search = new wgui.TextInput('', null, dom);
  this.toolbar_.addChild(search, true);

  var svg = ydn.crm.ui.createSvgIcon('search');
  var search_btn = new goog.ui.CustomButton(svg, null, dom);
  var combo_el = document.createElement('span');
  combo_el.classList.add('search-button');
  this.toolbar_.getContentElement().appendChild(combo_el);
  // this.toolbar_.addChild(search_btn, true);
  this.toolbar_.addChild(search_btn, false);
  search_btn.render(combo_el);
  search_btn.addClassName('goog-custom-button-collapse-right');
  this.buildMenu_();
  var sort = new goog.ui.MenuButton(null, this.menu_, null, dom);
  sort.setPositionElement(search_btn.getElement());
  sort.addClassName('goog-menu-button-collapse-left');
  this.toolbar_.addChild(sort, false);
  sort.render(combo_el);
  sort.setTooltip('Modify filter and sort order');
  this.toolbar_.render(head);

  this.updateSearchLabel_();
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
};


ydn.crm.su.ui.ModulePage.prototype.refresh_ = function() {
  this.getModel().send(ydn.crm.ch.SReq.ABOUT, data);
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
  } else if (filter == ydn.crm.su.ui.ModulePage.Filter.CACHE) {
    label += ' Offline';
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
  hd.listen(this.menu_, goog.ui.Component.EventType.ACTION, this.onMenuAction_);
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
ydn.crm.su.ui.ModulePage.prototype.onMenuAction_ = function(ev) {
  if (ev.target instanceof goog.ui.CheckBoxMenuItem) {
    var item = /** @type {goog.ui.CheckBoxMenuItem} */(ev.target);
    var name = /** @type {string} */(item.getModel()) || '';
    if (goog.string.startsWith(name, 'filter-')) {
      this.setFilter(/** @type {ydn.crm.su.ui.ModulePage.Filter} */(name));
    } else if (goog.string.startsWith(name, 'order-')) {
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
