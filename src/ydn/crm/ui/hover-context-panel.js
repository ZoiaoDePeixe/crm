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
 * @fileoverview Hover Context Panel, that how contact information on hovering
 * email on Email thread.
 *
 *  * @author kyawtun@yathit.com (Kyaw Tun)
 */



goog.provide('ydn.crm.ui.HoverContextPanel');
goog.require('goog.ui.Component');
goog.require('ydn.ui.FlyoutMenu');



/**
 * Hover Context Panel
 * @param {goog.dom.DomHelper=} opt_dom
 * @constructor
 * @struct
 * @extends {goog.ui.Component}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.ui.HoverContextPanel = function(opt_dom) {
  goog.base(this, opt_dom);
  var opt = {iconName: 'menu'};
  /**
   * Menu.
   * @type {ydn.ui.FlyoutMenu}
   * @private
   */
  this.menu_ = new ydn.ui.FlyoutMenu(opt, ydn.crm.ui.HoverContextPanel.MENU_ITEMS);
};
goog.inherits(ydn.crm.ui.HoverContextPanel, goog.ui.Component);


/**
 * @return {ydn.crm.inj.Context}
 * @override
 */
ydn.crm.ui.HoverContextPanel.prototype.getModel;


/**
 * @const
 * @type {Array<ydn.ui.FlyoutMenu.ItemOption>}
 */
ydn.crm.ui.HoverContextPanel.MENU_ITEMS = [{
  name: 'add.Contacts',
  label: 'Add to Contacts'
},{
  name: 'add.Leads',
  label: 'Add to Leads'
},{
  name: 'add.Accounts',
  label: 'Add to Accounts'
},{
  name: 'new',
  label: 'New...',
  children: [{
    name: 'Contacts',
    label: 'Contacts'
  }, {
    name: 'Leads',
    label: 'Leads'
  }, {
    name: 'Accounts',
    label: 'Accounts'
  }]
}];


/**
 * @override
 */
ydn.crm.ui.HoverContextPanel.prototype.setModel = function(model) {
  goog.base(this, 'setModel', model);
  this.refresh_();
};


/**
 * @const
 * @type {string}
 */
ydn.crm.ui.HoverContextPanel.CSS_CLASS = 'hover-context-panel';


/**
 * @inheritDoc
 */
ydn.crm.ui.HoverContextPanel.prototype.createDom = function() {
  goog.base(this, 'createDom');
  var dom = this.getDomHelper();
  var root = this.getElement();
  var t = ydn.ui.getTemplateById('hover-context-panel-template').content;
  root.appendChild(t.cloneNode(true));
  var menu_el = root.querySelector('.header .menu-holder');
  this.menu_.render(menu_el);
  goog.style.setElementShown(root, false);
};


/**
 * @inheritDoc
 */
ydn.crm.ui.HoverContextPanel.prototype.enterDocument = function() {
  goog.base(this, 'enterDocument');
  var root = this.getElement();
  var a = root.querySelector('.header a');
  this.getHandler().listen(a, 'click', this.onTitleClick_);
  var btn = root.querySelector('.header .menu-holder');
  this.getHandler().listen(btn, 'click', this.onMenuClick_);
};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.onMenuClick_ = function(e) {

};


/**
 * @param {goog.events.BrowserEvent} e
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.onTitleClick_ = function(e) {

};


/**
 * Refresh UI.
 * @private
 */
ydn.crm.ui.HoverContextPanel.prototype.refresh_ = function() {
  /**
   * @type {ydn.crm.inj.Context}
   */
  var model = this.getModel();
  var el = this.getElement();
  if (model) {
    // do basic rendering.
    var root = this.getElement();
    var name = model.getFullName();
    var email = model.getEmail();
    var icon = root.querySelector('.header .icon');
    var a = root.querySelector('.header a');
    var content = root.querySelector('.content');
    goog.style.setElementShown(icon, false);
    a.removeAttribute('href');
    a.removeAttribute('title');
    if (name) {
      a.textContent = name;
      content.textContent = email;
    } else {
      content.textContent = '';
    }
    goog.style.setElementShown(el, true);
  } else {
    goog.style.setElementShown(el, false);
  }
};

