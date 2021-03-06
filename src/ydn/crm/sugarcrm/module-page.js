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
goog.require('goog.ui.ToggleButton');
goog.require('goog.ui.Toolbar');
goog.require('wgui.TextInput');
goog.require('ydn.crm.su.model.Search');
goog.require('ydn.crm.su.ui.HoverRecordList');
goog.require('ydn.crm.su.ui.HoverResultList');
goog.require('ydn.crm.su.ui.RecordListProvider');
goog.require('ydn.crm.ui.events');



/**
 * SugarCRM module page listing its records.
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @implements {ydn.crm.ui.IDesktopPage}
 */
ydn.crm.su.ui.ModulePage = function(opt_dom) {
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

  /**
   * @type {ydn.crm.su.ui.RecordList}
   * @private
   */
  this.browse_panel_ = null;
  /**
   * @type {ydn.crm.su.ui.HoverResultList}
   * @private
   */
  this.search_panel_ = null;

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
 * Change target module.
 * @param {ydn.crm.su.ModuleName} mn target module.
 * @param {ydn.crm.su.RecordFilter=} opt_filter set name of filter.
 */
ydn.crm.su.ui.ModulePage.prototype.setModule = function(mn, opt_filter) {
  if (opt_filter) {
    this.selectFilter(opt_filter);
  }
  this.browse_panel_.setModule(mn, opt_filter);
  var search = this.search_panel_.getModel();
  search.setTargetModule(mn);
};


/**
 * Get target module.
 * @return {ydn.crm.su.ModuleName} target module.
 */
ydn.crm.su.ui.ModulePage.prototype.getModule = function() {
  return this.browse_panel_ ? this.browse_panel_.getModel().getModuleName() :
      ydn.crm.su.DEFAULT_MODULE;
};


/**
 * Get active filter.
 * @return {ydn.crm.su.RecordFilter} active filter.
 */
ydn.crm.su.ui.ModulePage.prototype.getFilter = function() {
  for (var i = 0, n = this.menu_filter_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_filter_.getChildAt(i));
    if (!(child instanceof goog.ui.Control) || !child.isChecked()) {
      continue;
    }
    var name = child.getModel() || '';
    var idx = ydn.crm.su.recordFilters.indexOf(name);
    if (idx >= 0) {
      return ydn.crm.su.recordFilters[idx];
    }
  }
  return ydn.crm.su.RecordFilter.ALL;
};


/**
 * @return {goog.ui.Button}
 */
ydn.crm.su.ui.ModulePage.prototype.getOrderButton = function() {
  for (var i = 0, n = this.toolbar_.getChildCount(); i < n; i++) {
    var child = this.toolbar_.getChildAt(i);
    if (child.getId() == 'order-button') {
      return /** @type {goog.ui.Button} */(child);
    }
  }
  return null;
};


/**
 * @return {goog.ui.Button}
 */
ydn.crm.su.ui.ModulePage.prototype.getFilterButton = function() {
  for (var i = 0, n = this.toolbar_.getChildCount(); i < n; i++) {
    var child = this.toolbar_.getChildAt(i);
    if (child.getId() == 'filter-button') {
      return /** @type {goog.ui.Button} */(child);
    }
  }
  return null;
};


/**
 * @param {ydn.crm.su.model.Sugar} sugar
 */
ydn.crm.su.ui.ModulePage.prototype.setSugar = function(sugar) {
  var ch1 = this.getChildAt(0);
  if (ch1) {
    this.removeChild(ch1, true);
    ch1.dispose();
  }
  var ch2 = this.getChildAt(1);
  if (ch2) {
    var model = ch2.getModel();
    model.dispose();
    this.removeChild(ch2, true);
    ch2.dispose();
  }
  if (!sugar) {
    return;
  }
  var p = new ydn.crm.su.ui.RecordListProvider(sugar);
  this.browse_panel_ = new ydn.crm.su.ui.HoverRecordList(p, this.getDomHelper());
  var search = new ydn.crm.su.model.Search(sugar);
  search.setTargetModule(this.getModule());
  this.search_panel_ = new ydn.crm.su.ui.HoverResultList(search);
  this.addChild(this.browse_panel_, true);
  this.addChild(this.search_panel_, true);
  this.search_panel_.setVisible(false);
};


/**
 * @param {ydn.crm.su.RecordFilter} filter
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.updateOrderOnFilter_ = function(filter) {
  var is_all = filter == ydn.crm.su.RecordFilter.ALL;
  var btn = this.getOrderButton();
  btn.setVisible(is_all);
};


/**
 * @param {ydn.crm.su.ModuleName} mn
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.updateFilterOnModule_ = function(mn) {
  for (var i = 0, n = this.menu_filter_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_filter_.getChildAt(i));
    if (!(child instanceof goog.ui.Control)) {
      continue;
    }
    var name = /** @type {string} */(child.getModel()) || '';
    if (name == ydn.crm.su.RecordFilter.UPCOMING) {
      var act = ydn.crm.su.ACTIVITY_MODULES.indexOf(mn) >= 0;
      child.setVisible(act);
    }
  }
};


/**
 * Select active filter.
 * @param {ydn.crm.su.RecordFilter} filter
 * @return {boolean} return true if active filter has changed.
 * @protected
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
      updated = child.isChecked();
    }
    if (goog.string.startsWith(name, 'filter-')) {
      child.setChecked(filter == name);
    }
  }
  // Note: we still need to update order button, even if not `updated` on the
  // first time.
  this.updateOrderOnFilter_(filter);
  return updated;
};


/**
 * Set sort order.
 * @param {ydn.crm.su.RecordOrder} order
 * @return {boolean} return true if active order has changed.
 * @protected
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
  return updated;
};


/**
 * Get active sort order.
 * @return {ydn.crm.su.RecordOrder} active sort order.
 */
ydn.crm.su.ui.ModulePage.prototype.getSortOrder = function() {
  for (var i = 0, n = this.menu_order_.getChildCount(); i < n; i++) {
    var child = /** @type {goog.ui.Control} */(this.menu_order_.getChildAt(i));
    if (!(child instanceof goog.ui.Control) || !child.isChecked()) {
      continue;
    }
    var name = child.getModel() || '';
    if (name == ydn.crm.su.RecordOrder.ID) {
      return ydn.crm.su.RecordOrder.ID;
    } else if (name == ydn.crm.su.RecordOrder.NAME) {
      return ydn.crm.su.RecordOrder.NAME;
    } else if (name == ydn.crm.su.RecordOrder.RECENT) {
      return ydn.crm.su.RecordOrder.RECENT;
    }
  }
  return ydn.crm.su.RecordOrder.ID;
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

  var all_item = new goog.ui.CheckBoxMenuItem('All records',
      ydn.crm.su.RecordFilter.ALL, dom);
  all_item.setChecked(true);
  this.menu_filter_.addChild(all_item, true);
  var my_item = new goog.ui.CheckBoxMenuItem('My records',
      ydn.crm.su.RecordFilter.MY, dom);
  this.menu_filter_.addChild(my_item, true);
  this.menu_filter_.addChild(new goog.ui.CheckBoxMenuItem('Favorites',
      ydn.crm.su.RecordFilter.FAVORITE, dom), true);
  this.menu_filter_.addChild(new goog.ui.CheckBoxMenuItem('Upcoming',
      ydn.crm.su.RecordFilter.UPCOMING, dom), true);
  var filter = new goog.ui.MenuButton('Filter', this.menu_filter_, css_mbr, dom);
  filter.setId('filter-button');
  this.toolbar_.addChild(filter, true);

  var r_item = new goog.ui.CheckBoxMenuItem('Recent',
      ydn.crm.su.RecordOrder.RECENT, dom);
  r_item.setChecked(true);
  this.menu_order_.addChild(r_item, true);
  this.menu_order_.addChild(new goog.ui.CheckBoxMenuItem('Name',
      ydn.crm.su.RecordOrder.NAME, dom), true);
  var sort = new goog.ui.MenuButton('Order', this.menu_order_, css_mbr, dom);
  sort.setId('order-button');
  this.toolbar_.addChild(sort, true);

  var search = new wgui.TextInput('', null, dom);
  this.toolbar_.addChild(search, true);
  search.setVisible(false);
  var search_svg = ydn.crm.ui.createSvgIcon('search');
  var tgl_search = new goog.ui.ToggleButton(search_svg, css_rdr, dom);
  this.toolbar_.addChild(tgl_search, true);


  this.toolbar_.render(head);

  // this.addChild(this.browse_panel_, true);
  this.updateFilterOnModule_(ydn.crm.su.ModuleName.CONTACTS);

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
 * @return {goog.ui.ToggleButton}
 */
ydn.crm.su.ui.ModulePage.prototype.getSearchToggle = function() {
  for (var i = 0, n = this.toolbar_.getChildCount(); i < n; i++) {
    var child = this.toolbar_.getChildAt(i);
    if (child instanceof goog.ui.ToggleButton) {
      return child;
    }
  }
  return null;
};


/**
 * Update search input placeholder text.
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.updateSearchLabelOld_ = function() {
  var label = 'Search';
  var filter = this.getFilter();
  if (filter == ydn.crm.su.RecordFilter.ALL) {
    label += ' All';
  } else if (filter == ydn.crm.su.RecordFilter.MY) {
    label += ' My';
  } else if (filter == ydn.crm.su.RecordFilter.FAVORITE) {
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
  var new_btn = this.toolbar_.getChildAt(0);
  hd.listen(new_btn, goog.ui.Component.EventType.ACTION,
      this.onNew_);
  hd.listen(this.menu_filter_, goog.ui.Component.EventType.ACTION,
      this.onFilterAction_);
  hd.listen(this.menu_order_, goog.ui.Component.EventType.ACTION,
      this.onOrderAction_);
  var tgl = this.getSearchToggle();
  hd.listen(tgl, goog.ui.Component.EventType.ACTION,
      this.onSearchToggle_);
  hd.listen(this.getSearchCtrl(), goog.ui.Component.EventType.ACTION,
      this.onSearch_);
};


/**
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onNew_ = function(ev) {
  var data = {
    'module': this.getModule()
  };
  var se = new ydn.crm.ui.events.ShowPanelEvent(ydn.crm.ui.PageName.NEW_RECORD,
      data, this);
  this.dispatchEvent(se);
};


/**
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onFilterAction_ = function(ev) {
  if (ev.target instanceof goog.ui.CheckBoxMenuItem) {
    var item = /** @type {goog.ui.CheckBoxMenuItem} */(ev.target);
    var name = /** @type {ydn.crm.su.RecordFilter} */(item.getModel() || '');
    if (name) {
      var updated = this.selectFilter(name);
      if (updated) {
        this.browse_panel_.setFilter(name);
      }
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
    var name = /** @type {ydn.crm.su.RecordOrder} */(item.getModel());
    if (name) {
      var updated = this.selectOrder(name);
      if (updated) {
        this.browse_panel_.setOrder(name);
      }
    }
  }
};


/**
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onSearch_ = function(ev) {
  var input = /** @type {wgui.TextInput} */(ev.currentTarget);
  var q = input.getContent() || '';
  this.search_panel_.getModel().search(q);
};


/**
 * @param {goog.events.Event} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onSearchToggle_ = function(ev) {
  var toggle = /** @type {goog.ui.ToggleButton} */(ev.currentTarget);
  this.selectSearch_(toggle.isChecked());
};


/**
 * @param {boolean} val
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.selectSearch_ = function(val) {
  this.getSearchCtrl().setVisible(val);
  this.getOrderButton().setVisible(!val);
  this.getFilterButton().setVisible(!val);
  this.browse_panel_.setVisible(!val);
  this.search_panel_.setVisible(val);
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
  var filter;
  if (obj['filter']) {
    filter = /** @type {ydn.crm.su.RecordFilter} */(obj['filter']);
    goog.asserts.assert(ydn.crm.su.recordFilters.indexOf(filter) >= 0, filter);
  }
  var mn = /** @type {ydn.crm.su.ModuleName} */(obj['module']);
  this.setModule(mn, filter);
  this.updateFilterOnModule_(mn);
};
