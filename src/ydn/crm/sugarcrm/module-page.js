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
  this.toolbar_ = new goog.ui.Toolbar();
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
  var s_menu = new goog.ui.Menu(dom);
  s_menu.addChild(new goog.ui.CheckBoxMenuItem('Id', 'id', dom), true);
  var r_item = new goog.ui.CheckBoxMenuItem('Recent', 'recent', dom);
  r_item.setChecked(true);
  s_menu.addChild(r_item, true);
  s_menu.addChild(new goog.ui.CheckBoxMenuItem('Name', 'name', dom), true);
  var sort = new goog.ui.MenuButton(null, s_menu, null, dom);
  sort.setPositionElement(search_btn.getElement());
  sort.addClassName('goog-menu-button-collapse-left');
  this.toolbar_.addChild(sort, false);
  sort.render(combo_el);
  sort.setTooltip('Modify filter and sort order');
  this.toolbar_.render(head);

};


/**
 * @inheritDoc
 */
ydn.crm.su.ui.ModulePage.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');

};


/**
 * @param {goog.events.BrowserEvent} ev
 * @private
 */
ydn.crm.su.ui.ModulePage.prototype.onTileClick_ = function(ev) {

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
